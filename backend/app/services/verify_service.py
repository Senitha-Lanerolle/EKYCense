from __future__ import annotations

import pandas as pd
import numpy as np
from rapidfuzz import fuzz
from rapidfuzz import process
import jellyfish
from backend.app.db import db_session
from backend.app.repositories.case_repo import create_case

from backend.app.schemas.verify import VerifyRequest, VerifyResponse, CandidateHit
from backend.app.core.config import settings
from backend.app.services.model_store import get_embedder, get_hybrid_model

from backend.app.services.fuzzy_engine import fuzzy_score_and_decision


_df: pd.DataFrame | None = None
_df_filtered: pd.DataFrame | None = None

import re

def is_valid_person_name(name: str) -> bool:
    """Reject obvious junk like short acronyms, codes, pure digits, etc."""
    if not name:
        return False

    name = str(name).strip()

    
    if len(name) < 6 or len(name) > 120:
        return False

   
    if sum(ch.isalpha() for ch in name) < 4:
        return False


    tokens = [t for t in re.split(r"[\s\-]+", name) if t]
    if len(tokens) < 2:
        return False

    
    short_tokens = sum(1 for t in tokens if len(t) <= 3)
    if short_tokens == len(tokens):
        return False
    
    if short_tokens >= 2 and len(name) < 12:
        return False

    
    for t in tokens:
        if re.fullmatch(r"\d+", t):
            return False
        if re.search(r"\d", t) and re.fullmatch(r"[A-Za-z0-9]+", t):
            return False

    
    non_letters = sum(not ch.isalpha() for ch in name)
    if non_letters / max(1, len(name)) > 0.6:
        return False

    return True


def get_sanctions_df() -> pd.DataFrame:
    """Load once and keep a pre-filtered view for speed + quality."""
    global _df, _df_filtered

    if _df is None:
        cols = ["person_id", "name", "name_norm", "countries", "dataset"]
        _df = pd.read_parquet(settings.SANCTIONS_NAMES_PARQUET, columns=cols)
        _df["countries"] = _df["countries"].fillna("").astype(str)
        _df["dataset"] = _df["dataset"].fillna("").astype(str)
        _df["name_norm"] = _df["name_norm"].fillna("").astype(str)
        _df["name"] = _df["name"].fillna("").astype(str)

    
    if _df_filtered is None:
        tmp = _df.copy()

        
        tmp = tmp[tmp["name"].apply(is_valid_person_name)].reset_index(drop=True)

        
        if "name_norm" not in tmp.columns:
            tmp["name_norm"] = tmp["name"].map(_normalize_name_for_contains)
        else:
            tmp["name_norm"] = tmp["name_norm"].map(_normalize_name_for_contains)

        
        tmp["name_norm_exact"] = tmp["name"].map(_normalize_query_for_exact)

        _df_filtered = tmp

    return _df_filtered


def normalize_country(c: str | None) -> str | None:
    if not c:
        return None
    t = c.strip().lower()

    
    if t in {"sri lanka", "sri-lanka", "lk"}:
        return "lk"

    
    if len(t) == 2 and t.isalpha():
        return t

    return t


def _normalize_name_for_contains(s: str) -> str:
   
    s = str(s).strip().lower()
    s = re.sub(r"\s+", " ", s)
    return s

def _normalize_query_for_exact(s: str) -> str:
    """A stricter normalization for exact match checks (still lightweight)."""
    s = _normalize_name_for_contains(s)

    s = re.sub(r"[\.,'\"`’”“()\[\]{}]", "", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def _name_tokens_simple(s: str) -> list[str]:
    s = str(s).strip().lower()
    
    return [t for t in re.split(r"[\s\-]+", s) if t]



def _first_last_tokens(s: str) -> tuple[str, str]:
    toks = _name_tokens_simple(s)
    if not toks:
        return "", ""
    if len(toks) == 1:
        return toks[0], toks[0]
    return toks[0], toks[-1]


def same_identity_gate(qname: str, cand_name: str, lex_score: float, sem_score: float, fuzzy_score: float) -> str:
    """
    Identity gate that supports:
      - Surname-first formats (e.g., 'Putin Vladimir Vladimirovich')
      - Initials in query (e.g., 'V. Putin')
      - Keeps your original safety goal: avoid family-member false MATCHes.
    Returns: MATCH / PARTIAL_MATCH / NO_MATCH
    """
    qt = _name_tokens_simple(qname)
    ct = _name_tokens_simple(cand_name)

    if len(qt) < 2 or len(ct) < 2:
        return "NO_MATCH"


    def jw(a: str, b: str) -> float:
        return float(jellyfish.jaro_winkler_similarity(a, b)) if a and b else 0.0

    def is_initial(tok: str) -> bool:
        tok = tok.strip().lower().replace(".", "")
        return len(tok) == 1 and tok.isalpha()

    def initial_of(tok: str) -> str:
        tok = tok.strip().lower()
        return tok[0] if tok else ""

    
    q_surname = qt[-1]  

    c_surname_best = max((jw(q_surname, t), t) for t in ct)[0]

    surname_ok = c_surname_best >= 0.92
    if not surname_ok:
        
        if fuzzy_score >= settings.PARTIAL_THRESHOLD and (sem_score >= 0.80 or lex_score >= 0.85):
            return "PARTIAL_MATCH"
        return "NO_MATCH"

    
    q_first = qt[0].strip().lower()
    q_first_is_init = is_initial(q_first)

    
    if q_first_is_init:
        q_init = q_first.replace(".", "")
        
        given_init_match = any(initial_of(t) == q_init for t in ct if t != q_surname)
        if not given_init_match:
            
            if sem_score >= 0.90 and lex_score >= 0.80:
                return "PARTIAL_MATCH"
            return "NO_MATCH"
    else:
        
        given_best = max(jw(q_first, t) for t in ct)
        if given_best < 0.88:
           
            if sem_score >= 0.90 and lex_score >= 0.80:
                return "PARTIAL_MATCH"
            return "NO_MATCH"

    
    if (fuzzy_score >= settings.MATCH_THRESHOLD) and (sem_score >= 0.86 or (lex_score >= 0.93 and sem_score >= 0.80)):
        return "MATCH"

    if fuzzy_score >= settings.PARTIAL_THRESHOLD and (sem_score >= 0.70 or lex_score >= 0.78):
        return "PARTIAL_MATCH"

    return "NO_MATCH"


def build_candidate_pool(df: pd.DataFrame, qname: str, country: str | None) -> pd.DataFrame:
    """Build a candidate pool that is accurate (doesn't miss true match often) and fast.
    """
    cand = df

    
    if country:
        tmp = df[df["countries"].str.contains(country, na=False, case=False)]
        cand = tmp if len(tmp) > 1000 else df  

    q_norm = _normalize_name_for_contains(qname)
    q_tokens = [t for t in re.split(r"[\s\-]+", q_norm) if t]
    
    q_tokens_long = [t for t in q_tokens if len(t) >= 4]

    
    _, q_last = _first_last_tokens(q_norm)
    surname_tok = q_last if len(q_last) >= 4 else ""

    
    longest = sorted(q_tokens_long, key=len, reverse=True)[:2]

    token_hits = cand
    if longest:
        for tok in longest:
            if "name_norm" in token_hits.columns:
                token_hits = token_hits[token_hits["name_norm"].str.contains(tok, na=False, case=False)]
            else:
                token_hits = token_hits[token_hits["name"].str.contains(tok, na=False, case=False)]

    
    surname_hits = cand
    if surname_tok:
        if "name_norm" in surname_hits.columns:
            surname_hits = surname_hits[surname_hits["name_norm"].str.contains(surname_tok, na=False, case=False)]
        else:
            surname_hits = surname_hits[surname_hits["name"].str.contains(surname_tok, na=False, case=False)]

    
    pools: list[pd.DataFrame] = []

    
    if longest and 500 <= len(token_hits) <= 300_000:
        pools.append(token_hits)

    
    if surname_tok and len(surname_hits) > 0:
        pools.append(surname_hits.head(300_000))

    if pools:
    
        out = pd.concat(pools, axis=0, ignore_index=True)
        out = out.drop_duplicates(subset=["person_id", "name"], keep="first")
        return out

    return cand


def lexical_features(a: str, b: str) -> dict:
    a = a.strip()
    b = b.strip()

    len_a = len(a)
    len_b = len(b)
    len_diff = abs(len_a - len_b)

    ta = set([t for t in a.lower().split() if t])
    tb = set([t for t in b.lower().split() if t])
    tok_jaccard = (len(ta & tb) / len(ta | tb)) if (ta or tb) else 0.0

    fuzz_ratio = fuzz.ratio(a, b) / 100.0
    fuzz_wratio = fuzz.WRatio(a, b) / 100.0
    tok_sort = fuzz.token_sort_ratio(a, b) / 100.0
    tok_set = fuzz.token_set_ratio(a, b) / 100.0

    ascii_ratio = sum(1 for ch in a if ord(ch) < 128) / max(1, len_a)

    jaro_winkler = float(jellyfish.jaro_winkler_similarity(a.lower(), b.lower()))
    dist = jellyfish.levenshtein_distance(a.lower(), b.lower())
    lev_sim = 1.0 - (dist / max(1, max(len_a, len_b)))

    return {
        "len_a": float(len_a),
        "len_b": float(len_b),
        "len_diff": float(len_diff),
        "tok_jaccard": float(tok_jaccard),
        "fuzz_ratio": float(fuzz_ratio),
        "fuzz_wratio": float(fuzz_wratio),
        "tok_sort": float(tok_sort),
        "tok_set": float(tok_set),
        "ascii_ratio": float(ascii_ratio),
        "jaro_winkler": float(jaro_winkler),
        "lev_sim": float(lev_sim),
    }


def semantic_cosine_batch(query: str, candidates: list[str]) -> list[float]:
    """Compute cosine similarities in one batch (fast)."""
    if not candidates:
        return []

    model = get_embedder()

    
    qv = model.encode([query], normalize_embeddings=True)

    
    cv = model.encode(candidates, normalize_embeddings=True, batch_size=64)

    
    sims = (cv @ qv.T).reshape(-1)
    return [float(x) for x in sims]


def risk_from_decision(decision: str) -> str:
    return {"MATCH": "HIGH", "PARTIAL_MATCH": "MEDIUM"}.get(decision, "LOW")



def _audit_log(payload: VerifyRequest, resp: VerifyResponse) -> None:
    """Best-effort audit logging; never breaks verification flow."""
    try:
        with db_session() as db:
            create_case(
                db,
                full_name=payload.full_name,
                country=normalize_country(payload.country),
                decision=resp.decision,
                risk_level=resp.risk_level,
                request_json=payload.model_dump(),
                response_json=resp.model_dump(),
            )
            
            try:
                db.commit()
            except Exception:
                pass
    except Exception as e:
        import traceback
        print(f"[audit][WARN] Failed to log case: {e}")
        traceback.print_exc()



def _predict_hybrid_proba(hybrid_obj, X: pd.DataFrame) -> tuple[np.ndarray, dict]:
    """Return (proba_vec, meta) for the hybrid classifier.

    Supports either:
      - a sklearn-like estimator with predict_proba
      - a dict artifact: {"model": estimator, "feature_cols": [...], "threshold": float, ...}

    If hybrid is missing/unavailable, returns zeros.
    """
    meta: dict = {"enabled": False}

    if hybrid_obj is None:
        return np.zeros(len(X), dtype=float), meta

    
    if isinstance(hybrid_obj, dict):
        clf = hybrid_obj.get("model")
        feature_cols = hybrid_obj.get("feature_cols")
        threshold = hybrid_obj.get("threshold")
        meta = {
            "enabled": clf is not None,
            "feature_cols": list(feature_cols) if feature_cols else list(X.columns),
            "threshold": float(threshold) if threshold is not None else None,
        }
        if clf is None or not hasattr(clf, "predict_proba"):
            return np.zeros(len(X), dtype=float), meta

        X_use = X.copy()
        if feature_cols:
            
            for c in feature_cols:
                if c not in X_use.columns:
                    X_use[c] = 0.0
            X_use = X_use[list(feature_cols)]
        try:
            proba = clf.predict_proba(X_use)[:, 1]
            return np.asarray(proba, dtype=float), meta
        except Exception:
            return np.zeros(len(X), dtype=float), meta

    
    if hasattr(hybrid_obj, "predict_proba"):
        meta = {"enabled": True, "feature_cols": list(X.columns), "threshold": None}
        try:
            proba = hybrid_obj.predict_proba(X)[:, 1]
            return np.asarray(proba, dtype=float), meta
        except Exception:
            return np.zeros(len(X), dtype=float), meta

    return np.zeros(len(X), dtype=float), meta


def verify_name(payload: VerifyRequest) -> VerifyResponse:
    df = get_sanctions_df()
    qname = payload.full_name.strip()
    country = normalize_country(payload.country)

    
    q_norm_exact = _normalize_query_for_exact(qname)

    
    cand = build_candidate_pool(df, qname, country)

    if len(cand) > 0:
        
        if "name_norm_exact" in cand.columns:
            exact_hits = cand[cand["name_norm_exact"] == q_norm_exact]
        else:
            exact_hits = cand[cand["name_norm"] == q_norm_exact]
        if not exact_hits.empty:
            
            if country:
                exact_country = exact_hits[exact_hits["countries"].str.contains(country, na=False, case=False)]
                if not exact_country.empty:
                    exact_hits = exact_country

            row = exact_hits.iloc[0]
            hit = CandidateHit(
                person_id=str(row["person_id"]),
                matched_name=str(row["name"]),
                dataset=str(row.get("dataset", "")),
                lexical_similarity=1.0,
                semantic_similarity=1.0,
                fuzzy_score=1.0,
                decision="MATCH",
            )
            resp_fast = VerifyResponse(
                query={"full_name": qname, "country": country, "top_k": payload.top_k},
                decision="MATCH",
                risk_level=risk_from_decision("MATCH"),
                top_hits=[hit],
                explanation={
                    "how_it_works": "Exact normalized match found in sanctions/PEP dataset (fast path).",
                    "thresholds": {"match": settings.MATCH_THRESHOLD, "partial": settings.PARTIAL_THRESHOLD},
                    "note": "Exact path bypasses embedding computation for speed and precision.",
                    "hybrid": {"enabled": False, "threshold": None, "feature_cols": None},
                },
            )
            _audit_log(payload, resp_fast)
            return resp_fast

    
    if len(cand) > 200_000:
        
        _, q_last = _first_last_tokens(qname)
        q_last = _normalize_name_for_contains(q_last)

        reduced = None
        if q_last and len(q_last) >= 4 and "name_norm" in cand.columns:
            tmp = cand[cand["name_norm"].str.contains(q_last, na=False, case=False)]
            if len(tmp) >= 500:
                reduced = tmp

        if reduced is None:
            q_tokens = [t for t in _name_tokens_simple(qname) if len(t) >= 4]
            q_tokens = sorted(q_tokens, key=len, reverse=True)
            if q_tokens and "name_norm" in cand.columns:
                tok = q_tokens[0]
                tmp = cand[cand["name_norm"].str.contains(tok, na=False, case=False)]
                if len(tmp) >= 500:
                    reduced = tmp

        if reduced is not None:
            cand = reduced

        cand = cand.head(200_000).copy()

    
    names = cand["name"].astype(str).tolist()
    best = process.extract(qname, names, scorer=fuzz.WRatio, limit=5000)

    
    best = [t for t in best if (t[1] / 100.0) >= 0.35]
    if not best:
        return VerifyResponse(
            query={"full_name": qname, "country": country, "top_k": payload.top_k},
            decision="NO_MATCH",
            risk_level="LOW",
            top_hits=[],
            explanation={
                "how_it_works": "No reasonable lexical candidates found in the sanctions dataset.",
                "thresholds": {"match": settings.MATCH_THRESHOLD, "partial": settings.PARTIAL_THRESHOLD},
                "note": "Try a different spelling or provide a country filter to narrow search."
            }
        )

    idx = [i for _, _, i in best]
    cand = cand.iloc[idx].copy().reset_index(drop=True)

    
    cand["_lex_pref"] = [score / 100.0 for _, score, _ in best]
    cand = cand.sort_values("_lex_pref", ascending=False).head(250).reset_index(drop=True)

    hybrid = get_hybrid_model()

    
    top_names = cand["name"].astype(str).tolist()
    sem_sims = semantic_cosine_batch(qname, top_names)

    
    feats_list: list[dict] = []
    lex_display_list: list[float] = []

    q_tokens_simple = _name_tokens_simple(qname)
    q_first_tok = q_tokens_simple[0] if q_tokens_simple else ""

    for bname, sem in zip(top_names, sem_sims):
        feats = lexical_features(qname, bname)
        feats["embed_cosine"] = float(sem)
        
        feats["semantic_cosine"] = float(sem)
        feats["lexical_ratio"] = float(feats["fuzz_ratio"])
        feats["token_sort"] = float(feats["tok_sort"])
        feats["token_set"] = float(feats["tok_set"])

        c_tokens_simple = _name_tokens_simple(bname)
        c_first_tok = c_tokens_simple[0] if c_tokens_simple else ""
        feats["first_token_match"] = float(jellyfish.jaro_winkler_similarity(q_first_tok, c_first_tok)) if (q_first_tok and c_first_tok) else 0.0
        # ---
        feats_list.append(feats)
        lex_display_list.append(float(feats["fuzz_wratio"]))

    
    X = pd.DataFrame(feats_list)

    
    proba_vec, hybrid_meta = _predict_hybrid_proba(hybrid, X)

    hits: list[tuple[float, CandidateHit]] = []

    for i, row in cand.iterrows():
        bname = str(row["name"])
        sem = float(sem_sims[i])

        
        fuzzy_score, _fuzzy_decision = fuzzy_score_and_decision(lex_display_list[i], sem)

        
        final_hit_decision = same_identity_gate(
            qname=qname,
            cand_name=bname,
            lex_score=lex_display_list[i],
            sem_score=sem,
            fuzzy_score=float(fuzzy_score),
        )

        
        if hybrid_meta.get("enabled"):
            rank_score = 0.65 * float(fuzzy_score) + 0.35 * float(proba_vec[i])
        else:
            rank_score = float(fuzzy_score)

        hits.append((float(rank_score), CandidateHit(
            person_id=str(row["person_id"]),
            matched_name=bname,
            dataset=str(row.get("dataset", "")),
            lexical_similarity=lex_display_list[i],
            semantic_similarity=sem,
            fuzzy_score=float(fuzzy_score),
            decision=str(final_hit_decision)
        )))

    hits.sort(key=lambda x: x[0], reverse=True)

    
    seen: set[str] = set()
    deduped: list[CandidateHit] = []
    for _, h in hits:
        pid = str(h.person_id)
        if pid in seen:
            continue
        seen.add(pid)
        deduped.append(h)
        if len(deduped) >= max(payload.top_k * 3, 25):
            break

    
    meaningful = [h for h in deduped if h.decision in {"MATCH", "PARTIAL_MATCH"}]
    top_hits = meaningful[: payload.top_k]

    
    if not top_hits:
        final_decision = "NO_MATCH"
    elif any(h.decision == "MATCH" for h in top_hits):
        final_decision = "MATCH"
    else:
        final_decision = "PARTIAL_MATCH"

    risk = risk_from_decision(final_decision)

    resp = VerifyResponse(
        query={"full_name": qname, "country": country, "top_k": payload.top_k},
        decision=final_decision,
        risk_level=risk,
        top_hits=top_hits,
        explanation={
            "how_it_works": "Two-stage search: (1) safe candidate pool + lexical shortlist, (2) batch multilingual embedding similarity + fuzzy rules, (3) identity gate prevents false MATCHes (e.g., same last name but different first name). Ranking blends fuzzy score with hybrid model probability.",
            "thresholds": {"match": settings.MATCH_THRESHOLD, "partial": settings.PARTIAL_THRESHOLD},
            "note": "Decision uses fuzzy_score plus an identity gate to reduce false MATCHes. Ranking blends fuzzy_score with the hybrid model probability.",
            "hybrid": {
                "enabled": bool(hybrid_meta.get("enabled")),
                "threshold": hybrid_meta.get("threshold"),
                "feature_cols": hybrid_meta.get("feature_cols"),
            },
        },
    )
    _audit_log(payload, resp)
    return resp
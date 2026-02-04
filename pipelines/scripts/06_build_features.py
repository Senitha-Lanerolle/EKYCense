from __future__ import annotations
from pathlib import Path
import re
import unicodedata
import numpy as np
import pandas as pd 
import pyarrow.parquet as pq

from rapidfuzz import fuzz
import jellyfish
from unidecode import unidecode

BASE = Path(__file__).resolve().parents[2]

POS = BASE / "data/processed/pos_train.parquet"
NEG = BASE / "data/processed/neg_train.parquet"
OUT = BASE / "data/processed/train_lexical_features.parquet"

SEED = 42


N_POS = 400_000
N_NEG = 400_000

def norm_basic(s: str) -> str:
    s = "" if s is None else str(s)
    s = s.strip().lower()
    s = unicodedata.normalize("NFKC", s)
    return s

def norm_ascii(s: str) -> str:
    return unidecode(norm_basic(s))

_ws = re.compile(r"\s+")
_non_alnum = re.compile(r"[^\w\s]+", flags=re.UNICODE)

def norm_tokens(s: str) -> list[str]:
    s = norm_basic(s)
    s = _non_alnum.sub(" ", s)
    s = _ws.sub(" ", s).strip()
    if not s:
        return []
    return s.split(" ")

def token_jaccard(a: str, b: str) -> float:
    ta = set(norm_tokens(a))
    tb = set(norm_tokens(b))
    if not ta and not tb:
        return 1.0
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / max(1, len(ta | tb))

def safe_ratio(fn, a: str, b: str) -> float:
    try:
        return float(fn(a, b))
    except Exception:
        return 0.0

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    a = df["name_a"].astype(str)
    b = df["name_b"].astype(str)

    a_norm = a.map(norm_basic)
    b_norm = b.map(norm_basic)

    a_ascii = a.map(norm_ascii)
    b_ascii = b.map(norm_ascii)

    
    df_out = pd.DataFrame({
        "name_a": a,
        "name_b": b,
        "label": df["label"].astype(int),

        "len_a": a_norm.str.len().astype(np.int16),
        "len_b": b_norm.str.len().astype(np.int16),
        "len_diff": (a_norm.str.len() - b_norm.str.len()).abs().astype(np.int16),

        "tok_jaccard": [token_jaccard(x, y) for x, y in zip(a_norm, b_norm)],

        "fuzz_ratio":   [safe_ratio(fuzz.ratio, x, y)/100.0 for x, y in zip(a_norm, b_norm)],
        "fuzz_wratio":  [safe_ratio(fuzz.WRatio, x, y)/100.0 for x, y in zip(a_norm, b_norm)],
        "tok_sort":     [safe_ratio(fuzz.token_sort_ratio, x, y)/100.0 for x, y in zip(a_norm, b_norm)],
        "tok_set":      [safe_ratio(fuzz.token_set_ratio, x, y)/100.0 for x, y in zip(a_norm, b_norm)],

        
        "ascii_ratio":  [safe_ratio(fuzz.ratio, x, y)/100.0 for x, y in zip(a_ascii, b_ascii)],

        
        "jaro_winkler": [float(jellyfish.jaro_winkler_similarity(x, y)) for x, y in zip(a_norm, b_norm)],

        
        "lev_sim":      [
            1.0 - (jellyfish.levenshtein_distance(x, y) / max(1, max(len(x), len(y))))
            for x, y in zip(a_norm, b_norm)
        ],
    })

    return df_out

def sample_parquet(path: Path, n: int, cols: list[str]) -> pd.DataFrame:
    
    df = pd.read_parquet(path, columns=cols)
    if len(df) <= n:
        return df
    return df.sample(n=n, random_state=SEED)

def main():
    print("🚨 BUILD LEXICAL FEATURES (TRAIN)")
    print("POS:", POS)
    print("NEG:", NEG)
    print("OUT:", OUT)

    for p in [POS, NEG]:
        if not p.exists():
            raise FileNotFoundError(p)

    cols = ["name_a", "name_b", "label"]

    print("Loading + sampling positives...")
    pos = sample_parquet(POS, N_POS, cols)
    print("pos rows:", len(pos))

    print("Loading + sampling negatives...")
    neg = sample_parquet(NEG, N_NEG, cols)
    print("neg rows:", len(neg))

    df = pd.concat([pos, neg], ignore_index=True)
    df = df.sample(frac=1.0, random_state=SEED).reset_index(drop=True)
    print("combined rows:", len(df))

    print("Computing features...")
    feats = build_features(df)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    feats.to_parquet(OUT, index=False)
    print("✅ Saved:", OUT)
    print("shape:", feats.shape)
    print("label counts:")
    print(feats["label"].value_counts())
    print("head:")
    print(feats.head(5).to_string(index=False))

if __name__ == "__main__":
    main()

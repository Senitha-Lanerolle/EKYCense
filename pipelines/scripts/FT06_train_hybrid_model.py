import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from rapidfuzz import fuzz
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import train_test_split
from tqdm import tqdm

from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim

ROOT = Path(__file__).resolve().parents[2]
PAIRS_PATH = ROOT / "data/processed/hybrid_pairs.parquet"
OUT_DIR = ROOT / "models/hybrid"
OUT_MODEL = OUT_DIR / "hybrid_model.joblib"
OUT_META = OUT_DIR / "hybrid_model_meta.json"


EMBEDDER_PATH = ROOT / "models/xlmr_name_embedder_triplet"

SEED = 42
BATCH = 64


def norm(s: str) -> str:
    if s is None:
        return ""
    return " ".join(str(s).strip().lower().split())


def compute_semantic(model: SentenceTransformer, a_list, b_list, batch=BATCH):
    sims = []
    for i in tqdm(range(0, len(a_list), batch), desc="Embedding batches"):
        a = a_list[i:i+batch]
        b = b_list[i:i+batch]
        ea = model.encode(a, batch_size=batch, convert_to_numpy=True, normalize_embeddings=True, show_progress_bar=False)
        eb = model.encode(b, batch_size=batch, convert_to_numpy=True, normalize_embeddings=True, show_progress_bar=False)
       
        sims.extend((ea * eb).sum(axis=1).tolist())
    return np.array(sims, dtype=np.float32)


def main():
    if not PAIRS_PATH.exists():
        raise FileNotFoundError(f"Pairs not found: {PAIRS_PATH}. Run FT05 first.")

    if not EMBEDDER_PATH.exists():
        raise FileNotFoundError(f"Embedder not found: {EMBEDDER_PATH}. Make sure triplet model exists.")

    

    df = pd.read_parquet(PAIRS_PATH)
    df["name_a"] = df["name_a"].map(norm)
    df["name_b"] = df["name_b"].map(norm)

    
    print(f"[hybrid] Loading embedder: {EMBEDDER_PATH}")
    embedder = SentenceTransformer(str(EMBEDDER_PATH))

    
    df["semantic_cosine"] = compute_semantic(embedder, df["name_a"].tolist(), df["name_b"].tolist())

    
    def first_token(x):
        parts = x.split()
        return parts[0] if parts else ""
    df["first_token_match"] = (df["name_a"].map(first_token) == df["name_b"].map(first_token)).astype(int)

    
    feature_cols = [
        "lexical_ratio",
        "lexical_token_sort",
        "lexical_token_set",
        "semantic_cosine",
        "first_token_match",
    ]

    X = df[feature_cols].values
    y = df["label"].values.astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED, stratify=y
    )

    
    clf = LogisticRegression(max_iter=1000, n_jobs=1)
    clf.fit(X_train, y_train)

    probs = clf.predict_proba(X_test)[:, 1]
    preds = (probs >= 0.5).astype(int)

    print("\n=== Hybrid model evaluation ===")
    print("ROC-AUC:", round(roc_auc_score(y_test, probs), 4))
    print(classification_report(y_test, preds, digits=4))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "model": clf,
            "feature_cols": feature_cols,
            "threshold": 0.5,
        },
        OUT_MODEL
    )

    
    import json
    meta = {
        "embedder_path": str(EMBEDDER_PATH),
        "feature_cols": feature_cols,
        "threshold": 0.5,
    }
    OUT_META.write_text(json.dumps(meta, indent=2))
    print(f"Saved hybrid model → {OUT_MODEL}")
    print(f"Saved hybrid meta  → {OUT_META}")


if __name__ == "__main__":
    main()

import random
from pathlib import Path

import numpy as np
import pandas as pd
from rapidfuzz import fuzz
from tqdm import tqdm

ROOT = Path(__file__).resolve().parents[2]
TRIPLETS_PATH = ROOT / "data/processed/name_triplets.parquet"
OUT_PATH = ROOT / "data/processed/hybrid_pairs.parquet"


N_POS = int(60_000)   
N_NEG = int(60_000)   

SEED = 42


def norm(s: str) -> str:
    if s is None:
        return ""
    return " ".join(str(s).strip().lower().split())


def main():
    random.seed(SEED)
    np.random.seed(SEED)

    if not TRIPLETS_PATH.exists():
        raise FileNotFoundError(f"Triplets not found: {TRIPLETS_PATH}")

    df = pd.read_parquet(TRIPLETS_PATH)
    
    required = {"anchor", "positive", "negative"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Triplets parquet missing columns: {missing}. Found: {df.columns.tolist()}")

  
    if len(df) < max(N_POS, N_NEG):
        sample_df = df.sample(len(df), random_state=SEED)
    else:
        sample_df = df.sample(max(N_POS, N_NEG), random_state=SEED)

    rows = []

    
    pos_df = sample_df.sample(min(N_POS, len(sample_df)), random_state=SEED)
    for _, r in tqdm(pos_df.iterrows(), total=len(pos_df), desc="Building positives"):
        a = norm(r["anchor"])
        b = norm(r["positive"])
        rows.append({"name_a": a, "name_b": b, "label": 1})

    
    neg_df = sample_df.sample(min(N_NEG, len(sample_df)), random_state=SEED + 1)
    for _, r in tqdm(neg_df.iterrows(), total=len(neg_df), desc="Building negatives"):
        a = norm(r["anchor"])
        b = norm(r["negative"])
        rows.append({"name_a": a, "name_b": b, "label": 0})

    out = pd.DataFrame(rows).dropna()
    out = out[(out["name_a"] != "") & (out["name_b"] != "")]
    out = out.drop_duplicates()

    
    out["lexical_ratio"] = out.apply(lambda x: fuzz.ratio(x["name_a"], x["name_b"]) / 100.0, axis=1)
    out["lexical_token_sort"] = out.apply(lambda x: fuzz.token_sort_ratio(x["name_a"], x["name_b"]) / 100.0, axis=1)
    out["lexical_token_set"] = out.apply(lambda x: fuzz.token_set_ratio(x["name_a"], x["name_b"]) / 100.0, axis=1)

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    out.to_parquet(OUT_PATH, index=False)
    print(f"Saved hybrid labeled pairs: {len(out):,} rows → {OUT_PATH}")


if __name__ == "__main__":
    main()

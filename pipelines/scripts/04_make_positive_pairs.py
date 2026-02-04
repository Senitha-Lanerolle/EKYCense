from pathlib import Path
import pandas as pd
import numpy as np
from itertools import combinations

BASE = Path(__file__).resolve().parents[2]
INP = BASE / "data/interim/sanctions_names_synth.parquet"
SPLIT = BASE / "data/processed/train_people.csv"
OUT = BASE / "data/processed/pos_train.parquet"

SEED = 42
MAX_NAMES_PER_PERSON = 12
MAX_POS_PAIRS_PER_PERSON = 20

def main():
    print("BUILD POSITIVE PAIRS (TRAIN)")
    print("INPUT:", INP)
    print("SPLIT:", SPLIT)
    print("OUT:", OUT)

    train_people = set(pd.read_csv(SPLIT)["person_id"].astype(str))
    df = pd.read_parquet(INP, columns=["person_id","name","name_norm","variant_type"])
    df["person_id"] = df["person_id"].astype(str)

    df = df[df["person_id"].isin(train_people)]
    print("Rows after train filter:", len(df))

    df = df.sort_values(["person_id","variant_type"])
    df = df.groupby("person_id").head(MAX_NAMES_PER_PERSON).reset_index(drop=True)

    rng = np.random.default_rng(SEED)
    rows = []

    for pid, g in df.groupby("person_id"):
        names = g[["name","name_norm","variant_type"]].drop_duplicates("name_norm")
        if len(names) < 2:
            continue

        # prefer pairing primary with others (more realistic)
        prim = names[names["variant_type"] == "primary"]
        others = names[names["variant_type"] != "primary"]

        pairs = []
        if len(prim) > 0 and len(others) > 0:
            p = prim.iloc[0]["name"]
            for o in others["name"].tolist():
                pairs.append((p, o))
        else:
            # fallback: all-vs-all
            pairs = list(combinations(names["name"].tolist(), 2))

        if len(pairs) > MAX_POS_PAIRS_PER_PERSON:
            pairs = rng.choice(pairs, size=MAX_POS_PAIRS_PER_PERSON, replace=False)

        for a, b in pairs:
            rows.append({
                "name_a": a,
                "name_b": b,
                "label": 1,
                "person_id_a": pid,
                "person_id_b": pid,
            })

    out = pd.DataFrame(rows)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    out.to_parquet(OUT, index=False)

    print("Saved:", OUT)
    print("Positive pairs:", len(out))
    print(out.head(5).to_string(index=False))

if __name__ == "__main__":
    main()

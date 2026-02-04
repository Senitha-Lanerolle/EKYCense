import pandas as pd
from pathlib import Path

POS_PATH = Path("data/processed/pos_train.parquet")
NEG_PATH = Path("data/processed/neg_train.parquet")

OUT_TRAIN = Path("data/processed/st_pairs_train.parquet")
OUT_VAL   = Path("data/processed/st_pairs_val.parquet")


N_POS = 300_000
N_NEG = 300_000
VAL_FRAC = 0.05
SEED = 42

def main():
    pos = pd.read_parquet(POS_PATH, columns=["name_a","name_b","label"]).sample(N_POS, random_state=SEED)
    neg = pd.read_parquet(NEG_PATH, columns=["name_a","name_b","label"]).sample(N_NEG, random_state=SEED)

    df = pd.concat([pos, neg], ignore_index=True)
    df = df.sample(frac=1, random_state=SEED).reset_index(drop=True)

    val_n = int(len(df) * VAL_FRAC)
    val = df.iloc[:val_n].reset_index(drop=True)
    train = df.iloc[val_n:].reset_index(drop=True)

    OUT_TRAIN.parent.mkdir(parents=True, exist_ok=True)
    train.to_parquet(OUT_TRAIN, index=False)
    val.to_parquet(OUT_VAL, index=False)

    print("Saved:", OUT_TRAIN, train.shape)
    print("Saved:", OUT_VAL, val.shape)
    print("label train:\n", train["label"].value_counts())
    print("label val:\n", val["label"].value_counts())

if __name__ == "__main__":
    main()
from pathlib import Path
import pandas as pd

BASE = Path(__file__).resolve().parents[2]

LEX = BASE / "data/processed/train_lexical_features.parquet"
EMB = BASE / "data/processed/train_embedding_features.parquet"
OUT = BASE / "data/processed/train_hybrid_features.parquet"

def main():
    print("BUILD HYBRID FEATURES")

    lex = pd.read_parquet(LEX)
    emb = pd.read_parquet(EMB)

    df = lex.merge(
        emb[["name_a", "name_b", "embed_cosine"]],
        on=["name_a", "name_b"],
        how="inner"
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(OUT, index=False)

    print("Saved:", OUT)
    print("shape:", df.shape)
    print(df.head(3).to_string(index=False))

if __name__ == "__main__":
    main()
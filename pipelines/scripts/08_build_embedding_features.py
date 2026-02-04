from __future__ import annotations
from pathlib import Path
import numpy as np
import pandas as pd
from tqdm import tqdm

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

BASE = Path(__file__).resolve().parents[2]

INP = BASE / "data/processed/train_lexical_features.parquet"
OUT = BASE / "data/processed/train_embedding_features.parquet"

MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
BATCH_SIZE = 128
SEED = 42

def main():
    print("BUILD EMBEDDING FEATURES (MULTILINGUAL)")
    print("INPUT:", INP)
    print("OUTPUT:", OUT)

    df = pd.read_parquet(INP, columns=["name_a", "name_b", "label"])
    print("rows:", len(df))

    model = SentenceTransformer(MODEL_NAME)

    emb_sims = []

    print("Encoding names in batches...")
    for i in tqdm(range(0, len(df), BATCH_SIZE)):
        batch = df.iloc[i:i+BATCH_SIZE]

        emb_a = model.encode(
            batch["name_a"].tolist(),
            normalize_embeddings=True,
            show_progress_bar=False
        )
        emb_b = model.encode(
            batch["name_b"].tolist(),
            normalize_embeddings=True,
            show_progress_bar=False
        )

        sims = np.sum(emb_a * emb_b, axis=1)
        emb_sims.extend(sims.tolist())

    df_out = df.copy()
    df_out["embed_cosine"] = emb_sims

    OUT.parent.mkdir(parents=True, exist_ok=True)
    df_out.to_parquet(OUT, index=False)

    print("Saved:", OUT)
    print(df_out.head(5).to_string(index=False))

if __name__ == "__main__":
    main()
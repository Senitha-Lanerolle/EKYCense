import os

os.environ["CUDA_VISIBLE_DEVICES"] = ""
os.environ["ACCELERATE_USE_CPU"] = "true"
os.environ["PYTORCH_MPS_DISABLE"] = "1"
os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "0"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

import math
import time
from pathlib import Path

import pandas as pd
import torch
from torch.utils.data import DataLoader
from transformers import get_linear_schedule_with_warmup

from sentence_transformers import SentenceTransformer, InputExample
from sentence_transformers.losses import CosineSimilarityLoss

TRAIN_PATH = Path("data/processed/st_pairs_train.parquet")
VAL_PATH = Path("data/processed/st_pairs_val.parquet")

OUT_DIR = Path("models/xlmr_name_embedder")
BASE_MODEL = "sentence-transformers/paraphrase-xlm-r-multilingual-v1"


BATCH_SIZE = 8
EPOCHS = 1
LR = 2e-5
WARMUP_RATIO = 0.1
MAX_TRAIN = 50_000
MAX_VAL = 5_000
LOG_EVERY = 50


def to_examples(df: pd.DataFrame):
    return [
        InputExample(texts=[str(a), str(b)], label=float(y))
        for a, b, y in zip(df["name_a"], df["name_b"], df["label"])
    ]


def evaluate_cosine_mse(model: SentenceTransformer, loss_fn: CosineSimilarityLoss, loader: DataLoader) -> float:
    """Quick validation proxy: average loss over validation batches."""
    model.eval()
    losses = []
    with torch.no_grad():
        for features, labels in loader:
            for f in features:
                for k, v in f.items():
                    if torch.is_tensor(v):
                        f[k] = v.to("cpu")
            labels = labels.to("cpu")
            loss = loss_fn(features, labels)
            losses.append(float(loss.detach().cpu().item()))
    model.train()
    return sum(losses) / max(1, len(losses))


def main():
    
    device = torch.device("cpu")
    torch.set_num_threads(max(1, os.cpu_count() // 2))

    print("Loading data...")
    train_df = pd.read_parquet(TRAIN_PATH).sample(n=min(MAX_TRAIN, 10**9), random_state=42)
    val_df = pd.read_parquet(VAL_PATH).sample(n=min(MAX_VAL, 10**9), random_state=42)
    print("train:", train_df.shape, "val:", val_df.shape)

    print("Loading base model:", BASE_MODEL)
    model = SentenceTransformer(BASE_MODEL, device=str(device))
    model.to(device)

    train_loss = CosineSimilarityLoss(model=model)

    train_loader = DataLoader(
        to_examples(train_df),
        shuffle=True,
        batch_size=BATCH_SIZE,
        num_workers=0,
        pin_memory=False,
        collate_fn=model.smart_batching_collate,
    )

    val_loader = DataLoader(
        to_examples(val_df),
        shuffle=False,
        batch_size=BATCH_SIZE,
        num_workers=0,
        pin_memory=False,
        collate_fn=model.smart_batching_collate,
    )

    total_steps = len(train_loader) * EPOCHS
    warmup_steps = int(total_steps * WARMUP_RATIO)

    optimizer = torch.optim.AdamW(model.parameters(), lr=LR)
    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=warmup_steps,
        num_training_steps=total_steps,
    )

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Training (manual loop on CPU; no HF Trainer/Accelerate)...")
    global_step = 0
    start = time.time()

    for epoch in range(1, EPOCHS + 1):
        running = 0.0
        for step, (features, labels) in enumerate(train_loader, start=1):
            
            for f in features:
                for k, v in f.items():
                    if torch.is_tensor(v):
                        f[k] = v.to(device)
            labels = labels.to(device)

            optimizer.zero_grad(set_to_none=True)
            loss = train_loss(features, labels)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            scheduler.step()

            global_step += 1
            running += float(loss.detach().cpu().item())

            if step % LOG_EVERY == 0:
                avg = running / LOG_EVERY
                running = 0.0
                elapsed = time.time() - start
                it_s = global_step / max(1e-9, elapsed)
                eta = (total_steps - global_step) / max(1e-9, it_s)
                print(
                    f"epoch {epoch}/{EPOCHS} step {step}/{len(train_loader)} "
                    f"loss {avg:.4f} it/s {it_s:.2f} ETA {eta/60:.1f} min"
                )

        
        val_loss = evaluate_cosine_mse(model, train_loss, val_loader)
        print(f"✅ epoch {epoch} validation loss: {val_loss:.4f}")

    
    model.save(str(OUT_DIR))
    print("Saved fine-tuned model to:", OUT_DIR)


if __name__ == "__main__":
    main()
import os
from pathlib import Path
import math
import time
import pandas as pd
import torch
from torch.utils.data import DataLoader
from sentence_transformers import SentenceTransformer


TRIPLETS_PATH = Path("data/processed/name_triplets.parquet")
BASE_MODEL = "models/xlmr_name_embedder"  
OUT_DIR = Path("models/xlmr_name_embedder_triplet")

MAX_TRAIN_TRIPLETS = 30_000
EVAL_SAMPLES = 1000


BATCH_SIZE = 8                  
MAX_SEQ_LENGTH = 24             
EPOCHS = 1
LR = 2e-5
MARGIN = 0.3                  
LOG_EVERY = 20                


FORCE_CPU = os.getenv("FORCE_CPU", "0") == "1"


def _force_cpu_env() -> None:
    """Force all downstream stacks to prefer CPU over MPS."""
    os.environ["TOKENIZERS_PARALLELISM"] = "false"
    os.environ["CUDA_VISIBLE_DEVICES"] = ""  # no CUDA
    os.environ["ACCELERATE_USE_CPU"] = "true"
    os.environ["PYTORCH_MPS_DISABLE"] = "1"


def _device() -> torch.device:
    if FORCE_CPU:
        return torch.device("cpu")
    
    if torch.backends.mps.is_available() and torch.backends.mps.is_built():
        return torch.device("mps")
    return torch.device("cpu")


def _eval_triplet_accuracy(model: SentenceTransformer, eval_rows: pd.DataFrame, device: torch.device) -> float:
    """Simple eval: fraction where cos(anchor,pos) > cos(anchor,neg)."""
    model.eval()
    correct = 0
    total = len(eval_rows)

    with torch.no_grad():
        for r in eval_rows.itertuples(index=False):
            
            fa = model.tokenize([r.anchor])
            fp = model.tokenize([r.positive])
            fn = model.tokenize([r.negative])

            
            fa = {k: v.to(device) for k, v in fa.items()}
            fp = {k: v.to(device) for k, v in fp.items()}
            fn = {k: v.to(device) for k, v in fn.items()}

            ea = model(fa)["sentence_embedding"]
            ep = model(fp)["sentence_embedding"]
            en = model(fn)["sentence_embedding"]

            
            sp = torch.nn.functional.cosine_similarity(ea, ep).item()
            sn = torch.nn.functional.cosine_similarity(ea, en).item()
            if sp > sn:
                correct += 1

    model.train()
    return correct / max(1, total)


def _batched_triplet_loss(model: SentenceTransformer, anchors: list[str], positives: list[str], negatives: list[str], device: torch.device, margin: float) -> torch.Tensor:
    """Compute triplet loss for a batch using cosine similarity.

    loss = mean(relu(cos(a,n) - cos(a,p) + margin))
    """
    fa = model.tokenize(anchors)
    fp = model.tokenize(positives)
    fn = model.tokenize(negatives)

    fa = {k: v.to(device) for k, v in fa.items()}
    fp = {k: v.to(device) for k, v in fp.items()}
    fn = {k: v.to(device) for k, v in fn.items()}

    ea = model(fa)["sentence_embedding"]
    ep = model(fp)["sentence_embedding"]
    en = model(fn)["sentence_embedding"]

    cos_ap = torch.nn.functional.cosine_similarity(ea, ep)
    cos_an = torch.nn.functional.cosine_similarity(ea, en)
    return torch.relu(cos_an - cos_ap + margin).mean()

def main():
    assert TRIPLETS_PATH.exists(), f"Missing: {TRIPLETS_PATH}"
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if FORCE_CPU:
        _force_cpu_env()

    device = _device()

    
    try:
        torch.set_default_device(str(device))
    except Exception:
        pass

    if device.type == "cpu":
        try:
            torch.set_num_threads(max(1, os.cpu_count() or 1))
        except Exception:
            pass

    print("Loading triplets...")
    df = pd.read_parquet(TRIPLETS_PATH).dropna()

    
    df = df.sample(min(len(df), MAX_TRAIN_TRIPLETS), random_state=42).reset_index(drop=True)

    
    eval_df = df.sample(min(len(df), EVAL_SAMPLES), random_state=123)
    train_df = df.drop(eval_df.index).reset_index(drop=True)
    eval_df = eval_df.reset_index(drop=True)

    print("Loading model:", BASE_MODEL)
    model = SentenceTransformer(BASE_MODEL, device=str(device))

    
    model.to(device)

    
    try:
        model.max_seq_length = MAX_SEQ_LENGTH
    except Exception:
        pass

    
    try:
        model[0].auto_model.config.use_cache = False
    except Exception:
        pass


    
    optimizer = torch.optim.AdamW(model.parameters(), lr=LR)

    
    train_loader = DataLoader(
        list(train_df.itertuples(index=False)),
        shuffle=True,
        batch_size=BATCH_SIZE,
        num_workers=0,
        pin_memory=False,
        drop_last=False,
        collate_fn=lambda batch: batch,  
    )

    total_steps = EPOCHS * len(train_loader)
    print(f"Training on device: {device}. Steps: {total_steps:,}")

    
    base_acc = _eval_triplet_accuracy(model, eval_df, device)
    print(f"Eval (before): {base_acc:.3f}")

    global_step = 0
    for epoch in range(1, EPOCHS + 1):
        epoch_loss = 0.0
        t0 = time.time()

        for batch in train_loader:
            
            optimizer.zero_grad(set_to_none=True)
            anchors = [r.anchor for r in batch]
            positives = [r.positive for r in batch]
            negatives = [r.negative for r in batch]

            loss = _batched_triplet_loss(model, anchors, positives, negatives, device, MARGIN)

            loss.backward()
            optimizer.step()

            global_step += 1
            epoch_loss += float(loss.detach().cpu().item())

            if global_step % LOG_EVERY == 0:
                elapsed = time.time() - t0
                steps_done = global_step
                steps_left = max(0, total_steps - steps_done)
                sps = steps_done / max(1e-9, elapsed)
                eta_min = (steps_left / max(1e-9, sps)) / 60.0
                avg_loss = epoch_loss / (global_step if global_step else 1)
                print(f"epoch {epoch}/{EPOCHS} step {global_step}/{total_steps} loss {avg_loss:.4f} it/s {sps:.2f} ETA {eta_min:.1f} min")

        avg_epoch_loss = epoch_loss / max(1, len(train_loader))
        print(f"Epoch {epoch} avg loss: {avg_epoch_loss:.4f}")

        acc = _eval_triplet_accuracy(model, eval_df, device)
        print(f"Eval (after epoch {epoch}): {acc:.3f}")

    # Save
    model.save(str(OUT_DIR))
    print(f"Saved triplet-tuned model to: {OUT_DIR}")


if __name__ == "__main__":
    main()
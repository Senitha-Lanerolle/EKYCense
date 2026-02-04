from __future__ import annotations
from pathlib import Path
import numpy as np
import pandas as pd
import pyarrow.dataset as ds
import pyarrow.parquet as pq
import pyarrow as pa

BASE = Path(__file__).resolve().parents[2]

INP = BASE / "data/interim/sanctions_names_synth.parquet"
POS = BASE / "data/processed/pos_train.parquet"
TRAIN = BASE / "data/processed/train_people.csv"
OUT = BASE / "data/processed/neg_train.parquet"

SEED = 42
HARD_FRAC = 0.35          
BATCH_WRITE = 200_000     
MAX_LEN_DIFF = 3          

def first_country(countries: str) -> str:
    if countries is None or (isinstance(countries, float) and np.isnan(countries)):
        return "xx"
    s = str(countries).strip()
    if not s:
        return "xx"
    
    return s.split(";")[0].lower()

import re

def is_name_like(s: str) -> bool:
    if s is None:
        return False
    t = str(s).strip()
    if len(t) < 2 or len(t) > 120:
        return False
    
    if re.fullmatch(r"\d+", t):
        return False
    
    return any(ch.isalpha() for ch in t)

def count_rows_parquet(path: Path) -> int:
    pf = pq.ParquetFile(str(path))
    return pf.metadata.num_rows

def main():
    print("BUILD NEGATIVE PAIRS (TRAIN, RAM-SAFE)")
    print("INP:", INP)
    print("POS:", POS)
    print("TRAIN:", TRAIN)
    print("OUT:", OUT)

    if not INP.exists():
        raise FileNotFoundError(INP)
    if not POS.exists():
        raise FileNotFoundError(POS)
    if not TRAIN.exists():
        raise FileNotFoundError(TRAIN)

    rng = np.random.default_rng(SEED)

   
    n_pos = count_rows_parquet(POS)
    n_target = n_pos
    n_hard = int(n_target * HARD_FRAC)
    n_rand = n_target - n_hard

    print("Pos pairs:", n_pos)
    print("Target negatives:", n_target)
    print("Hard negatives:", n_hard)
    print("Random negatives:", n_rand)

    
    train_people = set(pd.read_csv(TRAIN)["person_id"].astype(str))
    print("Train people:", len(train_people))

    
    dset = ds.dataset(str(INP), format="parquet")
    scanner = dset.scanner(
        columns=["person_id", "name", "name_norm", "variant_type", "countries"],
        filter=(ds.field("variant_type") == "primary")
    )

    
    people = []
    seen = set()

    print("Collecting primary names for train people...")
    for batch in scanner.to_batches():
        b = batch.to_pandas()
        b["person_id"] = b["person_id"].astype(str)
        b = b[b["person_id"].isin(train_people)]
        if b.empty:
            continue

        for r in b.itertuples(index=False):
            pid = r.person_id
            if pid in seen:
                continue
            seen.add(pid)
            people.append((pid, r.name, r.name_norm, first_country(r.countries)))

    if len(people) < 10000:
        raise RuntimeError(f"Too few people collected ({len(people)}). Something is wrong.")

    people_df = pd.DataFrame(people, columns=["person_id", "name", "name_norm", "country"])
    print("Collected people:", len(people_df))

    before = len(people_df)
    people_df = people_df[people_df["name"].apply(is_name_like) & people_df["name_norm"].apply(is_name_like)].reset_index(drop=True)
    print(f"Filtered non-name-like rows: {before} -> {len(people_df)}")

    
    country_map = {}
    for idx, c in enumerate(people_df["country"].tolist()):
        country_map.setdefault(c, []).append(idx)

    idx_all = np.arange(len(people_df), dtype=np.int64)

    
    OUT.parent.mkdir(parents=True, exist_ok=True)
    writer = None
    written = 0

    def write_chunk(rows):
        nonlocal writer, written
        if not rows:
            return
        tbl = pa.Table.from_pandas(pd.DataFrame(rows), preserve_index=False)
        if writer is None:
            writer = pq.ParquetWriter(str(OUT), tbl.schema, compression="zstd")
        writer.write_table(tbl)
        written += tbl.num_rows
        rows.clear()
        print(f"✅ wrote {written:,}/{n_target:,} negatives")

    
    rows = []
    print("Generati HARD negatives...")
    for _ in range(n_hard):
        i = int(rng.choice(idx_all))
        ci = people_df.at[i, "country"]
        cand = country_map.get(ci, None)
        if cand is None or len(cand) < 2:
            
            j = int(rng.choice(idx_all))
        else:
            j = int(rng.choice(cand))

        
        tries = 0
        while j == i and tries < 5:
            j = int(rng.choice(cand)) if cand and len(cand) > 1 else int(rng.choice(idx_all))
            tries += 1

        a = people_df.iloc[i]
        b = people_df.iloc[j]

       
        if abs(len(str(a.name_norm)) - len(str(b.name_norm))) > MAX_LEN_DIFF:
            
            j = int(rng.choice(idx_all))
            b = people_df.iloc[j]

        rows.append({
            "name_a": a.name,
            "name_b": b.name,
            "label": 0,
            "person_id_a": a.person_id,
            "person_id_b": b.person_id,
            "neg_type": "hard"
        })
        if len(rows) >= BATCH_WRITE:
            write_chunk(rows)

    
    print("Generating RANDOM negatives...")
    for _ in range(n_rand):
        i, j = rng.choice(idx_all, size=2, replace=False)
        a = people_df.iloc[int(i)]
        b = people_df.iloc[int(j)]
        rows.append({
            "name_a": a.name,
            "name_b": b.name,
            "label": 0,
            "person_id_a": a.person_id,
            "person_id_b": b.person_id,
            "neg_type": "random"
        })
        if len(rows) >= BATCH_WRITE:
            write_chunk(rows)

    
    write_chunk(rows)

    if writer is not None:
        writer.close()

    print("✅ Saved:", OUT)
    print("Total negatives written:", written)

if __name__ == "__main__":
    main()

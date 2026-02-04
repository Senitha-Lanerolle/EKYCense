import pandas as pd
import numpy as np
from rapidfuzz import fuzz
from pathlib import Path
from tqdm import tqdm


OUT = Path("data/processed/name_triplets.parquet")
OUT.parent.mkdir(parents=True, exist_ok=True)

DATA_PATH = Path("data/processed/sanctions_names.parquet")
if not DATA_PATH.exists():
    raise FileNotFoundError(f"Missing: {DATA_PATH.resolve()}")

MAX_TRIPLETS = 30_000

NEG_THRESHOLDS = [75, 70, 65, 60]
NEG_SAMPLES_PER_THRESHOLD = 6 

MAX_POS_PER_ANCHOR = 2         
MAX_ANCHORS_PER_PERSON = 3     

SAVE_EVERY = 5_000
RANDOM_SEED = 42


df = pd.read_parquet(DATA_PATH, columns=["person_id", "name", "countries"])
df["name"] = df["name"].astype(str)
df["countries"] = df["countries"].fillna("")


def primary_country(c: str) -> str:
    c = str(c).strip()
    if not c:
        return ""
    return c.split(";")[0].strip().lower()

df["country_primary"] = df["countries"].map(primary_country)


alias_counts = df.groupby("person_id")["name"].nunique()
valid_pids = alias_counts[alias_counts >= 2].index.values


pid_arr = df["person_id"].to_numpy()
name_arr = df["name"].to_numpy()


country_to_idx: dict[str, np.ndarray] = {}
for c, idxs in df.groupby("country_primary").groups.items():
   
    country_to_idx[c] = np.asarray(idxs, dtype=np.int64)

rng = np.random.default_rng(RANDOM_SEED)
valid_pids = rng.permutation(valid_pids)


triplets: list[dict] = []
seen: set[tuple[str, str, str]] = set()

if OUT.exists():
    try:
        existing = pd.read_parquet(OUT)
        if set(["anchor", "positive", "negative"]).issubset(existing.columns):
            triplets = existing[["anchor", "positive", "negative"]].to_dict("records")
            seen = set((t["anchor"], t["positive"], t["negative"]) for t in triplets)
            print(f"↩️ Resuming from {len(triplets):,} existing triplets in {OUT}")
    except Exception as e:
        print(f"⚠️ Could not resume from {OUT}: {e}")


grouped = df.groupby("person_id")

start_n = len(triplets)
pbar = tqdm(total=MAX_TRIPLETS, initial=start_n, desc="Triplets", dynamic_ncols=True)

for pid in valid_pids:
    if len(triplets) >= MAX_TRIPLETS:
        break

    
    group = grouped.get_group(pid)
    names = group["name"].unique().tolist()
    if len(names) < 2:
        continue

    
    c = group["country_primary"].iloc[0]
    neg_idxs = country_to_idx.get(c)
    if neg_idxs is None or len(neg_idxs) < 50:
        neg_idxs = np.arange(len(df), dtype=np.int64)

    
    rng.shuffle(names)
    anchors = names[:MAX_ANCHORS_PER_PERSON]

    for anchor in anchors:
        if len(triplets) >= MAX_TRIPLETS:
            break

        positives = [n for n in names if n != anchor]
        rng.shuffle(positives)
        positives = positives[:MAX_POS_PER_ANCHOR]

        for positive in positives:
            if len(triplets) >= MAX_TRIPLETS:
                break

            got_neg = False

            
            for thr in NEG_THRESHOLDS:
                for _ in range(NEG_SAMPLES_PER_THRESHOLD):
                    neg_i = int(rng.choice(neg_idxs))

                   
                    if pid_arr[neg_i] == pid:
                        continue
                    neg = str(name_arr[neg_i])

                    
                    if fuzz.WRatio(anchor, neg) >= thr:
                        key = (anchor, positive, neg)
                        if key not in seen:
                            seen.add(key)
                            triplets.append({"anchor": anchor, "positive": positive, "negative": neg})
                            pbar.update(1)

                            if len(triplets) % SAVE_EVERY == 0:
                                pd.DataFrame(triplets).to_parquet(OUT, index=False)
                                print(f"Saved {len(triplets):,} triplets")

                        got_neg = True
                        break

                if got_neg or len(triplets) >= MAX_TRIPLETS:
                    break

pbar.close()


pd.DataFrame(triplets).to_parquet(OUT, index=False)
print(f"Saved {len(triplets):,} triplets → {OUT}")
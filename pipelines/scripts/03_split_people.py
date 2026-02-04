from pathlib import Path
import numpy as np
import pandas as pd

BASE = Path(__file__).resolve().parents[2]
INP = BASE / "data/interim/sanctions_names_synth.parquet"
OUTDIR = BASE / "data/processed"
SEED = 42

TRAIN_FRAC = 0.80
VAL_FRAC = 0.10
TEST_FRAC = 0.10

def main():
    print("SPLIT PEOPLE (train/val/test)")
    print("INPUT:", INP)
    print("OUTDIR:", OUTDIR)

    OUTDIR.mkdir(parents=True, exist_ok=True)
    df = pd.read_parquet(INP, columns=["person_id"])
    people = df["person_id"].drop_duplicates().astype(str).to_numpy()

    rng = np.random.default_rng(SEED)
    rng.shuffle(people)

    n = len(people)
    n_train = int(n * TRAIN_FRAC)
    n_val = int(n * VAL_FRAC)
    n_test = n - n_train - n_val

    train = people[:n_train]
    val = people[n_train:n_train+n_val]
    test = people[n_train+n_val:]

    pd.DataFrame({"person_id": train}).to_csv(OUTDIR / "train_people.csv", index=False)
    pd.DataFrame({"peon_id": val}).to_csv(OUTDIR / "val_people.csv", index=False)
    pd.DataFrame({"person_id": test}).to_csv(OUTDIR / "test_people.csv", index=False)

    print("Saved")
    print("Total:", n)
    print("Train:", len(train))
    print("Val:", len(val))
    print("Test:", len(test))

if __name__ == "__main__":
    main()

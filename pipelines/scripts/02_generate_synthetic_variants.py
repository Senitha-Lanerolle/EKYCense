from __future__ import annotations
from pathlib import Path
import random
import re
import unicodedata

import pandas as pd
from tqdm import tqdm
from unidecode import unidecode

BASE = Path(__file__).resolve().parents[2]
INP = BASE / "data/processed/sanctions_names.parquet"
OUT = BASE / "data/interim/sanctions_names_synth.parquet"

SEED = 42
random.seed(SEED)

_ws_re = re.compile(r"\s+")
_multi_dash = re.compile(r"[-_]{2,}")

def normalize_name(s: str) -> str:
    s = str(s)
    s = unicodedata.normalize("NFKC", s).strip().casefold()
    s = _ws_re.sub(" ", s)
    return s

def remove_diacritics(s: str) -> str:
    
    return unidecode(s)

def swap_order_if_comma(s: str) -> str:
    
    if "," in s:
        parts = [p.strip() for p in s.split(",") if p.strip()]
        if len(parts) == 2:
            return f"{parts[1]} {parts[0]}"
    return s

def random_drop_char(s: str) -> str:
    if len(s) < 4:
        return s
    i = random.randrange(0, len(s))
    return s[:i] + s[i+1:]

def random_swap_adjacent(s: str) -> str:
    if len(s) < 4:
        return s
    i = random.randrange(0, len(s)-1)
    return s[:i] + s[i+1] + s[i] + s[i+2:]

def random_replace_char(s: str) -> str:
    
    repl = {
        "o": "0", "0": "o",
        "i": "1", "1": "i",
        "l": "1",
        "s": "5", "5": "s",
        "a": "á", "e": "é"
    }
    chars = list(s)
    idxs = [i for i,c in enumerate(chars) if c.lower() in repl]
    if not idxs:
        return s
    i = random.choice(idxs)
    c = chars[i]
    chars[i] = repl.get(c.lower(), c)
    return "".join(chars)

def punctuation_variants(s: str) -> list[str]:
    
    v = set()
    v.add(s.replace("-", " "))
    v.add(s.replace(" ", "-"))
    v.add(s.replace("_", " "))
    v.add(_multi_dash.sub("-", s))
    v.add(_ws_re.sub(" ", s))
    return list(v)
def case_variants(s: str) -> list[str]:
    return [s.lower(), s.upper(), s.title()]

def make_synthetic(name: str) -> set[str]:
    base = str(name).strip()
    if not base:
        return set()

    out = set()

    
    out.add(remove_diacritics(base))
    out.add(swap_order_if_comma(base))

    for v in punctuation_variants(base):
        out.add(v)

    
    out.add(random_drop_char(base))
    out.add(random_swap_adjacent(base))
    out.add(random_replace_char(base))

    
    for v in case_variants(base):
        out.add(v)

    
    cleaned = set()
    for x in out:
        x = unicodedata.normalize("NFKC", str(x)).strip()
        x = _ws_re.sub(" ", x)
        if 2 <= len(x) <= 120:
            cleaned.add(x)
    return cleaned

def main():
    print("GENERATE SYNTHETIC VARIANTS")
    print("INPUT:", INP)
    print("OUTPUT:", OUT)

    if not INP.exists():
        raise FileNotFoundError(INP)
    OUT.parent.mkdir(parents=True, exist_ok=True)

    df = pd.read_parquet(INP, columns=["person_id","name","name_norm","variant_type","countries","birth_date","dataset","first_seen","last_seen","last_change"])
    print("Loaded rows:", len(df))

    
    MAX_ORIG_PER_PERSON = 12
    df = df.sort_values(["person_id","variant_type"]) 
    df = df.groupby("person_id").head(MAX_ORIG_PER_PERSON).reset_index(drop=True)
    print("After per-person cap:", len(df))

    rows = []
    MAX_SYNTH_PER_NAME = 6  

    for r in tqdm(df.itertuples(index=False), total=len(df), desc="Synth"):
        synths = list(make_synthetic(r.name))
        
        synths = [s for s in synths if normalize_name(s) != r.name_norm]
       
        synths = list(dict.fromkeys(synths))[:MAX_SYNTH_PER_NAME]

        for s in synths:
            rows.append({
                "person_id": r.person_id,
                "name": s,
                "name_norm": normalize_name(s),
                "variant_type": "synthetic",
                "countries": r.countries,
                "birth_date": r.birth_date,
                "dataset": r.dataset,
                "first_seen": r.first_seen,
                "last_seen": r.last_seen,
                "last_change": r.last_change,
            })

    df_syn = pd.DataFrame(rows)
    if len(df_syn) == 0:
        print("No synthetic variants generated (unexpected).")
        return

   
    out_df = pd.concat([df, df_syn], ignore_index=True)
    out_df = out_df.drop_duplicates(subset=["person_id","name_norm","variant_type"])
    out_df.to_parquet(OUT, index=False)

    per = out_df.groupby("person_id")["name_norm"].nunique()

    print(f"Saved: {OUT}")
    print("Total rows:", len(out_df))
    print("Unique persons:", out_df["person_id"].nunique())
    print("Avg names/person:", float(per.mean()))
    print("People with >=2 names:", int((per>=2).sum()))
    print("Variant types:\n", out_df["variant_type"].value_counts().head(10))

    print(out_df.sample(5, random_state=SEED).to_string(index=False))

if __name__ == "__main__":
    main()
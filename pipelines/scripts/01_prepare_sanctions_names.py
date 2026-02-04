from __future__ import annotations
from pathlib import Path
import json
import re
import unicodedata
import ast

import pandas as pd
from tqdm import tqdm

BASE = Path(__file__).resolve().parents[2]
INP = BASE / "data/raw/sanctions_list.csv"
OUT = BASE / "data/processed/sanctions_names.parquet"


KEEP_COLS = [
    "id", "schema", "name", "aliases", "birth_date", "countries",
    "dataset", "first_seen", "last_seen", "last_change"
]


_ws_re = re.compile(r"\s+")
_punct_re = re.compile(r"[^\w\s\-']+", flags=re.UNICODE)

def normalize_name(s: str) -> str:
    if s is None:
        return ""
    s = str(s)
    s = unicodedata.normalize("NFKC", s)
    s = s.strip().casefold()
    s = _ws_re.sub(" ", s)
    return s

def clean_display_name(s: str) -> str:
    """Human-readable cleaned version (keeps accents; removes weird punctuation)."""
    if s is None:
        return ""
    s = str(s)
    s = unicodedata.normalize("NFKC", s).strip()
    s = _ws_re.sub(" ", s)
    return s

def parse_aliases_cell(x):
    """
    sanctions_list.csv sometimes stores aliases as:
    - NaN
    - a string with ';' separators
    - a JSON-ish list string like '["a","b"]'
    - already a list (rare)
    We normalize into a python list[str].
    """
    if x is None:
        return []
    
    try:
        if pd.isna(x):
            return []
    except Exception:
        pass

    if isinstance(x, list):
        return [str(a) for a in x if str(a).strip()]

    s = str(x).strip()
    if not s or s.lower() == "nan":
        return []

    
    if (s.startswith("[") and s.endswith("]")) or (s.startswith("(") and s.endswith(")")):
        try:
            v = ast.literal_eval(s)
            if isinstance(v, (list, tuple)):
                return [str(a) for a in v if str(a).strip()]
        except Exception:
            pass

    
    parts = [p.strip().strip('"').strip("'") for p in s.split(";")]
    parts = [p for p in parts if p]
    return parts

def main():
    print("PREPARE SANCTIONS NAMES")
    print("BASE:", BASE)
    print("INPUT:", INP)
    print("OUTPUT:", OUT)

    if not INP.exists():
        raise FileNotFoundError(f"Missing input file: {INP}")

    OUT.parent.mkdir(parents=True, exist_ok=True)

    
    chunksize = 200_000
    rows_out = []
    total_in = 0
    total_people = 0
    total_names = 0

    for chunk in tqdm(pd.read_csv(INP, usecols=lambda c: c in KEEP_COLS, low_memory=False, chunksize=chunksize),
                      desc="Reading CSV chunks"):
        total_in += len(chunk)

        
        chunk = chunk[chunk["schema"].astype(str).str.lower() == "person"]
        if chunk.empty:
            continue

        total_people += len(chunk)

        chunk["aliases_list"] = chunk["aliases"].apply(parse_aliases_cell)

        
        recs = []
        for _, r in chunk.iterrows():
            person_id = str(r["id"])
            primary = clean_display_name(r.get("name", ""))
            if primary:
                recs.append({
                    "person_id": person_id,
                    "name": primary,
                    "name_norm": normalize_name(primary),
                    "variant_type": "primary",
                    "countries": r.get("countries", None),
                    "birth_date": r.get("birth_date", None),
                    "dataset": r.get("dataset", None),
                    "first_seen": r.get("first_seen", None),
                    "last_seen": r.get("last_seen", None),
                    "last_change": r.get("last_change", None),
                })

            for a in r["aliases_list"]:
                a_disp = clean_display_name(a)
                if not a_disp:
                    continue
                recs.append({
                    "person_id": person_id,
                    "name": a_disp,
                    "name_norm": normalize_name(a_disp),
                    "variant_type": "alias",
                    "countries": r.get("countries", None),
                    "birth_date": r.get("birth_date", None),
                    "dataset": r.get("dataset", None),
                    "first_seen": r.get("first_seen", None),
                    "last_seen": r.get("last_seen", None),
                    "last_change": r.get("last_change", None),
                })

        if not recs:
            continue

        df_names = pd.DataFrame.from_records(recs)

        
        df_names = df_names[df_names["name_norm"].str.len().between(2, 120)]
        df_names = df_names.drop_duplicates(subset=["person_id", "name_norm", "variant_type"])

        total_names += len(df_names)
        rows_out.append(df_names)

    if not rows_out:
        print("No output rows generated. Check input schema & columns.")
        return

    out_df = pd.concat(rows_out, ignore_index=True)

   
    out_df = out_df[out_df["name_norm"].str.len().between(2, 120)]
    out_df = out_df.drop_duplicates(subset=["person_id", "name_norm", "variant_type"])

   
    out_df.to_parquet(OUT, index=False)

    
    per_person = out_df.groupby("person_id")["name_norm"].nunique()
    print(f"Saved: {OUT}")
    print("Input rows read:", total_in)
    print("Persons kept:", int(out_df["person_id"].nunique()))
    print("Total name rows:", len(out_df))
    print("Avg variants/person:", float(per_person.mean()))
    print("Max variants/person:", int(per_person.max()))
    print("People with >=2 names:", int((per_person >= 2).sum()))
    print(out_df.head(5).to_string(index=False))

if __name__ == "__main__":
    main()

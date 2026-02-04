from pathlib import Path
import pandas as pd
import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl
import json

BASE = Path(__file__).resolve().parents[2]
DATA = BASE / "data/processed/train_hybrid_features.parquet"
OUT = BASE / "reports/fuzzy_decisions_sample.json"

def build_fuzzy_system():
    lexical = ctrl.Antecedent(np.arange(0, 1.01, 0.01), "lexical")
    semantic = ctrl.Antecedent(np.arange(0, 1.01, 0.01), "semantic")
    decision = ctrl.Consequent(np.arange(0, 1.01, 0.01), "decision")

    lexical["poor"] = fuzz.trimf(lexical.universe, [0, 0, 0.4])
    lexical["ok"] = fuzz.trimf(lexical.universe, [0.3, 0.5, 0.7])
    lexical["strong"] = fuzz.trimf(lexical.universe, [0.6, 1.0, 1.0])

    semantic["weak"] = fuzz.trimf(semantic.universe, [0, 0, 0.4])
    semantic["related"] = fuzz.trimf(semantic.universe, [0.3, 0.6, 0.8])
    semantic["very_close"] = fuzz.trimf(semantic.universe, [0.7, 1.0, 1.0])

    decision["no_match"] = fuzz.trimf(decision.universe, [0, 0, 0.4])
    decision["partial"] = fuzz.trimf(decision.universe, [0.3, 0.5, 0.7])
    decision["match"] = fuzz.trimf(decision.universe, [0.6, 1.0, 1.0])

    rules = [
        
        ctrl.Rule(lexical["strong"] & semantic["very_close"], decision["match"]),
        ctrl.Rule(lexical["ok"] & semantic["very_close"], decision["match"]),

        
        ctrl.Rule(lexical["poor"] & semantic["very_close"], decision["partial"]),
        ctrl.Rule(lexical["strong"] & semantic["related"], decision["partial"]),
        ctrl.Rule(lexical["ok"] & semantic["related"], decision["partial"]),

       
        ctrl.Rule(semantic["weak"], decision["no_match"]),
        ctrl.Rule(lexical["poor"] & semantic["related"], decision["no_match"]),
        ctrl.Rule(lexical["poor"] & semantic["weak"], decision["no_match"]),
    ]

    system = ctrl.ControlSystem(rules)
    return ctrl.ControlSystemSimulation(system)

def label_from_score(score):
    if score >= 0.7:
        return "MATCH"
    if score >= 0.4:
        return "PARTIAL_MATCH"
    return "NO_MATCH"

def main():
    print("FUZZY DECISION ENGINE")
    df = pd.read_parquet(DATA)

    samples = df.sample(50, random_state=42)

    outputs = []

    for _, row in samples.iterrows():
        
        sim = build_fuzzy_system()

        lex = row.get("lev_sim")
        sem = row.get("embed_cosine")

        
        if pd.isna(lex) or pd.isna(sem):
            continue

        
        lex = float(np.clip(lex, 0.0, 1.0))
        sem = float(np.clip(sem, 0.0, 1.0))

        sim.input["lexical"] = lex
        sim.input["semantic"] = sem
        sim.compute()

        
        score = float(sim.output.get("decision", 0.0))
        outputs.append({
            "name_a": row["name_a"],
            "name_b": row["name_b"],
            "lexical_similarity": lex,
            "semantic_similarity": sem,
            "fuzzy_score": score,
            "decision": label_from_score(score)
        })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(outputs, f, indent=2)

    print("Saved fuzzy decisions:", OUT)

if __name__ == "__main__":
    main()
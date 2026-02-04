import json
import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

DATA = "data/processed/train_hybrid_features.parquet"

LEX_MODEL = "models/lexical_baseline.joblib"
EMB_MODEL = "models/embedding_model.joblib"
HYB_MODEL = "models/hybrid_model.joblib"

OUT = "reports/model_comparison.json"

FEATURES_LEX = [
    "len_a","len_b","len_diff","tok_jaccard","fuzz_ratio","fuzz_wratio",
    "tok_sort","tok_set","ascii_ratio","jaro_winkler","lev_sim"
]

FEATURES_EMB = ["embed_cosine"]
FEATURES_HYB = FEATURES_LEX + FEATURES_EMB


def evaluate(model, X, y):
    p = model.predict(X)
    s = model.predict_proba(X)[:,1]
    return {
        "accuracy": accuracy_score(y, p),
        "precision": precision_score(y, p),
        "recall": recall_score(y, p),
        "f1": f1_score(y, p),
        "roc_auc": roc_auc_score(y, s),
    }


def main():
    df = pd.read_parquet(DATA).sample(200_000, random_state=42)
    y = df["label"]

    results = {}

    results["lexical"] = evaluate(
        joblib.load(LEX_MODEL),
        df[FEATURES_LEX],
        y
    )

    results["embedding"] = evaluate(
        joblib.load(EMB_MODEL),
        df[FEATURES_EMB],
        y
    )

    results["hybrid"] = evaluate(
        joblib.load(HYB_MODEL),
        df[FEATURES_HYB],
        y
    )

    with open(OUT, "w") as f:
        json.dump(results, f, indent=2)

    print("Evaluation complete")
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
from pathlib import Path
import json
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, classification_report,
    confusion_matrix, roc_curve
)

import matplotlib.pyplot as plt
import seaborn as sns

BASE = Path(__file__).resolve().parents[2]

DATA = BASE / "data/processed/train_hybrid_features.parquet"
MODEL_OUT = BASE / "models/hybrid_model.joblib"
METRICS_OUT = BASE / "reports/hybrid_metrics.json"
CM_OUT = BASE / "reports/hybrid_confusion_matrix.png"
ROC_OUT = BASE / "reports/hybrid_roc.png"

SEED = 42

def main():
    print("TRAIN HYBRID MODEL")

    df = pd.read_parquet(DATA)

    y = df["label"]
    X = df.drop(columns=["name_a", "name_b", "label"])

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=SEED
    )

    model = LogisticRegression(
        max_iter=2000,
        n_jobs=-1,
        random_state=SEED
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_val)
    y_prob = model.predict_proba(X_val)[:, 1]

    metrics = {
        "accuracy": accuracy_score(y_val, y_pred),
        "precision": precision_score(y_val, y_pred),
        "recall": recall_score(y_val, y_pred),
        "f1": f1_score(y_val, y_pred),
        "roc_auc": roc_auc_score(y_val, y_prob),
        "features": list(X.columns)
    }

    print("Metrics:", json.dumps(metrics, indent=2))
    print("\n", classification_report(y_val, y_pred))

    MODEL_OUT.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_OUT)

    METRICS_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(METRICS_OUT, "w") as f:
        json.dump(metrics, f, indent=2)

    cm = confusion_matrix(y_val, y_pred)
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
    plt.title("Hybrid Model Confusion Matrix")
    plt.savefig(CM_OUT)
    plt.close()

    fpr, tpr, _ = roc_curve(y_val, y_prob)
    plt.plot(fpr, tpr, label=f"AUC={metrics['roc_auc']:.3f}")
    plt.plot([0,1],[0,1],"k--")
    plt.legend()
    plt.title("Hybrid Model ROC")
    plt.savefig(ROC_OUT)
    plt.close()

    print("Saved hybrid model & reports")

if __name__ == "__main__":
    main()
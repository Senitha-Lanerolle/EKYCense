from pathlib import Path
import json
import joblib
import numpy as np
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

DATA = BASE / "data/processed/train_embedding_features.parquet"
MODEL_OUT = BASE / "models/embedding_model.joblib"
METRICS_OUT = BASE / "reports/embedding_metrics.json"
CM_OUT = BASE / "reports/embedding_confusion_matrix.png"
ROC_OUT = BASE / "reports/embedding_roc.png"

SEED = 42

def main():
    print("TRAIN EMBEDDING MODEL (Semantic)")
    print("INPUT:", DATA)

    df = pd.read_parquet(DATA)
    print("rows:", len(df))
    print("label counts:\n", df["label"].value_counts())

    X = df[["embed_cosine"]]
    y = df["label"]

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=SEED, stratify=y
    )

    print("train:", X_train.shape, "val:", X_val.shape)

    model = LogisticRegression(
        solver="lbfgs",
        max_iter=1000,
        random_state=SEED
    )

    print("Training...")
    model.fit(X_train, y_train)

    print("Evaluating...")
    y_pred = model.predict(X_val)
    y_prob = model.predict_proba(X_val)[:, 1]

    metrics = {
        "accuracy": accuracy_score(y_val, y_pred),
        "precision": precision_score(y_val, y_pred),
        "recall": recall_score(y_val, y_pred),
        "f1": f1_score(y_val, y_pred),
        "roc_auc": roc_auc_score(y_val, y_prob),
        "n_train": len(X_train),
        "n_val": len(X_val),
        "feature": "embed_cosine"
    }

    print("Metrics:", json.dumps(metrics, indent=2))
    print("\nClassification report:\n")
    print(classification_report(y_val, y_pred))

    # Save model
    MODEL_OUT.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_OUT)

    # Save metrics
    METRICS_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(METRICS_OUT, "w") as f:
        json.dump(metrics, f, indent=2)

    # Confusion matrix
    cm = confusion_matrix(y_val, y_pred)
    plt.figure(figsize=(5, 4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.title("Embedding Model Confusion Matrix")
    plt.tight_layout()
    plt.savefig(CM_OUT)
    plt.close()

    # ROC curve
    fpr, tpr, _ = roc_curve(y_val, y_prob)
    plt.figure(figsize=(5, 4))
    plt.plot(fpr, tpr, label=f"AUC = {metrics['roc_auc']:.3f}")
    plt.plot([0, 1], [0, 1], "k--")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("Embedding Model ROC Curve")
    plt.legend()
    plt.tight_layout()
    plt.savefig(ROC_OUT)
    plt.close()

    print("Saved model:", MODEL_OUT)
    print("Saved metrics:", METRICS_OUT)
    print("Saved CM:", CM_OUT)
    print("Saved ROC:", ROC_OUT)

if __name__ == "__main__":
    main()
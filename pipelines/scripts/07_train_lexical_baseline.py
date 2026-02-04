from __future__ import annotations

from pathlib import Path
import json

import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve,
    precision_recall_fscore_support,
    accuracy_score,
)

import matplotlib.pyplot as plt
import joblib


BASE = Path(__file__).resolve().parents[2]
INP = BASE / "data/processed/train_lexical_features.parquet"
MODEL_OUT = BASE / "models/lexical_baseline.joblib"
METRICS_OUT = BASE / "reports/lexical_baseline_metrics.json"
CM_OUT = BASE / "reports/lexical_baseline_confusion_matrix.png"
ROC_OUT = BASE / "reports/lexical_baseline_roc.png"

SEED = 42


def main():
    print("TRAIN LEXICAL BASELINE (LogReg)")
    print("INPUT:", INP)
    if not INP.exists():
        raise FileNotFoundError(INP)

    df = pd.read_parquet(INP)
    print("rows:", len(df))
    print("label counts:\n", df["label"].value_counts())

    feature_cols = [
        "len_a", "len_b", "len_diff",
        "tok_jaccard",
        "fuzz_ratio", "fuzz_wratio", "tok_sort", "tok_set",
        "ascii_ratio",
        "jaro_winkler",
        "lev_sim",
    ]

    X = df[feature_cols].astype(np.float32)
    y = df["label"].astype(int).to_numpy()

    X_train, X_val, y_train, y_val = train_test_split(
        X, y,
        test_size=0.2,
        random_state=SEED,
        stratify=y
    )
    print("train:", X_train.shape, "val:", X_val.shape)

    
    clf = Pipeline(steps=[
        ("scaler", StandardScaler()),
        ("lr", LogisticRegression(
            max_iter=200,
            n_jobs=-1,
            class_weight="balanced",
            random_state=SEED
        )),
    ])

    print("Training...")
    clf.fit(X_train, y_train)

    print("Predicting...")
    y_pred = clf.predict(X_val)
    y_prob = clf.predict_proba(X_val)[:, 1]

    acc = float(accuracy_score(y_val, y_pred))
    roc = float(roc_auc_score(y_val, y_prob))
    p, r, f1, _ = precision_recall_fscore_support(y_val, y_pred, average="binary")

    metrics = {
        "accuracy": acc,
        "roc_auc": roc,
        "precision": float(p),
        "recall": float(r),
        "f1": float(f1),
        "n_train": int(len(y_train)),
        "n_val": int(len(y_val)),
        "features": feature_cols,
    }

    print("Metrics:", json.dumps(metrics, indent=2))

    print("\nClassification report:\n")
    print(classification_report(y_val, y_pred, digits=4))

    # Confusion matrix plot
    cm = confusion_matrix(y_val, y_pred)
    plt.figure()
    plt.imshow(cm)
    plt.title("Confusion Matrix (Lexical Baseline)")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    for (i, j), v in np.ndenumerate(cm):
        plt.text(j, i, str(v), ha="center", va="center")
    plt.tight_layout()
    CM_OUT.parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(CM_OUT, dpi=200)
    plt.close()

    # ROC plot
    fpr, tpr, _ = roc_curve(y_val, y_prob)
    plt.figure()
    plt.plot(fpr, tpr)
    plt.plot([0, 1], [0, 1])
    plt.title("ROC Curve (Lexical Baseline)")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.tight_layout()
    plt.savefig(ROC_OUT, dpi=200)
    plt.close()

    # Save model + metrics
    MODEL_OUT.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(clf, MODEL_OUT)

    METRICS_OUT.parent.mkdir(parents=True, exist_ok=True)
    METRICS_OUT.write_text(json.dumps(metrics, indent=2))

    print("Saved model:", MODEL_OUT)
    print("Saved metrics:", METRICS_OUT)
    print("Saved CM:", CM_OUT)
    print("Saved ROC:", ROC_OUT)


if __name__ == "__main__":
    main()
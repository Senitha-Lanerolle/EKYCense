import os
from functools import lru_cache
from pathlib import Path
from typing import Optional, Union

import torch
from sentence_transformers import SentenceTransformer
import joblib

from backend.app.core.config import settings


def _project_root() -> Path:
    """Return the repository/project root (the folder that contains `backend/`)."""
    
    return Path(__file__).resolve().parents[3]


def _abs_path(p: Union[str, Path]) -> Path:
    p = Path(p)
    return p if p.is_absolute() else (_project_root() / p)


def _is_sentence_transformer_dir(p: Path) -> bool:
    """Heuristic check for a locally saved SentenceTransformer directory."""
    try:
        p = Path(p)
        return p.exists() and p.is_dir() and (p / "modules.json").exists()
    except Exception:
        return False


def _get_device() -> str:
    """Select best available device; allow forcing CPU via env var FORCE_CPU=1."""
    if os.getenv("FORCE_CPU", "").strip() in {"1", "true", "True", "yes", "YES"}:
        return "cpu"
    
    if torch.cuda.is_available():
        return "cuda"
    
    if getattr(torch.backends, "mps", None) is not None and torch.backends.mps.is_available():
        return "mps"
    return "cpu"


@lru_cache(maxsize=1)
def get_embedder():
    """
    Loads the multilingual SentenceTransformer once.

    Priority:
    1) models/xlmr_name_embedder_triplet (highest priority)
    2) Environment variable EMBEDDER_MODEL_PATH (optional override)
    3) settings.EMBEDDER_MODEL_PATH (optional config)
    4) Local model models/xlmr_name_embedder
    5) Fallback HF model: paraphrase-multilingual-MiniLM-L12-v2
    """
   
    os.environ.setdefault("HF_HOME", _project_root().joinpath(".hf_cache").as_posix())
    os.environ.setdefault("TRANSFORMERS_CACHE", _project_root().joinpath(".hf_cache").as_posix())
    os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

    device = _get_device()

  
    candidate_paths: list[Path] = []
    candidate_paths.append(_abs_path("models/xlmr_name_embedder_triplet"))


    env_path = os.getenv("EMBEDDER_MODEL_PATH")
    if env_path:
        candidate_paths.append(_abs_path(env_path))


    embedder_cfg = getattr(settings, "EMBEDDER_MODEL_PATH", None)
    if embedder_cfg:
        candidate_paths.append(_abs_path(embedder_cfg))


    candidate_paths.append(_abs_path("models/xlmr_name_embedder"))


    if not _is_sentence_transformer_dir(_abs_path("models/xlmr_name_embedder_triplet")):
        print("[model_store][WARN] Triplet-tuned model not found, falling back.")

  
    for p in candidate_paths:
        if _is_sentence_transformer_dir(p):
            print(f"[model_store] Using embedder: {p} (device={device})")
            return SentenceTransformer(p.as_posix(), device=device)


    hf_model = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    print(f"[model_store] Loading embedder from HF: {hf_model} (device={device})")
    return SentenceTransformer(hf_model, device=device)



@lru_cache(maxsize=1)
def get_hybrid_model():
    """Load the hybrid combiner model.

    Expected payload (joblib):
        {
            "model": <sklearn-like model with predict_proba>,
            "feature_cols": ["...", ...],
            "threshold": 0.5,
        }

    Resolution order:
      1) env HYBRID_MODEL_PATH
      2) settings.HYBRID_MODEL_PATH
      3) models/hybrid/hybrid_model.joblib

    Returns:
      - dict with keys: model, feature_cols, threshold
      - None if not available or invalid
    """
    root = _project_root()

    
    env_path = os.getenv("HYBRID_MODEL_PATH")
    cfg_path = getattr(settings, "HYBRID_MODEL_PATH", None)

    candidates: list[Path] = []
    if env_path:
        candidates.append(_abs_path(env_path))
    if cfg_path:
        candidates.append(_abs_path(cfg_path))
    candidates.append(root / "models/hybrid/hybrid_model.joblib")

    for p in candidates:
        if p.exists():
            try:
                print(f"[model_store] Loading hybrid model: {p}")
                payload = joblib.load(p)

               
                if isinstance(payload, dict) and "model" in payload:
                    model = payload.get("model")
                    feature_cols = payload.get("feature_cols") or payload.get("feature_columns")
                    threshold = payload.get("threshold", 0.5)
                    if feature_cols is None:
                        raise ValueError("hybrid payload missing feature_cols")
                    return {
                        "model": model,
                        "feature_cols": list(feature_cols),
                        "threshold": float(threshold),
                    }

                
                if hasattr(payload, "predict_proba"):
                    print("[model_store][WARN] Hybrid joblib contains a raw model; using default feature_cols/threshold")
                    return {"model": payload, "feature_cols": [], "threshold": 0.5}

                raise ValueError("Unrecognized hybrid model payload")
            except Exception as e:
                print(f"[model_store][WARN] Failed to load hybrid model from {p}: {e}")
                return None

    print("[model_store][WARN] Hybrid model not found; running without it.")
    return None

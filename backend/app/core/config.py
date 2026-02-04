from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "EKYCense"
    ENV: str = "dev"

    
    SANCTIONS_NAMES_PARQUET: str = "data/interim/sanctions_names_synth.parquet"

    # Models 
    LEXICAL_MODEL_PATH: str = "models/lexical_baseline.joblib"
    EMBEDDER_MODEL_PATH: str = "models/xlmr_name_embedder"
    HYBRID_MODEL_PATH: str = "models/hybrid_model.joblib"

    # Fuzzy thresholds (tune later)
    MATCH_THRESHOLD: float = 0.80
    PARTIAL_THRESHOLD: float = 0.45

    class Config:
        env_file = ".env"

settings = Settings()

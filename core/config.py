from pydantic_settings import BaseSettings
from typing import Optional, Set
from functools import lru_cache


class BaseConfig(BaseSettings):
    ENV_STATE: Optional[str] = None

    class Config:
        env_file: str = ".env"
        extra: str = "ignore"


class GlobalConfig(BaseConfig):
    # ---------------- DATABASE ----------------
    MONGO_URI: Optional[str] = None
    DB_NAME: Optional[str] = "safety_guardian"

    DB_FORCE_ROLLBACK: bool = False

    # ---------------- APP ----------------
    APP_NAME: str = "Safety Guardian API"
    
    # ---------------- JWT ----------------
    JWT_SECRET_KEY: str = "change-this-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60


    # ---------------- FILE UPLOAD ----------------
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 16
    ALLOWED_EXTENSIONS: Set[str] = {"webm", "mp4", "wav", "mp3"}

    # ---------------- AUDIO ----------------
    RISK_KEYWORDS: list[str] = ["risk", "risky", "high risk"]

    # ---------------- EMAIL ----------------
    EMAIL_SENDER: Optional[str] = None
    EMAIL_PASSWORD: Optional[str] = None
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587

    # ---------------- TWILIO ----------------
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None

    # ---------------- EXTERNAL APIS ----------------
    POLICE_API_KEY: Optional[str] = None


class DevConfig(GlobalConfig):

    class Config:
        env_prefix: str = "DEV_"


class ProdConfig(GlobalConfig):

    class Config:
        env_prefix: str = "PROD_"


@lru_cache()
def get_config(env_state: str):
    configs = {
        "dev": DevConfig,
        "prod": ProdConfig,
    }
    return configs[env_state]()


config = get_config(BaseConfig().ENV_STATE)

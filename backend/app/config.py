import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Bulk Certificate Generator"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # Database: Defaults to SQLite for seamless local execution/testing, overridden by postgres in docker
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "sqlite:///./certificates.db"
    )

    # Storage
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "storage/certificates")

    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretjwtkey_change_in_production_1234567890")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost",
    ]

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()

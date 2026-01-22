"""Configuration settings for the Threat Translator backend."""

from pydantic_settings import BaseSettings
from typing import Literal
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # AI Provider configuration
    ai_provider: Literal["openai", "anthropic", "google"] = "openai"
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    google_api_key: str = ""
    
    # Model settings
    openai_model: str = "gpt-4o"
    anthropic_model: str = "claude-3-sonnet-20240229"
    google_model: str = "gemini-1.5-flash"
    
    # API settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # File upload settings
    max_upload_size: int = 100 * 1024 * 1024  # 100MB
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

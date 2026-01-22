"""Configuration settings for the Threat Translator backend."""

from pydantic_settings import BaseSettings
from typing import Literal, Optional
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
    
    def get_available_providers(self) -> list[dict]:
        """Get list of AI providers that have API keys configured."""
        providers = []
        
        if self.openai_api_key:
            providers.append({
                "id": "openai",
                "name": "OpenAI",
                "model": self.openai_model,
                "is_default": self.ai_provider == "openai"
            })
        
        if self.anthropic_api_key:
            providers.append({
                "id": "anthropic", 
                "name": "Anthropic Claude",
                "model": self.anthropic_model,
                "is_default": self.ai_provider == "anthropic"
            })
        
        if self.google_api_key:
            providers.append({
                "id": "google",
                "name": "Google Gemini",
                "model": self.google_model,
                "is_default": self.ai_provider == "google"
            })
        
        return providers
    
    def get_default_provider(self) -> Optional[str]:
        """Get the default provider (first available if configured default is not available)."""
        providers = self.get_available_providers()
        if not providers:
            return None
        
        # Try to return the configured default
        for p in providers:
            if p["is_default"]:
                return p["id"]
        
        # Fall back to first available
        return providers[0]["id"]


settings = Settings()

"""Application configuration via Pydantic Settings."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    database_url: str = "postgresql+asyncpg://user:pass@localhost/dbname"
    openrouter_api_key: str = ""
    jwt_secret: str = "dev-secret-change-in-production"
    cors_origins: str = "http://localhost:3000"
    environment: str = "development"

    model_config = {"env_file": ".env", "extra": "ignore"}

    @property
    def async_database_url(self) -> str:
        """Return database URL with asyncpg driver prefix."""
        url = self.database_url
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        # Strip sslmode and channel_binding from query params (asyncpg uses ssl= kwarg)
        if "?" in url:
            url = url.split("?")[0]
        return url


settings = Settings()

"""
Database connection and session management.
"""
import logging
from sqlmodel import Session, create_engine
from src.config import settings

logging.basicConfig(level=logging.INFO)

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",
    pool_pre_ping=True,
)


def get_session():
    """Dependency for getting database sessions."""
    with Session(engine) as session:
        yield session

"""
Database connection and session management.
"""
from sqlmodel import Session, create_engine
from src.config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",
    pool_pre_ping=True,  # Verify connections before using
)


def get_session():
    """
    Dependency for getting database sessions.
    Yields a session and ensures proper cleanup.
    """
    with Session(engine) as session:
        yield session

"""Async database engine and session factory for Neon PostgreSQL."""

import ssl

import sqlalchemy
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from src.config import settings

# asyncpg doesn't understand sslmode=require — strip it and pass ssl=True
db_url = settings.database_url
connect_args = {}

if "sslmode=" in db_url:
    db_url = db_url.split("?")[0]  # Remove query params
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE
    connect_args["ssl"] = ssl_ctx

engine = create_async_engine(
    db_url, echo=False, future=True, connect_args=connect_args,
    pool_pre_ping=True,
)

async_session_factory = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def get_async_session():
    """Yield an async database session."""
    async with async_session_factory() as session:
        yield session


async def create_all_tables():
    """Create all tables — used for testing or initial setup."""
    # Import all models so SQLModel registers them before create_all
    import src.models  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    # Fix existing columns that were created with wrong timezone type
    async with engine.begin() as conn:
        await conn.execute(
            sqlalchemy.text(
                "ALTER TABLE password_reset_tokens "
                "ALTER COLUMN expires_at TYPE TIMESTAMP WITH TIME ZONE "
                "USING expires_at AT TIME ZONE 'UTC'"
            )
        )
        await conn.execute(
            sqlalchemy.text(
                "ALTER TABLE password_reset_tokens "
                "ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE "
                "USING created_at AT TIME ZONE 'UTC'"
            )
        )

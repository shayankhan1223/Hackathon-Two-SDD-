"""API dependencies: authentication and database session injection."""

import uuid

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.auth.jwt import verify_jwt_token
from src.database.session import get_async_session
from src.models.user import User


async def get_session() -> AsyncSession:
    """Yield an async database session."""
    async for session in get_async_session():
        yield session


async def get_current_user(
    user_id: uuid.UUID = Depends(verify_jwt_token),
    session: AsyncSession = Depends(get_session),
) -> User:
    """Get the authenticated user from the JWT token."""
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    return user

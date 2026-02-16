"""Authentication service — async operations for password management."""

import uuid
from typing import Optional

import bcrypt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from ..models.user import User
from ..services import password_reset_service
from ..utils.email import send_password_reset_email


async def authenticate_user(session: AsyncSession, email: str, password: str) -> Optional[User]:
    """Authenticate a user with email and password."""
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        return None

    if not bcrypt.checkpw(password.encode(), user.hashed_password.encode()):
        return None

    return user


async def request_password_reset(
    session: AsyncSession, email: str, frontend_url: Optional[str] = None
) -> bool:
    """Request a password reset for a user."""
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    # Even if user doesn't exist, return True to prevent email enumeration
    if not user:
        return True

    reset_token = await password_reset_service.generate_reset_token(session, user.id)
    send_password_reset_email(email, reset_token, frontend_url)
    return True


async def reset_password(session: AsyncSession, token: str, new_password: str) -> bool:
    """Reset a user's password using a reset token."""
    token_record = await password_reset_service.get_valid_token(session, token)
    if not token_record:
        return False

    # Get the user
    result = await session.execute(select(User).where(User.id == token_record.user_id))
    user = result.scalar_one_or_none()
    if not user:
        return False

    user.hashed_password = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
    session.add(user)

    await password_reset_service.mark_token_as_used(session, token_record)
    await session.commit()

    return True


async def change_password(
    session: AsyncSession, user_id: uuid.UUID, current_password: str, new_password: str
) -> bool:
    """Change a user's password after verifying the current password."""
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return False

    if not bcrypt.checkpw(current_password.encode(), user.hashed_password.encode()):
        return False

    user.hashed_password = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
    session.add(user)
    await session.commit()

    return True

"""Password reset token service — async operations."""

import hashlib
import secrets
import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from ..models.password_reset_token import PasswordResetToken


async def generate_reset_token(session: AsyncSession, user_id: uuid.UUID) -> str:
    """Generate a new reset token for a user and return the raw token."""
    raw_token = secrets.token_urlsafe(32)

    token_record = PasswordResetToken(
        user_id=user_id,
        token_hash=hashlib.sha256(raw_token.encode()).hexdigest(),
    )

    session.add(token_record)
    await session.commit()
    await session.refresh(token_record)

    return raw_token


async def get_valid_token(session: AsyncSession, raw_token: str) -> Optional[PasswordResetToken]:
    """Get a valid, unused, non-expired token by its raw value."""
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()

    result = await session.execute(
        select(PasswordResetToken).where(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.expires_at > datetime.now(timezone.utc),
            PasswordResetToken.used == False,  # noqa: E712
        )
    )

    return result.scalar_one_or_none()


async def mark_token_as_used(session: AsyncSession, token: PasswordResetToken) -> None:
    """Mark a token as used after successful password reset."""
    token.used = True
    session.add(token)
    await session.commit()

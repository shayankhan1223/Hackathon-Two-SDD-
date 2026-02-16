"""Password reset token SQLModel entity."""

import uuid
from datetime import datetime, timedelta, timezone
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, DateTime
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


def generate_expiration():
    return datetime.now(timezone.utc) + timedelta(hours=1)


class PasswordResetToken(SQLModel, table=True):
    __tablename__ = "password_reset_tokens"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    token_hash: str = Field(max_length=64)  # SHA-256 hash
    expires_at: datetime = Field(
        default_factory=generate_expiration,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    used: bool = Field(default=False)

    # Timestamps
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    # Relationship
    user: "User" = Relationship(back_populates="password_reset_tokens")


class PasswordResetTokenRead(SQLModel):
    id: int
    user_id: uuid.UUID
    token_hash: str
    expires_at: datetime
    used: bool
    created_at: datetime

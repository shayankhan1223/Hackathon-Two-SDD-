"""User SQLModel entity."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime
from sqlmodel import Field, SQLModel, Relationship
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from .uploaded_file import UploadedFile
    from .user_preferences import UserPreferences
    from .password_reset_token import PasswordResetToken


class User(SQLModel, table=True):
    """Registered user with authentication credentials."""

    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True, nullable=False)
    hashed_password: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    # Relationships
    preferences: "UserPreferences" = Relationship(back_populates="user", sa_relationship_kwargs={"uselist": False})
    password_reset_tokens: List["PasswordResetToken"] = Relationship(back_populates="user")
    uploaded_files: List["UploadedFile"] = Relationship(back_populates="user")

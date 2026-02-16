"""User preferences SQLModel entity."""

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Column, DateTime
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class UserPreferencesBase(SQLModel):
    display_name: Optional[str] = Field(default=None, max_length=100)
    timezone: str = Field(default="UTC", max_length=50)
    theme: str = Field(default="system", max_length=20)  # light, dark, system
    email_notifications: bool = Field(default=True)
    push_notifications: bool = Field(default=True)


class UserPreferences(UserPreferencesBase, table=True):
    __tablename__ = "user_preferences"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", unique=True)

    # Timestamps
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    # Relationship
    user: "User" = Relationship(back_populates="preferences")


class UserPreferencesRead(UserPreferencesBase):
    id: int
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class UserPreferencesUpdate(SQLModel):
    display_name: Optional[str] = None
    timezone: Optional[str] = None
    theme: Optional[str] = None
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None


class UserPreferencesCreate(UserPreferencesBase):
    user_id: uuid.UUID

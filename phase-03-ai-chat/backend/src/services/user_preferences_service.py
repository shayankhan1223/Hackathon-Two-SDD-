"""User preferences service — async CRUD operations."""

import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from ..models.user_preferences import UserPreferences, UserPreferencesUpdate


async def get_or_create_for_user(session: AsyncSession, user_id: uuid.UUID) -> UserPreferences:
    """Get existing preferences for user or create default preferences."""
    result = await session.execute(
        select(UserPreferences).where(UserPreferences.user_id == user_id)
    )
    preferences = result.scalar_one_or_none()

    if not preferences:
        preferences = UserPreferences(user_id=user_id)
        session.add(preferences)
        await session.commit()
        await session.refresh(preferences)

    return preferences


async def get_by_user_id(session: AsyncSession, user_id: uuid.UUID) -> Optional[UserPreferences]:
    """Get preferences for a specific user."""
    result = await session.execute(
        select(UserPreferences).where(UserPreferences.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def update_for_user(
    session: AsyncSession, user_id: uuid.UUID, preferences_update: UserPreferencesUpdate
) -> Optional[UserPreferences]:
    """Update preferences for a specific user."""
    preferences = await get_by_user_id(session, user_id)
    if not preferences:
        # Auto-create if missing, then apply update
        preferences = UserPreferences(user_id=user_id)
        session.add(preferences)
        await session.flush()

    update_data = preferences_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(preferences, field, value)

    preferences.updated_at = datetime.now(timezone.utc)
    session.add(preferences)
    await session.commit()
    await session.refresh(preferences)
    return preferences

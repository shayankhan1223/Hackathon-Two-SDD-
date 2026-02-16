"""User-specific endpoints: preferences."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.deps import get_current_user, get_session
from src.models.user import User
from src.models.user_preferences import UserPreferencesRead, UserPreferencesUpdate
from src.services import user_preferences_service

router = APIRouter(prefix="/api/user", tags=["User"])


class MessageResponse(BaseModel):
    message: str


@router.get("/preferences", response_model=UserPreferencesRead)
async def get_user_preferences(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get user preferences (auto-creates defaults if none exist)."""
    preferences = await user_preferences_service.get_or_create_for_user(
        session, current_user.id
    )
    return preferences


@router.patch("/preferences", response_model=UserPreferencesRead)
async def update_user_preferences(
    preferences_update: UserPreferencesUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Update user preferences."""
    updated = await user_preferences_service.update_for_user(
        session, current_user.id, preferences_update
    )
    if not updated:
        raise HTTPException(status_code=404, detail="User preferences not found")
    return updated

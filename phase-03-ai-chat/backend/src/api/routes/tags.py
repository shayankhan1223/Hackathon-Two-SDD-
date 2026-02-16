"""Tag listing endpoint."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.deps import get_current_user, get_session
from src.models.user import User
from src.services import task_service

router = APIRouter(prefix="/api/tags", tags=["Tags"])


@router.get("")
async def list_tags(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """List all available tags."""
    tags = await task_service.get_tags(session)
    return [{"id": str(t.id), "name": t.name} for t in tags]

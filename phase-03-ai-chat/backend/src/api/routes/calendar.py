"""Calendar data endpoints."""

from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.deps import get_current_user, get_session
from src.models.user import User
from src.services import task_service

router = APIRouter(prefix="/api/calendar", tags=["Calendar"])


@router.get("/month")
async def get_month(
    year: int = Query(...),
    month: int = Query(..., ge=1, le=12),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get dates with tasks for a given month."""
    dates = await task_service.get_dates_with_tasks(
        session, current_user.id, year, month
    )
    return {
        "year": year,
        "month": month,
        "dates_with_tasks": [d.isoformat() for d in dates],
    }


@router.get("/day")
async def get_day(
    date: date = Query(...),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get tasks for a specific date."""
    data = await task_service.get_tasks_for_date(session, current_user.id, date)
    # Serialize tasks
    pending = []
    for t in data["pending_tasks"]:
        tags = await task_service.get_task_tags(session, t.id)
        pending.append({
            "id": str(t.id), "title": t.title, "description": t.description,
            "due_date": t.due_date.isoformat(), "priority": t.priority.value,
            "status": t.status.value,
            "tags": [{"id": str(tag.id), "name": tag.name} for tag in tags],
            "created_at": t.created_at.isoformat(), "updated_at": t.updated_at.isoformat(),
        })
    completed = []
    for t in data["completed_tasks"]:
        tags = await task_service.get_task_tags(session, t.id)
        completed.append({
            "id": str(t.id), "title": t.title, "description": t.description,
            "due_date": t.due_date.isoformat(), "priority": t.priority.value,
            "status": t.status.value,
            "tags": [{"id": str(tag.id), "name": tag.name} for tag in tags],
            "created_at": t.created_at.isoformat(), "updated_at": t.updated_at.isoformat(),
        })
    return {
        "date": data["date"],
        "pending_tasks": pending,
        "completed_tasks": completed,
    }

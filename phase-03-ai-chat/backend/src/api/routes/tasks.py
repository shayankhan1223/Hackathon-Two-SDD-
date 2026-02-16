"""Task CRUD REST endpoints matching OpenAPI contract."""

import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.deps import get_current_user, get_session
from src.models.task import Priority, TaskStatus
from src.models.user import User
from src.services import task_service

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


class TaskCreateRequest(BaseModel):
    title: str
    description: str | None = None
    due_date: date
    priority: Priority = Priority.medium
    tag_ids: list[uuid.UUID] = []


class TaskUpdateRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    due_date: date | None = None
    priority: Priority | None = None
    status: TaskStatus | None = None
    tag_ids: list[uuid.UUID] | None = None


async def _task_response(session: AsyncSession, task) -> dict:
    """Build task response dict including tags."""
    tags = await task_service.get_task_tags(session, task.id)
    return {
        "id": str(task.id),
        "user_id": str(task.user_id),
        "title": task.title,
        "description": task.description,
        "due_date": task.due_date.isoformat(),
        "priority": task.priority.value,
        "status": task.status.value,
        "tags": [{"id": str(t.id), "name": t.name} for t in tags],
        "created_at": task.created_at.isoformat(),
        "updated_at": task.updated_at.isoformat(),
    }


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_task(
    body: TaskCreateRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Create a new task."""
    if not body.title.strip():
        raise HTTPException(status_code=422, detail="Title cannot be empty")

    task = await task_service.create_task(
        session=session,
        user_id=current_user.id,
        title=body.title.strip(),
        due_date=body.due_date,
        description=body.description,
        priority=body.priority,
        tag_ids=body.tag_ids or None,
    )
    return await _task_response(session, task)


@router.get("")
async def list_tasks(
    status: TaskStatus | None = None,
    priority: Priority | None = None,
    tag_ids: list[uuid.UUID] | None = Query(None),
    search: str | None = None,
    due_date_from: date | None = None,
    due_date_to: date | None = None,
    sort_by: str = "due_date",
    sort_order: str = "asc",
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """List tasks with optional filters."""
    tasks = await task_service.list_tasks(
        session=session,
        user_id=current_user.id,
        status=status,
        priority=priority,
        tag_ids=tag_ids,
        search=search,
        due_date_from=due_date_from,
        due_date_to=due_date_to,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    task_responses = [await _task_response(session, t) for t in tasks]
    return {"tasks": task_responses, "total": len(task_responses)}


@router.get("/{task_id}")
async def get_task(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get a single task."""
    task = await task_service.get_task(session, current_user.id, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return await _task_response(session, task)


@router.patch("/{task_id}")
async def update_task(
    task_id: uuid.UUID,
    body: TaskUpdateRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Update a task."""
    if body.title is not None and not body.title.strip():
        raise HTTPException(status_code=422, detail="Title cannot be empty")

    task = await task_service.update_task(
        session=session,
        user_id=current_user.id,
        task_id=task_id,
        title=body.title.strip() if body.title else None,
        description=body.description,
        due_date=body.due_date,
        priority=body.priority,
        status=body.status,
        tag_ids=body.tag_ids,
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return await _task_response(session, task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Delete a task."""
    deleted = await task_service.delete_task(session, current_user.id, task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")


@router.post("/{task_id}/complete")
async def complete_task(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Mark a task as completed."""
    task = await task_service.complete_task(session, current_user.id, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return await _task_response(session, task)

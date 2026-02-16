"""
Task management endpoints with user isolation.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Path
from pydantic import BaseModel, Field
from sqlmodel import Session
from uuid import UUID
from typing import List, Optional
from datetime import datetime
from src.infrastructure.database import get_session
from src.application.task_service import TaskService
from src.api.deps import get_current_user

router = APIRouter(prefix="/api", tags=["Tasks"])


# Request/Response Models
class CreateTaskRequest(BaseModel):
    """Request to create a new task."""

    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(None, max_length=1000, description="Task description")


class UpdateTaskRequest(BaseModel):
    """Request to update a task."""

    title: Optional[str] = Field(None, min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(None, max_length=1000, description="Task description")
    completed: Optional[bool] = Field(None, description="Task completion status")


class TaskResponse(BaseModel):
    """Task response model."""

    id: UUID
    user_id: UUID
    title: str
    description: str
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    """Response with list of tasks."""

    tasks: List[TaskResponse]
    count: int


# Helper function
def validate_user_id_match(path_user_id: UUID, jwt_user_id: UUID):
    """
    Validate that user_id in path matches user_id from JWT.

    Raises:
        403: If user_id mismatch
    """
    if path_user_id != jwt_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access another user's resources",
        )


# Endpoints
@router.get("/{user_id}/tasks", response_model=TaskListResponse)
async def list_tasks(
    user_id: UUID = Path(..., description="User ID"),
    current_user_id: UUID = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    List all tasks for authenticated user.

    Args:
        user_id: User ID from path (must match JWT user_id)
        current_user_id: User ID from JWT token
        session: Database session

    Returns:
        List of user's tasks

    Raises:
        401: Missing or invalid JWT
        403: user_id mismatch
    """
    validate_user_id_match(user_id, current_user_id)

    task_service = TaskService(session)
    tasks = task_service.get_user_tasks(user_id)

    return TaskListResponse(
        tasks=[TaskResponse.model_validate(task) for task in tasks], count=len(tasks)
    )


@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    request: CreateTaskRequest,
    user_id: UUID = Path(..., description="User ID"),
    current_user_id: UUID = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Create a new task for authenticated user.

    Args:
        request: Task creation request
        user_id: User ID from path (must match JWT user_id)
        current_user_id: User ID from JWT token
        session: Database session

    Returns:
        Created task

    Raises:
        400: Validation error
        401: Missing or invalid JWT
        403: user_id mismatch
    """
    validate_user_id_match(user_id, current_user_id)

    task_service = TaskService(session)
    task = task_service.create_task(
        user_id=user_id, title=request.title, description=request.description
    )

    return TaskResponse.model_validate(task)


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    user_id: UUID = Path(..., description="User ID"),
    task_id: UUID = Path(..., description="Task ID"),
    current_user_id: UUID = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Get a specific task by ID.

    Args:
        user_id: User ID from path (must match JWT user_id)
        task_id: Task ID
        current_user_id: User ID from JWT token
        session: Database session

    Returns:
        Task details

    Raises:
        401: Missing or invalid JWT
        403: user_id mismatch
        404: Task not found or not owned by user
    """
    validate_user_id_match(user_id, current_user_id)

    task_service = TaskService(session)
    task = task_service.get_task_by_id(task_id, user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return TaskResponse.model_validate(task)


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    request: UpdateTaskRequest,
    user_id: UUID = Path(..., description="User ID"),
    task_id: UUID = Path(..., description="Task ID"),
    current_user_id: UUID = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Update a task.

    Args:
        request: Task update request
        user_id: User ID from path (must match JWT user_id)
        task_id: Task ID
        current_user_id: User ID from JWT token
        session: Database session

    Returns:
        Updated task

    Raises:
        400: Validation error
        401: Missing or invalid JWT
        403: user_id mismatch
        404: Task not found or not owned by user
    """
    validate_user_id_match(user_id, current_user_id)

    task_service = TaskService(session)
    task = task_service.update_task(
        task_id=task_id,
        user_id=user_id,
        title=request.title,
        description=request.description,
        completed=request.completed,
    )

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return TaskResponse.model_validate(task)


@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: UUID = Path(..., description="User ID"),
    task_id: UUID = Path(..., description="Task ID"),
    current_user_id: UUID = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Delete a task.

    Args:
        user_id: User ID from path (must match JWT user_id)
        task_id: Task ID
        current_user_id: User ID from JWT token
        session: Database session

    Returns:
        204 No Content on success

    Raises:
        401: Missing or invalid JWT
        403: user_id mismatch
        404: Task not found or not owned by user
    """
    validate_user_id_match(user_id, current_user_id)

    task_service = TaskService(session)
    deleted = task_service.delete_task(task_id, user_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

"""
Task CRUD endpoints for Phase II Web Todo Application.

REST API routes for task management operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from typing import Annotated

from src.api.dependencies import get_task_service
from src.api.models import (
    CreateTaskRequest,
    UpdateTaskRequest,
    TaskResponse,
    TaskListResponse,
    ErrorCode
)
from src.application.task_service import TaskService
from src.application.exceptions import TaskNotFoundError, InvalidTaskDataError


router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "Task created successfully"},
        400: {"description": "Invalid input data"},
        422: {"description": "Validation error"},
        500: {"description": "Internal server error"}
    }
)
async def create_task(
    task_data: CreateTaskRequest,
    service: Annotated[TaskService, Depends(get_task_service)]
) -> TaskResponse:
    """Create a new task."""
    try:
        task = service.create_task(
            title=task_data.title,
            description=task_data.description
        )
        return TaskResponse(
            id=str(task.id),
            title=task.title,
            description=task.description,
            completed=task.completed
        )
    except InvalidTaskDataError as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "detail": str(e),
                "error_code": ErrorCode.INVALID_TASK_DATA.value,
                "status_code": status.HTTP_400_BAD_REQUEST
            }
        )


@router.get(
    "",
    response_model=TaskListResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Successfully retrieved tasks"},
        500: {"description": "Internal server error"}
    }
)
async def list_tasks(
    service: Annotated[TaskService, Depends(get_task_service)]
) -> TaskListResponse:
    """Retrieve all tasks."""
    tasks = service.list_tasks()
    return TaskListResponse(
        tasks=[
            TaskResponse(
                id=str(task.id),
                title=task.title,
                description=task.description,
                completed=task.completed
            )
            for task in tasks
        ],
        count=len(tasks)
    )


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Task retrieved successfully"},
        404: {"description": "Task not found"},
        422: {"description": "Validation error"},
        500: {"description": "Internal server error"}
    }
)
async def get_task(
    task_id: str,
    service: Annotated[TaskService, Depends(get_task_service)]
) -> TaskResponse:
    """Retrieve a specific task by ID."""
    try:
        task = service.get_task(task_id)
        return TaskResponse(
            id=str(task.id),
            title=task.title,
            description=task.description,
            completed=task.completed
        )
    except TaskNotFoundError as e:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "detail": str(e),
                "error_code": ErrorCode.TASK_NOT_FOUND.value,
                "status_code": status.HTTP_404_NOT_FOUND
            }
        )
    except InvalidTaskDataError as e:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": str(e),
                "error_code": ErrorCode.INVALID_TASK_DATA.value,
                "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY
            }
        )


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Task updated successfully"},
        400: {"description": "Invalid input data"},
        404: {"description": "Task not found"},
        422: {"description": "Validation error"},
        500: {"description": "Internal server error"}
    }
)
async def update_task(
    task_id: str,
    task_data: UpdateTaskRequest,
    service: Annotated[TaskService, Depends(get_task_service)]
) -> TaskResponse:
    """Update a task's title and/or description."""
    try:
        task = service.update_task(
            task_id=task_id,
            title=task_data.title,
            description=task_data.description
        )
        return TaskResponse(
            id=str(task.id),
            title=task.title,
            description=task.description,
            completed=task.completed
        )
    except TaskNotFoundError as e:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "detail": str(e),
                "error_code": ErrorCode.TASK_NOT_FOUND.value,
                "status_code": status.HTTP_404_NOT_FOUND
            }
        )
    except InvalidTaskDataError as e:
        # Invalid UUID format → 422, invalid field values → 400
        error_msg = str(e)
        status_code = (
            status.HTTP_422_UNPROCESSABLE_ENTITY
            if "Invalid task ID format" in error_msg
            else status.HTTP_400_BAD_REQUEST
        )
        return JSONResponse(
            status_code=status_code,
            content={
                "detail": error_msg,
                "error_code": ErrorCode.INVALID_TASK_DATA.value,
                "status_code": status_code
            }
        )


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        204: {"description": "Task deleted successfully"},
        404: {"description": "Task not found"},
        422: {"description": "Validation error"},
        500: {"description": "Internal server error"}
    }
)
async def delete_task(
    task_id: str,
    service: Annotated[TaskService, Depends(get_task_service)]
) -> None:
    """Delete a task permanently."""
    try:
        service.delete_task(task_id)
    except TaskNotFoundError as e:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "detail": str(e),
                "error_code": ErrorCode.TASK_NOT_FOUND.value,
                "status_code": status.HTTP_404_NOT_FOUND
            }
        )
    except InvalidTaskDataError as e:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": str(e),
                "error_code": ErrorCode.INVALID_TASK_DATA.value,
                "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY
            }
        )


@router.patch(
    "/{task_id}/complete",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Task completion status toggled"},
        404: {"description": "Task not found"},
        422: {"description": "Validation error"},
        500: {"description": "Internal server error"}
    }
)
async def toggle_task_completion(
    task_id: str,
    service: Annotated[TaskService, Depends(get_task_service)]
) -> TaskResponse:
    """Toggle task completion status."""
    try:
        task = service.complete_task(task_id)
        return TaskResponse(
            id=str(task.id),
            title=task.title,
            description=task.description,
            completed=task.completed
        )
    except TaskNotFoundError as e:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "detail": str(e),
                "error_code": ErrorCode.TASK_NOT_FOUND.value,
                "status_code": status.HTTP_404_NOT_FOUND
            }
        )
    except InvalidTaskDataError as e:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": str(e),
                "error_code": ErrorCode.INVALID_TASK_DATA.value,
                "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY
            }
        )

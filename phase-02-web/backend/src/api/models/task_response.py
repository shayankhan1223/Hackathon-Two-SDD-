"""
Response models for Task API endpoints.

Pydantic models for serializing task data in HTTP responses.
"""

from pydantic import BaseModel, Field
from uuid import UUID


class TaskResponse(BaseModel):
    """
    Response model for single task operations.

    Used by POST /tasks, GET /tasks/{id}, PUT /tasks/{id}, PATCH /tasks/{id}/complete.
    """

    id: str = Field(
        ...,
        description="Unique task identifier (UUID)",
        examples=["550e8400-e29b-41d4-a716-446655440000"]
    )
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Task title",
        examples=["Buy groceries"]
    )
    description: str = Field(
        ...,
        max_length=1000,
        description="Task description",
        examples=["Milk, eggs, bread, and vegetables"]
    )
    completed: bool = Field(
        ...,
        description="Whether task is completed",
        examples=[False]
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "title": "Buy groceries",
                    "description": "Milk, eggs, bread",
                    "completed": False
                }
            ]
        }
    }


class TaskListResponse(BaseModel):
    """
    Response model for GET /tasks endpoint.

    Contains list of all tasks and total count.
    """

    tasks: list[TaskResponse] = Field(
        ...,
        description="List of all tasks"
    )
    count: int = Field(
        ...,
        ge=0,
        description="Total number of tasks",
        examples=[5]
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "tasks": [
                        {
                            "id": "uuid-1",
                            "title": "Task 1",
                            "description": "Description 1",
                            "completed": False
                        },
                        {
                            "id": "uuid-2",
                            "title": "Task 2",
                            "description": "Description 2",
                            "completed": True
                        }
                    ],
                    "count": 2
                }
            ]
        }
    }

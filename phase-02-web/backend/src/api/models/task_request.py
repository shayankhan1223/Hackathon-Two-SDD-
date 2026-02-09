"""
Request models for Task API endpoints.

Pydantic models for validating incoming request data.
"""

from pydantic import BaseModel, Field, field_validator


class CreateTaskRequest(BaseModel):
    """
    Request body for POST /tasks endpoint.

    Validates task creation data with title required and description optional.
    """

    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Task title (required, non-empty, max 200 characters)",
        examples=["Buy groceries"]
    )
    description: str = Field(
        default="",
        max_length=1000,
        description="Task description (optional, max 1000 characters)",
        examples=["Milk, eggs, bread"]
    )

    @field_validator('title')
    @classmethod
    def title_must_not_be_whitespace(cls, v: str) -> str:
        """Validate that title is not empty or whitespace-only."""
        if not v or not v.strip():
            raise ValueError('Title must not be empty or whitespace-only')
        return v.strip()


class UpdateTaskRequest(BaseModel):
    """
    Request body for PUT /tasks/{id} endpoint.

    Validates task update data with at least one field required.
    Both title and description are optional, but at least one must be provided.
    """

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
        description="New task title (optional, non-empty if provided)",
        examples=["Buy groceries and gas"]
    )
    description: str | None = Field(
        default=None,
        max_length=1000,
        description="New task description (optional)",
        examples=["Updated description"]
    )

    @field_validator('title')
    @classmethod
    def title_must_not_be_whitespace(cls, v: str | None) -> str | None:
        """Validate that title is not empty or whitespace-only if provided."""
        if v is not None:
            if not v.strip():
                raise ValueError('Title must not be empty or whitespace-only')
            return v.strip()
        return v

    def model_post_init(self, __context) -> None:
        """Validate that at least one field is provided."""
        if self.title is None and self.description is None:
            raise ValueError('At least one field (title or description) must be provided')

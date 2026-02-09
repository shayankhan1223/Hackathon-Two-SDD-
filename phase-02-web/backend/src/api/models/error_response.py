"""
Error response model for API endpoints.

Pydantic model for standardized error responses.
"""

from pydantic import BaseModel, Field
from enum import Enum


class ErrorCode(str, Enum):
    """Machine-readable error codes."""
    TASK_NOT_FOUND = "TASK_NOT_FOUND"
    INVALID_TASK_DATA = "INVALID_TASK_DATA"
    INTERNAL_ERROR = "INTERNAL_ERROR"


class ErrorResponse(BaseModel):
    """
    Standardized error response for all API errors.

    Used for 400, 404, and 500 error responses.
    """

    detail: str = Field(
        ...,
        description="Human-readable error message",
        examples=["Task not found with ID: abc-123"]
    )
    error_code: ErrorCode = Field(
        ...,
        description="Machine-readable error code",
        examples=["TASK_NOT_FOUND"]
    )
    status_code: int = Field(
        ...,
        description="HTTP status code",
        examples=[404]
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "detail": "Task not found with ID: abc-123",
                    "error_code": "TASK_NOT_FOUND",
                    "status_code": 404
                },
                {
                    "detail": "Title must not be empty",
                    "error_code": "INVALID_TASK_DATA",
                    "status_code": 400
                }
            ]
        }
    }

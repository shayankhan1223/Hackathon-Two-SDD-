"""
Unit tests for Pydantic models used in API requests and responses.

Tests the data validation, serialization, and schema generation for:
- CreateTaskRequest
- UpdateTaskRequest
- TaskResponse
- TaskListResponse
- ErrorResponse
"""

import pytest
from pydantic import ValidationError
from uuid import uuid4


class TestCreateTaskRequest:
    """Tests for CreateTaskRequest Pydantic model."""

    def test_valid_create_request_with_all_fields(self):
        """Test creating request with title and description."""
        from src.api.models.task_request import CreateTaskRequest

        request = CreateTaskRequest(
            title="Buy groceries",
            description="Milk, eggs, bread"
        )

        assert request.title == "Buy groceries"
        assert request.description == "Milk, eggs, bread"

    def test_valid_create_request_with_only_title(self):
        """Test creating request with only title (description optional)."""
        from src.api.models.task_request import CreateTaskRequest

        request = CreateTaskRequest(title="Call dentist")

        assert request.title == "Call dentist"
        assert request.description == ""  # Default empty string

    def test_create_request_strips_whitespace_from_title(self):
        """Test that title whitespace is stripped."""
        from src.api.models.task_request import CreateTaskRequest

        request = CreateTaskRequest(title="  Spaced title  ")

        assert request.title == "Spaced title"

    def test_create_request_rejects_empty_title(self):
        """Test that empty title raises ValidationError."""
        from src.api.models.task_request import CreateTaskRequest

        with pytest.raises(ValidationError) as exc_info:
            CreateTaskRequest(title="")

        errors = exc_info.value.errors()
        assert any("title" in str(error) for error in errors)

    def test_create_request_rejects_whitespace_only_title(self):
        """Test that whitespace-only title raises ValidationError."""
        from src.api.models.task_request import CreateTaskRequest

        with pytest.raises(ValidationError) as exc_info:
            CreateTaskRequest(title="   ")

        errors = exc_info.value.errors()
        assert any("title" in str(error) for error in errors)

    def test_create_request_rejects_title_too_long(self):
        """Test that title >200 chars raises ValidationError."""
        from src.api.models.task_request import CreateTaskRequest

        long_title = "A" * 201

        with pytest.raises(ValidationError) as exc_info:
            CreateTaskRequest(title=long_title)

        errors = exc_info.value.errors()
        assert any("title" in str(error) for error in errors)

    def test_create_request_rejects_description_too_long(self):
        """Test that description >1000 chars raises ValidationError."""
        from src.api.models.task_request import CreateTaskRequest

        long_desc = "B" * 1001

        with pytest.raises(ValidationError) as exc_info:
            CreateTaskRequest(title="Valid", description=long_desc)

        errors = exc_info.value.errors()
        assert any("description" in str(error) for error in errors)

    def test_create_request_requires_title_field(self):
        """Test that title field is required."""
        from src.api.models.task_request import CreateTaskRequest

        with pytest.raises(ValidationError) as exc_info:
            CreateTaskRequest(description="No title")

        errors = exc_info.value.errors()
        assert any("title" in str(error) for error in errors)

    def test_create_request_serialization(self):
        """Test that model serializes to correct JSON structure."""
        from src.api.models.task_request import CreateTaskRequest

        request = CreateTaskRequest(
            title="Task title",
            description="Task description"
        )

        json_data = request.model_dump()

        assert json_data == {
            "title": "Task title",
            "description": "Task description"
        }


class TestUpdateTaskRequest:
    """Tests for UpdateTaskRequest Pydantic model."""

    def test_update_request_with_title_only(self):
        """Test updating only title."""
        from src.api.models.task_request import UpdateTaskRequest

        request = UpdateTaskRequest(title="New title")

        assert request.title == "New title"
        assert request.description is None

    def test_update_request_with_description_only(self):
        """Test updating only description."""
        from src.api.models.task_request import UpdateTaskRequest

        request = UpdateTaskRequest(description="New description")

        assert request.title is None
        assert request.description == "New description"

    def test_update_request_with_both_fields(self):
        """Test updating both title and description."""
        from src.api.models.task_request import UpdateTaskRequest

        request = UpdateTaskRequest(
            title="New title",
            description="New description"
        )

        assert request.title == "New title"
        assert request.description == "New description"

    def test_update_request_rejects_empty_title(self):
        """Test that empty title raises ValidationError."""
        from src.api.models.task_request import UpdateTaskRequest

        with pytest.raises(ValidationError):
            UpdateTaskRequest(title="")

    def test_update_request_rejects_title_too_long(self):
        """Test that title >200 chars raises ValidationError."""
        from src.api.models.task_request import UpdateTaskRequest

        with pytest.raises(ValidationError):
            UpdateTaskRequest(title="X" * 201)

    def test_update_request_rejects_description_too_long(self):
        """Test that description >1000 chars raises ValidationError."""
        from src.api.models.task_request import UpdateTaskRequest

        with pytest.raises(ValidationError):
            UpdateTaskRequest(description="Y" * 1001)

    def test_update_request_allows_empty_body(self):
        """Test that update request can be created with no fields (for partial updates)."""
        from src.api.models.task_request import UpdateTaskRequest

        # Should allow empty update (though API layer should reject it)
        request = UpdateTaskRequest()

        assert request.title is None
        assert request.description is None

    def test_update_request_strips_whitespace(self):
        """Test that fields have whitespace stripped."""
        from src.api.models.task_request import UpdateTaskRequest

        request = UpdateTaskRequest(
            title="  Spaced  ",
            description="  Spaced desc  "
        )

        assert request.title == "Spaced"
        assert request.description == "Spaced desc"


class TestTaskResponse:
    """Tests for TaskResponse Pydantic model."""

    def test_task_response_with_all_fields(self):
        """Test creating TaskResponse with all fields."""
        from src.api.models.task_response import TaskResponse

        task_id = uuid4()
        response = TaskResponse(
            id=task_id,
            title="Task title",
            description="Task description",
            completed=False
        )

        assert response.id == task_id
        assert response.title == "Task title"
        assert response.description == "Task description"
        assert response.completed is False

    def test_task_response_serialization(self):
        """Test TaskResponse serializes to correct JSON."""
        from src.api.models.task_response import TaskResponse

        task_id = uuid4()
        response = TaskResponse(
            id=task_id,
            title="Test",
            description="Desc",
            completed=True
        )

        json_data = response.model_dump()

        assert json_data["id"] == task_id
        assert json_data["title"] == "Test"
        assert json_data["description"] == "Desc"
        assert json_data["completed"] is True

    def test_task_response_json_with_string_uuid(self):
        """Test TaskResponse serializes UUID as string in JSON mode."""
        from src.api.models.task_response import TaskResponse

        task_id = uuid4()
        response = TaskResponse(
            id=task_id,
            title="Test",
            description="",
            completed=False
        )

        json_str = response.model_dump_json()

        assert str(task_id) in json_str
        assert '"id":' in json_str or "'id':" in json_str

    def test_task_response_from_domain_task(self):
        """Test creating TaskResponse from domain Task entity."""
        from src.domain.task import Task
        from src.api.models.task_response import TaskResponse

        # Create domain task
        domain_task = Task(
            title="Domain task",
            description="Domain description"
        )

        # Convert to response model
        response = TaskResponse(
            id=domain_task.id,
            title=domain_task.title,
            description=domain_task.description,
            completed=domain_task.completed
        )

        assert response.id == domain_task.id
        assert response.title == domain_task.title
        assert response.description == domain_task.description
        assert response.completed == domain_task.completed


class TestTaskListResponse:
    """Tests for TaskListResponse Pydantic model."""

    def test_task_list_response_with_tasks(self):
        """Test TaskListResponse with task array."""
        from src.api.models.task_response import TaskResponse, TaskListResponse

        tasks = [
            TaskResponse(id=uuid4(), title="Task 1", description="", completed=False),
            TaskResponse(id=uuid4(), title="Task 2", description="", completed=True),
        ]

        response = TaskListResponse(tasks=tasks, count=2)

        assert len(response.tasks) == 2
        assert response.count == 2

    def test_task_list_response_empty(self):
        """Test TaskListResponse with empty task array."""
        from src.api.models.task_response import TaskListResponse

        response = TaskListResponse(tasks=[], count=0)

        assert response.tasks == []
        assert response.count == 0

    def test_task_list_response_count_matches_array_length(self):
        """Test that count field matches tasks array length."""
        from src.api.models.task_response import TaskResponse, TaskListResponse

        tasks = [
            TaskResponse(id=uuid4(), title=f"Task {i}", description="", completed=False)
            for i in range(5)
        ]

        response = TaskListResponse(tasks=tasks, count=5)

        assert response.count == len(response.tasks)

    def test_task_list_response_serialization(self):
        """Test TaskListResponse serializes correctly."""
        from src.api.models.task_response import TaskResponse, TaskListResponse

        task_id = uuid4()
        tasks = [
            TaskResponse(id=task_id, title="Task", description="Desc", completed=False)
        ]

        response = TaskListResponse(tasks=tasks, count=1)
        json_data = response.model_dump()

        assert "tasks" in json_data
        assert "count" in json_data
        assert json_data["count"] == 1
        assert len(json_data["tasks"]) == 1
        assert json_data["tasks"][0]["id"] == task_id


class TestErrorResponse:
    """Tests for ErrorResponse Pydantic model."""

    def test_error_response_with_all_fields(self):
        """Test creating ErrorResponse with all required fields."""
        from src.api.models.error_response import ErrorResponse

        error = ErrorResponse(
            detail="Task not found",
            error_code="TASK_NOT_FOUND",
            status_code=404
        )

        assert error.detail == "Task not found"
        assert error.error_code == "TASK_NOT_FOUND"
        assert error.status_code == 404

    def test_error_response_serialization(self):
        """Test ErrorResponse serializes correctly."""
        from src.api.models.error_response import ErrorResponse

        error = ErrorResponse(
            detail="Invalid task data",
            error_code="INVALID_TASK_DATA",
            status_code=400
        )

        json_data = error.model_dump()

        assert json_data["detail"] == "Invalid task data"
        assert json_data["error_code"] == "INVALID_TASK_DATA"
        assert json_data["status_code"] == 400

    def test_error_response_for_404(self):
        """Test ErrorResponse for 404 Not Found."""
        from src.api.models.error_response import ErrorResponse

        error = ErrorResponse(
            detail="Task with ID abc-123 not found",
            error_code="TASK_NOT_FOUND",
            status_code=404
        )

        assert error.status_code == 404
        assert error.error_code == "TASK_NOT_FOUND"

    def test_error_response_for_400(self):
        """Test ErrorResponse for 400 Bad Request."""
        from src.api.models.error_response import ErrorResponse

        error = ErrorResponse(
            detail="Title cannot be empty",
            error_code="INVALID_TASK_DATA",
            status_code=400
        )

        assert error.status_code == 400
        assert error.error_code == "INVALID_TASK_DATA"

    def test_error_response_for_500(self):
        """Test ErrorResponse for 500 Internal Server Error."""
        from src.api.models.error_response import ErrorResponse

        error = ErrorResponse(
            detail="An unexpected error occurred",
            error_code="INTERNAL_SERVER_ERROR",
            status_code=500
        )

        assert error.status_code == 500
        assert error.error_code == "INTERNAL_SERVER_ERROR"


class TestModelValidation:
    """Tests for cross-cutting validation concerns."""

    def test_all_models_have_correct_schema_generation(self):
        """Test that all models generate valid JSON schemas."""
        from src.api.models.task_request import CreateTaskRequest, UpdateTaskRequest
        from src.api.models.task_response import TaskResponse, TaskListResponse
        from src.api.models.error_response import ErrorResponse

        # All models should generate schemas without errors
        assert CreateTaskRequest.model_json_schema() is not None
        assert UpdateTaskRequest.model_json_schema() is not None
        assert TaskResponse.model_json_schema() is not None
        assert TaskListResponse.model_json_schema() is not None
        assert ErrorResponse.model_json_schema() is not None

    def test_models_compatible_with_openapi_spec(self):
        """Test that models are compatible with OpenAPI 3.0 spec."""
        from src.api.models.task_request import CreateTaskRequest

        schema = CreateTaskRequest.model_json_schema()

        # Should have required fields
        assert "properties" in schema
        assert "required" in schema
        assert "title" in schema["required"]

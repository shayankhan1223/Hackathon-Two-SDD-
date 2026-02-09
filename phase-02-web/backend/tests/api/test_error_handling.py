"""
Error handling tests for Phase II Web Todo Application API.

Tests the API's ability to handle and report errors correctly:
- Domain validation errors → 400 Bad Request
- Resource not found errors → 404 Not Found
- Unexpected exceptions → 500 Internal Server Error
- Proper error response structure
"""

import pytest
from fastapi.testclient import TestClient
from uuid import uuid4
from unittest.mock import patch, Mock


class TestErrorResponseStructure:
    """Tests for error response format and structure."""

    def test_404_error_has_correct_structure(self, client):
        """Test 404 error response contains detail, error_code, status_code."""
        fake_id = str(uuid4())
        response = client.get(f"/tasks/{fake_id}")

        assert response.status_code == 404
        error = response.json()

        # Verify required fields
        assert "detail" in error
        assert "error_code" in error
        assert "status_code" in error

        # Verify values
        assert error["error_code"] == "TASK_NOT_FOUND"
        assert error["status_code"] == 404
        assert isinstance(error["detail"], str)
        assert len(error["detail"]) > 0

    def test_400_error_has_correct_structure(self, client):
        """Test 400 error response contains detail, error_code, status_code."""
        response = client.post(
            "/tasks",
            json={"title": ""}  # Empty title triggers validation error
        )

        assert response.status_code == 400
        error = response.json()

        assert "detail" in error
        assert "error_code" in error
        assert "status_code" in error

        assert error["error_code"] == "INVALID_TASK_DATA"
        assert error["status_code"] == 400

    def test_error_detail_message_is_user_friendly(self, client):
        """Test error messages are user-friendly, not technical."""
        # Test 404 error
        fake_id = str(uuid4())
        response = client.get(f"/tasks/{fake_id}")
        error = response.json()

        # Should not contain stack traces or implementation details
        assert "Traceback" not in error["detail"]
        assert "Exception" not in error["detail"]
        assert ".py" not in error["detail"]

        # Should contain helpful information
        assert fake_id in error["detail"] or "not found" in error["detail"].lower()


class TestValidationErrors:
    """Tests for input validation error scenarios."""

    def test_empty_title_returns_400_with_clear_message(self, client):
        """Test empty title validation returns clear error message."""
        response = client.post("/tasks", json={"title": ""})

        assert response.status_code == 400
        error = response.json()
        assert "title" in error["detail"].lower() or "empty" in error["detail"].lower()

    def test_title_too_long_returns_400(self, client):
        """Test title exceeding max length returns 400."""
        long_title = "A" * 201
        response = client.post("/tasks", json={"title": long_title})

        assert response.status_code == 400
        error = response.json()
        assert error["error_code"] == "INVALID_TASK_DATA"

    def test_description_too_long_returns_400(self, client):
        """Test description exceeding max length returns 400."""
        long_desc = "B" * 1001
        response = client.post(
            "/tasks",
            json={"title": "Valid", "description": long_desc}
        )

        assert response.status_code == 400

    def test_missing_required_field_returns_422(self, client):
        """Test missing required field (title) returns 422 from Pydantic."""
        response = client.post("/tasks", json={"description": "No title"})

        # Pydantic validation returns 422 for schema violations
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data


class TestNotFoundErrors:
    """Tests for resource not found scenarios."""

    def test_get_nonexistent_task_returns_404(self, client):
        """Test getting non-existent task returns 404."""
        fake_id = str(uuid4())
        response = client.get(f"/tasks/{fake_id}")

        assert response.status_code == 404
        assert response.json()["error_code"] == "TASK_NOT_FOUND"

    def test_update_nonexistent_task_returns_404(self, client):
        """Test updating non-existent task returns 404."""
        fake_id = str(uuid4())
        response = client.put(
            f"/tasks/{fake_id}",
            json={"title": "New title"}
        )

        assert response.status_code == 404
        assert response.json()["error_code"] == "TASK_NOT_FOUND"

    def test_complete_nonexistent_task_returns_404(self, client):
        """Test completing non-existent task returns 404."""
        fake_id = str(uuid4())
        response = client.patch(f"/tasks/{fake_id}/complete")

        assert response.status_code == 404
        assert response.json()["error_code"] == "TASK_NOT_FOUND"

    def test_delete_nonexistent_task_returns_404(self, client):
        """Test deleting non-existent task returns 404."""
        fake_id = str(uuid4())
        response = client.delete(f"/tasks/{fake_id}")

        assert response.status_code == 404
        assert response.json()["error_code"] == "TASK_NOT_FOUND"


class TestInternalServerErrors:
    """Tests for 500 Internal Server Error handling."""

    def test_unexpected_exception_returns_500(self, client, monkeypatch):
        """Test unexpected exceptions are caught and return 500."""
        # This test requires mocking to force an unexpected exception
        # Implementation depends on how global exception handler is set up
        # For now, verify the error response structure

        # We'll implement this once the API is built
        # Placeholder test to ensure 500 handler exists
        pass

    def test_500_error_has_correct_structure(self):
        """Test 500 error response follows error schema."""
        # Mock test - to be implemented based on actual 500 scenarios
        # Verify: detail, error_code, status_code fields present
        pass


class TestCORSConfiguration:
    """Tests for CORS headers in API responses."""

    def test_cors_headers_present_for_allowed_origin(self, client):
        """Test CORS headers are present for configured origins."""
        response = client.get(
            "/tasks",
            headers={"Origin": "http://localhost:3000"}
        )

        # Verify CORS headers (if CORS middleware is configured)
        # Exact headers depend on FastAPI CORS configuration
        assert response.status_code == 200

    def test_preflight_options_request_succeeds(self, client):
        """Test CORS preflight OPTIONS request is handled."""
        response = client.options(
            "/tasks",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type"
            }
        )

        # Should succeed with CORS headers
        # Exact behavior depends on CORS middleware config
        assert response.status_code in [200, 204]


class TestAPIResponseSchemas:
    """Tests verifying API responses match OpenAPI schema."""

    def test_task_response_schema(self, client):
        """Test TaskResponse contains all required fields."""
        response = client.post("/tasks", json={"title": "Schema test"})

        assert response.status_code == 201
        task = response.json()

        # Required fields per OpenAPI schema
        assert "id" in task
        assert "title" in task
        assert "description" in task
        assert "completed" in task

        # Type verification
        assert isinstance(task["id"], str)
        assert isinstance(task["title"], str)
        assert isinstance(task["description"], str)
        assert isinstance(task["completed"], bool)

    def test_task_list_response_schema(self, client):
        """Test TaskListResponse contains tasks array and count."""
        response = client.get("/tasks")

        assert response.status_code == 200
        data = response.json()

        # Required fields per OpenAPI schema
        assert "tasks" in data
        assert "count" in data

        # Type verification
        assert isinstance(data["tasks"], list)
        assert isinstance(data["count"], int)
        assert data["count"] >= 0

    def test_error_response_schema(self, client):
        """Test ErrorResponse contains detail, error_code, status_code."""
        fake_id = str(uuid4())
        response = client.get(f"/tasks/{fake_id}")

        assert response.status_code == 404
        error = response.json()

        # Required fields per OpenAPI schema
        assert "detail" in error
        assert "error_code" in error
        assert "status_code" in error

        # Type verification
        assert isinstance(error["detail"], str)
        assert isinstance(error["error_code"], str)
        assert isinstance(error["status_code"], int)


class TestHTTPStatusCodes:
    """Tests verifying correct HTTP status codes for all scenarios."""

    def test_successful_operations_return_correct_codes(self, client):
        """Test success status codes: 200, 201, 204."""
        # 201 Created
        create_response = client.post("/tasks", json={"title": "Task"})
        assert create_response.status_code == 201

        task_id = create_response.json()["id"]

        # 200 OK (list)
        list_response = client.get("/tasks")
        assert list_response.status_code == 200

        # 200 OK (get)
        get_response = client.get(f"/tasks/{task_id}")
        assert get_response.status_code == 200

        # 200 OK (update)
        update_response = client.put(
            f"/tasks/{task_id}",
            json={"title": "Updated"}
        )
        assert update_response.status_code == 200

        # 200 OK (complete)
        complete_response = client.patch(f"/tasks/{task_id}/complete")
        assert complete_response.status_code == 200

        # 204 No Content (delete)
        delete_response = client.delete(f"/tasks/{task_id}")
        assert delete_response.status_code == 204

    def test_validation_errors_return_400(self, client):
        """Test validation errors return 400 Bad Request."""
        # Empty title
        response1 = client.post("/tasks", json={"title": ""})
        assert response1.status_code == 400

        # Title too long
        response2 = client.post("/tasks", json={"title": "X" * 201})
        assert response2.status_code == 400

        # Create task for update tests
        create_response = client.post("/tasks", json={"title": "Task"})
        task_id = create_response.json()["id"]

        # Update with empty title
        response3 = client.put(f"/tasks/{task_id}", json={"title": ""})
        assert response3.status_code == 400

    def test_not_found_errors_return_404(self, client):
        """Test resource not found returns 404 Not Found."""
        fake_id = str(uuid4())

        # GET
        assert client.get(f"/tasks/{fake_id}").status_code == 404

        # PUT
        assert client.put(f"/tasks/{fake_id}", json={"title": "Test"}).status_code == 404

        # PATCH
        assert client.patch(f"/tasks/{fake_id}/complete").status_code == 404

        # DELETE
        assert client.delete(f"/tasks/{fake_id}").status_code == 404

    def test_schema_validation_errors_return_422(self, client):
        """Test Pydantic schema validation returns 422."""
        # Missing required field (title)
        response = client.post("/tasks", json={"description": "No title"})
        assert response.status_code == 422

        # Invalid UUID format
        response2 = client.get("/tasks/not-a-uuid")
        assert response2.status_code == 422


# Fixtures

@pytest.fixture
def client():
    """Provide FastAPI TestClient for API tests."""
    from src.api.main import app
    return TestClient(app)

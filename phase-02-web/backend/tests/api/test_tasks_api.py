"""
API tests for Task endpoints in Phase II Web Todo Application.

Tests the FastAPI REST API layer, verifying:
- HTTP status codes
- Request/response JSON schemas
- Error handling
- Integration with TaskService

These tests use FastAPI TestClient for in-process HTTP testing.
"""

import pytest
from fastapi.testclient import TestClient
from uuid import uuid4


class TestCreateTaskEndpoint:
    """Tests for POST /tasks endpoint."""

    def test_create_task_with_valid_data_returns_201(self, client):
        """Test creating task with valid title and description returns 201 Created."""
        response = client.post(
            "/tasks",
            json={"title": "Buy groceries", "description": "Milk, eggs, bread"}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Buy groceries"
        assert data["description"] == "Milk, eggs, bread"
        assert data["completed"] is False
        assert "id" in data
        # Verify UUID format
        assert len(data["id"]) == 36  # UUID string format

    def test_create_task_with_only_title_returns_201(self, client):
        """Test creating task with only title (no description) succeeds."""
        response = client.post(
            "/tasks",
            json={"title": "Call dentist"}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Call dentist"
        assert data["description"] == ""
        assert data["completed"] is False

    def test_create_task_with_empty_title_returns_400(self, client):
        """Test creating task with empty title returns 400 Bad Request."""
        response = client.post(
            "/tasks",
            json={"title": "", "description": "Some description"}
        )

        assert response.status_code == 400
        error = response.json()
        assert "detail" in error
        assert "error_code" in error
        assert error["error_code"] == "INVALID_TASK_DATA"

    def test_create_task_with_whitespace_only_title_returns_400(self, client):
        """Test creating task with whitespace-only title returns 400."""
        response = client.post(
            "/tasks",
            json={"title": "   ", "description": "Test"}
        )

        assert response.status_code == 400
        error = response.json()
        assert error["error_code"] == "INVALID_TASK_DATA"

    def test_create_task_with_title_exceeding_max_length_returns_400(self, client):
        """Test creating task with title >200 chars returns 400."""
        long_title = "A" * 201
        response = client.post(
            "/tasks",
            json={"title": long_title, "description": "Test"}
        )

        assert response.status_code == 400
        error = response.json()
        assert error["error_code"] == "INVALID_TASK_DATA"

    def test_create_task_with_description_exceeding_max_length_returns_400(self, client):
        """Test creating task with description >1000 chars returns 400."""
        long_description = "B" * 1001
        response = client.post(
            "/tasks",
            json={"title": "Valid title", "description": long_description}
        )

        assert response.status_code == 400
        error = response.json()
        assert error["error_code"] == "INVALID_TASK_DATA"

    def test_create_task_without_title_field_returns_422(self, client):
        """Test creating task without required title field returns 422 Unprocessable Entity."""
        response = client.post(
            "/tasks",
            json={"description": "No title provided"}
        )

        # FastAPI/Pydantic validation returns 422 for missing required fields
        assert response.status_code == 422

    def test_create_task_with_invalid_json_returns_422(self, client):
        """Test creating task with malformed JSON returns 422."""
        response = client.post(
            "/tasks",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )

        assert response.status_code == 422


class TestListTasksEndpoint:
    """Tests for GET /tasks endpoint."""

    def test_list_tasks_returns_200_with_tasks(self, client, sample_tasks):
        """Test listing tasks returns 200 OK with task array."""
        response = client.get("/tasks")

        assert response.status_code == 200
        data = response.json()
        assert "tasks" in data
        assert "count" in data
        assert isinstance(data["tasks"], list)
        assert data["count"] == len(data["tasks"])
        assert data["count"] >= 0

    def test_list_tasks_returns_empty_list_when_no_tasks(self, client):
        """Test listing tasks with no tasks returns empty array."""
        response = client.get("/tasks")

        assert response.status_code == 200
        data = response.json()
        assert data["tasks"] == []
        assert data["count"] == 0

    def test_list_tasks_shows_completed_status(self, client):
        """Test that listed tasks include completion status."""
        # Create incomplete task
        client.post("/tasks", json={"title": "Incomplete task"})
        # Create and complete a task
        create_response = client.post("/tasks", json={"title": "Complete task"})
        task_id = create_response.json()["id"]
        client.patch(f"/tasks/{task_id}/complete")

        # List all tasks
        response = client.get("/tasks")

        assert response.status_code == 200
        data = response.json()
        tasks = data["tasks"]
        assert len(tasks) == 2
        # Verify both completed statuses are present
        completed_statuses = [t["completed"] for t in tasks]
        assert True in completed_statuses
        assert False in completed_statuses


class TestGetSingleTaskEndpoint:
    """Tests for GET /tasks/{id} endpoint."""

    def test_get_task_by_id_returns_200_with_task(self, client):
        """Test getting existing task by ID returns 200 OK."""
        # Create a task first
        create_response = client.post(
            "/tasks",
            json={"title": "Test task", "description": "Test description"}
        )
        task_id = create_response.json()["id"]

        # Get the task
        response = client.get(f"/tasks/{task_id}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == task_id
        assert data["title"] == "Test task"
        assert data["description"] == "Test description"
        assert data["completed"] is False

    def test_get_task_with_nonexistent_id_returns_404(self, client):
        """Test getting task with non-existent UUID returns 404 Not Found."""
        fake_id = str(uuid4())
        response = client.get(f"/tasks/{fake_id}")

        assert response.status_code == 404
        error = response.json()
        assert "detail" in error
        assert "error_code" in error
        assert error["error_code"] == "TASK_NOT_FOUND"

    def test_get_task_with_invalid_uuid_format_returns_422(self, client):
        """Test getting task with invalid UUID format returns 422."""
        response = client.get("/tasks/not-a-valid-uuid")

        # FastAPI path parameter validation returns 422
        assert response.status_code == 422


class TestUpdateTaskEndpoint:
    """Tests for PUT /tasks/{id} endpoint."""

    def test_update_task_title_returns_200(self, client):
        """Test updating task title returns 200 OK with updated task."""
        # Create task
        create_response = client.post("/tasks", json={"title": "Original title"})
        task_id = create_response.json()["id"]

        # Update title
        response = client.put(
            f"/tasks/{task_id}",
            json={"title": "Updated title"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated title"
        assert data["id"] == task_id

    def test_update_task_description_returns_200(self, client):
        """Test updating task description returns 200 OK."""
        # Create task
        create_response = client.post(
            "/tasks",
            json={"title": "Task", "description": "Original"}
        )
        task_id = create_response.json()["id"]

        # Update description
        response = client.put(
            f"/tasks/{task_id}",
            json={"description": "Updated description"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["description"] == "Updated description"
        assert data["title"] == "Task"  # Title unchanged

    def test_update_task_both_fields_returns_200(self, client):
        """Test updating both title and description returns 200 OK."""
        # Create task
        create_response = client.post("/tasks", json={"title": "Old", "description": "Old desc"})
        task_id = create_response.json()["id"]

        # Update both
        response = client.put(
            f"/tasks/{task_id}",
            json={"title": "New title", "description": "New description"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "New title"
        assert data["description"] == "New description"

    def test_update_task_with_empty_title_returns_400(self, client):
        """Test updating task with empty title returns 400 Bad Request."""
        # Create task
        create_response = client.post("/tasks", json={"title": "Valid title"})
        task_id = create_response.json()["id"]

        # Attempt to update with empty title
        response = client.put(
            f"/tasks/{task_id}",
            json={"title": ""}
        )

        assert response.status_code == 400
        error = response.json()
        assert error["error_code"] == "INVALID_TASK_DATA"

    def test_update_task_with_title_too_long_returns_400(self, client):
        """Test updating task with title >200 chars returns 400."""
        # Create task
        create_response = client.post("/tasks", json={"title": "Valid"})
        task_id = create_response.json()["id"]

        # Attempt update with too long title
        long_title = "X" * 201
        response = client.put(
            f"/tasks/{task_id}",
            json={"title": long_title}
        )

        assert response.status_code == 400
        error = response.json()
        assert error["error_code"] == "INVALID_TASK_DATA"

    def test_update_task_with_nonexistent_id_returns_404(self, client):
        """Test updating non-existent task returns 404 Not Found."""
        fake_id = str(uuid4())
        response = client.put(
            f"/tasks/{fake_id}",
            json={"title": "New title"}
        )

        assert response.status_code == 404
        error = response.json()
        assert error["error_code"] == "TASK_NOT_FOUND"

    def test_update_task_with_invalid_uuid_returns_422(self, client):
        """Test updating with invalid UUID format returns 422."""
        response = client.put(
            "/tasks/invalid-uuid",
            json={"title": "New title"}
        )

        assert response.status_code == 422


class TestCompleteTaskEndpoint:
    """Tests for PATCH /tasks/{id}/complete endpoint."""

    def test_complete_incomplete_task_returns_200(self, client):
        """Test completing incomplete task returns 200 OK with completed=True."""
        # Create incomplete task
        create_response = client.post("/tasks", json={"title": "Task to complete"})
        task_id = create_response.json()["id"]

        # Complete it
        response = client.patch(f"/tasks/{task_id}/complete")

        assert response.status_code == 200
        data = response.json()
        assert data["completed"] is True
        assert data["id"] == task_id

    def test_complete_already_completed_task_toggles_back(self, client):
        """Test completing already completed task toggles back to incomplete."""
        # Create and complete task
        create_response = client.post("/tasks", json={"title": "Task"})
        task_id = create_response.json()["id"]
        client.patch(f"/tasks/{task_id}/complete")  # Complete it

        # Complete again (should toggle to incomplete)
        response = client.patch(f"/tasks/{task_id}/complete")

        assert response.status_code == 200
        data = response.json()
        assert data["completed"] is False  # Toggled back

    def test_complete_task_with_nonexistent_id_returns_404(self, client):
        """Test completing non-existent task returns 404 Not Found."""
        fake_id = str(uuid4())
        response = client.patch(f"/tasks/{fake_id}/complete")

        assert response.status_code == 404
        error = response.json()
        assert error["error_code"] == "TASK_NOT_FOUND"

    def test_complete_task_with_invalid_uuid_returns_422(self, client):
        """Test completing task with invalid UUID returns 422."""
        response = client.patch("/tasks/not-a-uuid/complete")

        assert response.status_code == 422


class TestDeleteTaskEndpoint:
    """Tests for DELETE /tasks/{id} endpoint."""

    def test_delete_existing_task_returns_204(self, client):
        """Test deleting existing task returns 204 No Content."""
        # Create task
        create_response = client.post("/tasks", json={"title": "Task to delete"})
        task_id = create_response.json()["id"]

        # Delete it
        response = client.delete(f"/tasks/{task_id}")

        assert response.status_code == 204
        assert response.content == b""  # No content in 204 response

    def test_delete_task_removes_from_list(self, client):
        """Test deleted task no longer appears in list."""
        # Create task
        create_response = client.post("/tasks", json={"title": "To be deleted"})
        task_id = create_response.json()["id"]

        # Verify it exists
        list_response = client.get("/tasks")
        assert list_response.json()["count"] == 1

        # Delete it
        client.delete(f"/tasks/{task_id}")

        # Verify it's gone
        list_response = client.get("/tasks")
        assert list_response.json()["count"] == 0
        assert list_response.json()["tasks"] == []

    def test_delete_task_cannot_be_retrieved_after_deletion(self, client):
        """Test getting deleted task returns 404."""
        # Create and delete task
        create_response = client.post("/tasks", json={"title": "Task"})
        task_id = create_response.json()["id"]
        client.delete(f"/tasks/{task_id}")

        # Try to get it
        response = client.get(f"/tasks/{task_id}")

        assert response.status_code == 404

    def test_delete_nonexistent_task_returns_404(self, client):
        """Test deleting non-existent task returns 404 Not Found."""
        fake_id = str(uuid4())
        response = client.delete(f"/tasks/{fake_id}")

        assert response.status_code == 404
        error = response.json()
        assert error["error_code"] == "TASK_NOT_FOUND"

    def test_delete_task_with_invalid_uuid_returns_422(self, client):
        """Test deleting with invalid UUID returns 422."""
        response = client.delete("/tasks/invalid-id")

        assert response.status_code == 422


class TestAPIEndToEndWorkflows:
    """Integration tests for complete CRUD workflows via API."""

    def test_complete_crud_workflow(self, client):
        """Test full CRUD lifecycle: create, read, update, complete, delete."""
        # CREATE
        create_response = client.post(
            "/tasks",
            json={"title": "Workflow test", "description": "Testing CRUD"}
        )
        assert create_response.status_code == 201
        task_id = create_response.json()["id"]

        # READ (single)
        get_response = client.get(f"/tasks/{task_id}")
        assert get_response.status_code == 200
        assert get_response.json()["title"] == "Workflow test"

        # READ (list)
        list_response = client.get("/tasks")
        assert list_response.status_code == 200
        assert list_response.json()["count"] == 1

        # UPDATE
        update_response = client.put(
            f"/tasks/{task_id}",
            json={"title": "Updated workflow"}
        )
        assert update_response.status_code == 200
        assert update_response.json()["title"] == "Updated workflow"

        # COMPLETE
        complete_response = client.patch(f"/tasks/{task_id}/complete")
        assert complete_response.status_code == 200
        assert complete_response.json()["completed"] is True

        # DELETE
        delete_response = client.delete(f"/tasks/{task_id}")
        assert delete_response.status_code == 204

        # VERIFY deletion
        final_list = client.get("/tasks")
        assert final_list.json()["count"] == 0

    def test_multiple_tasks_workflow(self, client):
        """Test creating and managing multiple tasks."""
        # Create 3 tasks
        task_ids = []
        for i in range(3):
            response = client.post(
                "/tasks",
                json={"title": f"Task {i+1}", "description": f"Description {i+1}"}
            )
            assert response.status_code == 201
            task_ids.append(response.json()["id"])

        # Verify all exist
        list_response = client.get("/tasks")
        assert list_response.json()["count"] == 3

        # Complete one task
        client.patch(f"/tasks/{task_ids[1]}/complete")

        # Update another
        client.put(
            f"/tasks/{task_ids[0]}",
            json={"title": "Updated Task 1"}
        )

        # Delete one
        client.delete(f"/tasks/{task_ids[2]}")

        # Verify final state
        final_list = client.get("/tasks")
        assert final_list.json()["count"] == 2

        tasks = {t["id"]: t for t in final_list.json()["tasks"]}
        assert tasks[task_ids[0]]["title"] == "Updated Task 1"
        assert tasks[task_ids[0]]["completed"] is False
        assert tasks[task_ids[1]]["completed"] is True
        assert task_ids[2] not in tasks

    def test_task_state_persists_across_operations(self, client):
        """Test task modifications persist correctly."""
        # Create task
        create_response = client.post(
            "/tasks",
            json={"title": "Persist test", "description": "Original"}
        )
        task_id = create_response.json()["id"]

        # Update title
        client.put(f"/tasks/{task_id}", json={"title": "Modified"})

        # Update description
        client.put(f"/tasks/{task_id}", json={"description": "New description"})

        # Complete task
        client.patch(f"/tasks/{task_id}/complete")

        # Verify all changes persisted
        final_response = client.get(f"/tasks/{task_id}")
        task = final_response.json()
        assert task["title"] == "Modified"
        assert task["description"] == "New description"
        assert task["completed"] is True


class TestAPIErrorScenarios:
    """Tests for API error handling and edge cases."""

    def test_creating_task_twice_generates_different_ids(self, client):
        """Test that creating identical tasks generates unique IDs."""
        task_data = {"title": "Same title", "description": "Same description"}

        response1 = client.post("/tasks", json=task_data)
        response2 = client.post("/tasks", json=task_data)

        assert response1.status_code == 201
        assert response2.status_code == 201
        assert response1.json()["id"] != response2.json()["id"]

    def test_operations_on_empty_repository(self, client):
        """Test that operations work correctly when no tasks exist."""
        # List empty
        list_response = client.get("/tasks")
        assert list_response.status_code == 200
        assert list_response.json()["count"] == 0

        # Get non-existent
        fake_id = str(uuid4())
        get_response = client.get(f"/tasks/{fake_id}")
        assert get_response.status_code == 404

        # Update non-existent
        update_response = client.put(f"/tasks/{fake_id}", json={"title": "New"})
        assert update_response.status_code == 404

        # Delete non-existent
        delete_response = client.delete(f"/tasks/{fake_id}")
        assert delete_response.status_code == 404

    def test_update_without_any_fields_returns_400(self, client):
        """Test updating task with no fields returns 400."""
        # Create task
        create_response = client.post("/tasks", json={"title": "Task"})
        task_id = create_response.json()["id"]

        # Update with empty body
        response = client.put(f"/tasks/{task_id}", json={})

        # Should return 400 or 422 (validation error)
        assert response.status_code in [400, 422]


# Fixtures

@pytest.fixture
def client():
    """Provide FastAPI TestClient for API tests."""
    from src.api.main import app
    return TestClient(app)


@pytest.fixture
def sample_tasks(client):
    """Create sample tasks for testing."""
    tasks = []
    for i in range(3):
        response = client.post(
            "/tasks",
            json={"title": f"Sample Task {i+1}", "description": f"Description {i+1}"}
        )
        tasks.append(response.json())
    return tasks

"""
Integration tests for the complete Phase II backend stack.

Tests the full integration of:
- FastAPI endpoints
- Domain logic (Task entity)
- Application services (TaskService)
- Infrastructure (InMemoryTaskRepository)

These tests verify the complete flow from HTTP request to domain logic
and back to HTTP response.
"""

import pytest
from fastapi.testclient import TestClient
from uuid import UUID


class TestFullStackIntegration:
    """Tests for complete backend stack integration."""

    def test_task_creation_flow_through_all_layers(self, client):
        """
        Test creating a task flows through all architectural layers:
        API → TaskService → Domain → Repository → Domain → TaskService → API
        """
        # Create task via API
        response = client.post(
            "/tasks",
            json={"title": "Integration test", "description": "Full stack test"}
        )

        # Verify API response
        assert response.status_code == 201
        task_data = response.json()
        
        # Verify response structure (API layer)
        assert "id" in task_data
        assert task_data["title"] == "Integration test"
        assert task_data["description"] == "Full stack test"
        assert task_data["completed"] is False

        # Verify ID is valid UUID (domain constraint)
        task_id = task_data["id"]
        UUID(task_id)  # Should not raise ValueError

        # Verify task persists in repository (retrieve via API)
        get_response = client.get(f"/tasks/{task_id}")
        assert get_response.status_code == 200
        assert get_response.json() == task_data

    def test_task_update_flow_through_all_layers(self, client):
        """Test updating a task flows through all layers correctly."""
        # Create task
        create_response = client.post(
            "/tasks",
            json={"title": "Original", "description": "Original desc"}
        )
        task_id = create_response.json()["id"]

        # Update via API
        update_response = client.put(
            f"/tasks/{task_id}",
            json={"title": "Updated", "description": "Updated desc"}
        )

        # Verify update response
        assert update_response.status_code == 200
        updated_task = update_response.json()
        assert updated_task["title"] == "Updated"
        assert updated_task["description"] == "Updated desc"
        assert updated_task["id"] == task_id

        # Verify changes persist (domain + repository)
        get_response = client.get(f"/tasks/{task_id}")
        persisted_task = get_response.json()
        assert persisted_task["title"] == "Updated"
        assert persisted_task["description"] == "Updated desc"

    def test_task_completion_flow_through_all_layers(self, client):
        """Test completing a task flows through domain logic correctly."""
        # Create task
        create_response = client.post("/tasks", json={"title": "To complete"})
        task_id = create_response.json()["id"]

        # Complete via API
        complete_response = client.patch(f"/tasks/{task_id}/complete")

        # Verify completion response
        assert complete_response.status_code == 200
        assert complete_response.json()["completed"] is True

        # Verify domain state persists
        get_response = client.get(f"/tasks/{task_id}")
        assert get_response.json()["completed"] is True

        # Toggle back (test domain toggle logic)
        toggle_response = client.patch(f"/tasks/{task_id}/complete")
        assert toggle_response.status_code == 200
        assert toggle_response.json()["completed"] is False

    def test_task_deletion_flow_through_all_layers(self, client):
        """Test deleting a task removes it from repository."""
        # Create task
        create_response = client.post("/tasks", json={"title": "To delete"})
        task_id = create_response.json()["id"]

        # Verify exists
        assert client.get(f"/tasks/{task_id}").status_code == 200

        # Delete via API
        delete_response = client.delete(f"/tasks/{task_id}")
        assert delete_response.status_code == 204

        # Verify removed from repository
        assert client.get(f"/tasks/{task_id}").status_code == 404

        # Verify not in list
        list_response = client.get("/tasks")
        task_ids = [t["id"] for t in list_response.json()["tasks"]]
        assert task_id not in task_ids

    def test_list_tasks_reflects_repository_state(self, client):
        """Test that list endpoint accurately reflects repository state."""
        # Start with empty repository
        list_response = client.get("/tasks")
        initial_count = list_response.json()["count"]

        # Create 3 tasks
        task_ids = []
        for i in range(3):
            response = client.post("/tasks", json={"title": f"Task {i+1}"})
            task_ids.append(response.json()["id"])

        # Verify all 3 appear in list
        list_response = client.get("/tasks")
        tasks = list_response.json()["tasks"]
        assert list_response.json()["count"] == initial_count + 3
        assert len(tasks) == initial_count + 3

        # Complete one task
        client.patch(f"/tasks/{task_ids[0]}/complete")

        # Verify list shows completed status
        list_response = client.get("/tasks")
        tasks_dict = {t["id"]: t for t in list_response.json()["tasks"]}
        assert tasks_dict[task_ids[0]]["completed"] is True
        assert tasks_dict[task_ids[1]]["completed"] is False
        assert tasks_dict[task_ids[2]]["completed"] is False

        # Delete one task
        client.delete(f"/tasks/{task_ids[1]}")

        # Verify list updated
        list_response = client.get("/tasks")
        assert list_response.json()["count"] == initial_count + 2
        remaining_ids = [t["id"] for t in list_response.json()["tasks"]]
        assert task_ids[1] not in remaining_ids


class TestDomainValidationEnforcement:
    """Tests that domain validation rules are enforced through the API."""

    def test_empty_title_rejected_by_domain_via_api(self, client):
        """Test that domain title validation is enforced via API."""
        response = client.post("/tasks", json={"title": ""})

        assert response.status_code == 400
        error = response.json()
        assert error["error_code"] == "INVALID_TASK_DATA"

    def test_title_length_limit_enforced_by_domain(self, client):
        """Test that domain enforces 200-char title limit."""
        long_title = "A" * 201
        response = client.post("/tasks", json={"title": long_title})

        assert response.status_code == 400

    def test_description_length_limit_enforced_by_domain(self, client):
        """Test that domain enforces 1000-char description limit."""
        long_desc = "B" * 1001
        response = client.post("/tasks", json={"title": "Valid", "description": long_desc})

        assert response.status_code == 400

    def test_task_immutability_enforced(self, client):
        """Test that task ID cannot be changed after creation."""
        # Create task
        create_response = client.post("/tasks", json={"title": "Task"})
        original_id = create_response.json()["id"]

        # Update task (ID should remain same)
        update_response = client.put(
            f"/tasks/{original_id}",
            json={"title": "Updated"}
        )

        # Verify ID unchanged
        assert update_response.json()["id"] == original_id


class TestRepositoryPersistence:
    """Tests that repository correctly persists and retrieves tasks."""

    def test_multiple_tasks_stored_independently(self, client):
        """Test that multiple tasks are stored without interference."""
        # Create 3 tasks with different data
        tasks_data = [
            {"title": "Task A", "description": "Desc A"},
            {"title": "Task B", "description": "Desc B"},
            {"title": "Task C", "description": "Desc C"},
        ]

        task_ids = []
        for data in tasks_data:
            response = client.post("/tasks", json=data)
            task_ids.append(response.json()["id"])

        # Verify each task has correct data
        for i, task_id in enumerate(task_ids):
            response = client.get(f"/tasks/{task_id}")
            task = response.json()
            assert task["title"] == tasks_data[i]["title"]
            assert task["description"] == tasks_data[i]["description"]

    def test_task_updates_do_not_affect_other_tasks(self, client):
        """Test that updating one task doesn't affect others."""
        # Create 2 tasks
        response1 = client.post("/tasks", json={"title": "Task 1"})
        response2 = client.post("/tasks", json={"title": "Task 2"})

        task1_id = response1.json()["id"]
        task2_id = response2.json()["id"]

        # Update task 1
        client.put(f"/tasks/{task1_id}", json={"title": "Updated Task 1"})

        # Verify task 2 unchanged
        task2_response = client.get(f"/tasks/{task2_id}")
        assert task2_response.json()["title"] == "Task 2"

    def test_task_deletion_does_not_affect_other_tasks(self, client):
        """Test that deleting one task doesn't affect others."""
        # Create 3 tasks
        ids = []
        for i in range(3):
            response = client.post("/tasks", json={"title": f"Task {i}"})
            ids.append(response.json()["id"])

        # Delete middle task
        client.delete(f"/tasks/{ids[1]}")

        # Verify others still exist
        assert client.get(f"/tasks/{ids[0]}").status_code == 200
        assert client.get(f"/tasks/{ids[2]}").status_code == 200

        # Verify deleted task is gone
        assert client.get(f"/tasks/{ids[1]}").status_code == 404


class TestServiceLayerIntegration:
    """Tests for TaskService integration with API and domain."""

    def test_service_handles_duplicate_titles(self, client):
        """Test that service allows duplicate titles (business rule)."""
        # Create two tasks with same title
        response1 = client.post("/tasks", json={"title": "Duplicate"})
        response2 = client.post("/tasks", json={"title": "Duplicate"})

        # Both should succeed with different IDs
        assert response1.status_code == 201
        assert response2.status_code == 201
        assert response1.json()["id"] != response2.json()["id"]

    def test_service_generates_unique_ids(self, client):
        """Test that service generates unique UUIDs for each task."""
        # Create 10 tasks
        ids = set()
        for i in range(10):
            response = client.post("/tasks", json={"title": f"Task {i}"})
            ids.add(response.json()["id"])

        # All IDs should be unique
        assert len(ids) == 10

    def test_service_propagates_domain_exceptions_to_api(self, client):
        """Test that domain exceptions are caught and converted to HTTP errors."""
        # Attempt invalid operation (empty title)
        response = client.post("/tasks", json={"title": ""})

        # Should return 400, not 500
        assert response.status_code == 400
        assert response.json()["error_code"] == "INVALID_TASK_DATA"

    def test_service_handles_not_found_correctly(self, client):
        """Test that service not-found exceptions become 404 responses."""
        from uuid import uuid4

        fake_id = str(uuid4())
        response = client.get(f"/tasks/{fake_id}")

        assert response.status_code == 404
        assert response.json()["error_code"] == "TASK_NOT_FOUND"


class TestConcurrentOperations:
    """Tests for handling multiple operations in sequence."""

    def test_rapid_create_and_delete_operations(self, client):
        """Test that rapid create/delete operations work correctly."""
        # Create 5 tasks rapidly
        ids = []
        for i in range(5):
            response = client.post("/tasks", json={"title": f"Task {i}"})
            ids.append(response.json()["id"])

        # Delete all rapidly
        for task_id in ids:
            response = client.delete(f"/tasks/{task_id}")
            assert response.status_code == 204

        # Verify all deleted
        list_response = client.get("/tasks")
        task_ids = [t["id"] for t in list_response.json()["tasks"]]
        for deleted_id in ids:
            assert deleted_id not in task_ids

    def test_interleaved_operations_maintain_consistency(self, client):
        """Test that interleaved CRUD operations maintain data consistency."""
        # Create task
        r1 = client.post("/tasks", json={"title": "Task 1"})
        id1 = r1.json()["id"]

        # Update task
        client.put(f"/tasks/{id1}", json={"title": "Updated 1"})

        # Create another task
        r2 = client.post("/tasks", json={"title": "Task 2"})
        id2 = r2.json()["id"]

        # Complete first task
        client.patch(f"/tasks/{id1}/complete")

        # Update second task
        client.put(f"/tasks/{id2}", json={"description": "Desc 2"})

        # Verify final state
        task1 = client.get(f"/tasks/{id1}").json()
        task2 = client.get(f"/tasks/{id2}").json()

        assert task1["title"] == "Updated 1"
        assert task1["completed"] is True
        assert task2["title"] == "Task 2"
        assert task2["description"] == "Desc 2"
        assert task2["completed"] is False


# Fixtures

@pytest.fixture
def client():
    """Provide FastAPI TestClient for integration tests."""
    from src.api.main import app
    return TestClient(app)

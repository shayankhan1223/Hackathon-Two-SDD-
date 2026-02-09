"""
Shared fixtures for API tests.

Provides TestClient and common test utilities for FastAPI endpoint testing.
"""

import pytest
from fastapi.testclient import TestClient


@pytest.fixture(autouse=True)
def clear_repository_cache():
    """
    Clear repository cache between tests for isolation.

    This fixture runs automatically before each test to ensure
    each test starts with a fresh, empty repository.
    """
    from src.api.dependencies import get_task_repository

    # Clear the lru_cache to get fresh repository
    get_task_repository.cache_clear()
    yield
    # Clear again after test
    get_task_repository.cache_clear()


@pytest.fixture
def client():
    """
    Provide FastAPI TestClient for API tests.

    TestClient allows testing FastAPI endpoints without running a server.
    Automatically handles app lifespan and cleanup.
    """
    from src.api.main import app

    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def sample_task_data():
    """Provide sample valid task data for testing."""
    return {
        "title": "Sample Task",
        "description": "Sample task description"
    }


@pytest.fixture
def multiple_tasks_data():
    """Provide multiple task data sets for batch testing."""
    return [
        {"title": "Task 1", "description": "Description 1"},
        {"title": "Task 2", "description": "Description 2"},
        {"title": "Task 3", "description": "Description 3"},
    ]


@pytest.fixture
def create_task(client):
    """
    Factory fixture to create tasks during tests.

    Returns a function that creates a task and returns its ID.
    """
    def _create_task(title="Test Task", description="Test Description"):
        response = client.post(
            "/tasks",
            json={"title": title, "description": description}
        )
        assert response.status_code == 201
        return response.json()["id"]

    return _create_task


@pytest.fixture
def create_multiple_tasks(client):
    """
    Factory fixture to create multiple tasks.

    Returns a function that creates N tasks and returns their IDs.
    """
    def _create_multiple(count=3):
        task_ids = []
        for i in range(count):
            response = client.post(
                "/tasks",
                json={"title": f"Task {i+1}", "description": f"Description {i+1}"}
            )
            assert response.status_code == 201
            task_ids.append(response.json()["id"])
        return task_ids

    return _create_multiple

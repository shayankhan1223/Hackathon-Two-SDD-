"""Test fixtures for task-related tests."""

import pytest

from src.domain.task import Task
from src.infrastructure.in_memory_task_repository import InMemoryTaskRepository
from src.application.task_service import TaskService


@pytest.fixture
def task_repository() -> InMemoryTaskRepository:
    """Provide a fresh in-memory task repository for each test."""
    return InMemoryTaskRepository()


@pytest.fixture
def task_service(task_repository: InMemoryTaskRepository) -> TaskService:
    """Provide a task service with in-memory repository for each test."""
    return TaskService(repository=task_repository)


@pytest.fixture
def sample_task() -> Task:
    """Provide a sample task for testing."""
    return Task.create(
        title="Sample task",
        description="This is a sample task for testing"
    )


@pytest.fixture
def multiple_tasks() -> list[Task]:
    """Provide multiple sample tasks for testing."""
    return [
        Task.create(title="Task 1", description="First task"),
        Task.create(title="Task 2", description="Second task"),
        Task.create(title="Task 3", description="Third task"),
    ]


@pytest.fixture
def populated_repository(
    task_repository: InMemoryTaskRepository,
    multiple_tasks: list[Task]
) -> InMemoryTaskRepository:
    """Provide a repository pre-populated with tasks."""
    for task in multiple_tasks:
        task_repository.create(task)
    return task_repository


@pytest.fixture
def populated_service(
    populated_repository: InMemoryTaskRepository
) -> TaskService:
    """Provide a task service with pre-populated repository."""
    return TaskService(repository=populated_repository)

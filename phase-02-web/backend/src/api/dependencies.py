"""
Dependency injection for FastAPI routes.

Provides service instances to route handlers using FastAPI's dependency injection system.
"""

from functools import lru_cache
from src.application.task_service import TaskService
from src.infrastructure.in_memory_task_repository import InMemoryTaskRepository


@lru_cache
def get_task_repository() -> InMemoryTaskRepository:
    """
    Provide singleton TaskRepository instance.

    Uses lru_cache to ensure single repository instance across all requests,
    maintaining in-memory state consistency.
    """
    return InMemoryTaskRepository()


def get_task_service() -> TaskService:
    """
    Provide TaskService instance with injected repository.

    Creates new TaskService for each request but reuses same repository.
    """
    repository = get_task_repository()
    return TaskService(repository=repository)

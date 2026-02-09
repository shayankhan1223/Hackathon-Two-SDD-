"""Task repository interface - Abstract storage contract for tasks."""

from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from .task import Task


class TaskRepository(ABC):
    """Abstract interface for task storage operations.

    This interface defines the contract for persisting and retrieving tasks.
    Implementations can use in-memory storage, databases, or any other
    persistence mechanism without affecting dependent code.
    """

    @abstractmethod
    def create(self, task: Task) -> Task:
        """Store a new task.

        Args:
            task: Task entity to store

        Returns:
            The stored task

        Raises:
            ValueError: If task with same ID already exists
        """
        pass

    @abstractmethod
    def get_by_id(self, task_id: UUID) -> Optional[Task]:
        """Retrieve a task by its ID.

        Args:
            task_id: Unique identifier of the task

        Returns:
            Task if found, None otherwise
        """
        pass

    @abstractmethod
    def get_all(self) -> List[Task]:
        """Retrieve all tasks.

        Returns:
            List of all tasks (empty list if none exist)
        """
        pass

    @abstractmethod
    def update(self, task: Task) -> Task:
        """Update an existing task.

        Args:
            task: Task entity with updated data

        Returns:
            The updated task

        Raises:
            ValueError: If task does not exist
        """
        pass

    @abstractmethod
    def delete(self, task_id: UUID) -> bool:
        """Remove a task by its ID.

        Args:
            task_id: Unique identifier of the task to remove

        Returns:
            True if task was deleted, False if it didn't exist
        """
        pass

    @abstractmethod
    def exists(self, task_id: UUID) -> bool:
        """Check if a task exists.

        Args:
            task_id: Unique identifier to check

        Returns:
            True if task exists, False otherwise
        """
        pass

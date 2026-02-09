"""In-memory implementation of task repository."""

from typing import Dict, List, Optional
from uuid import UUID

from ..domain.task import Task
from ..domain.task_repository import TaskRepository


class InMemoryTaskRepository(TaskRepository):
    """Dictionary-based in-memory storage for tasks.

    Uses a Python dict for O(1) lookup by task ID.
    Data is lost when the application terminates.
    """

    def __init__(self) -> None:
        """Initialize empty task storage."""
        self._tasks: Dict[UUID, Task] = {}

    def create(self, task: Task) -> Task:
        """Store a new task.

        Args:
            task: Task entity to store

        Returns:
            The stored task

        Raises:
            ValueError: If task with same ID already exists
        """
        if task.id in self._tasks:
            raise ValueError(f"Task with ID '{task.id}' already exists")

        self._tasks[task.id] = task
        return task

    def get_by_id(self, task_id: UUID) -> Optional[Task]:
        """Retrieve a task by its ID.

        Args:
            task_id: Unique identifier of the task

        Returns:
            Task if found, None otherwise
        """
        return self._tasks.get(task_id)

    def get_all(self) -> List[Task]:
        """Retrieve all tasks.

        Returns:
            List of all tasks (empty list if none exist)
        """
        return list(self._tasks.values())

    def update(self, task: Task) -> Task:
        """Update an existing task.

        Args:
            task: Task entity with updated data

        Returns:
            The updated task

        Raises:
            ValueError: If task does not exist
        """
        if task.id not in self._tasks:
            raise ValueError(f"Task with ID '{task.id}' not found")

        self._tasks[task.id] = task
        return task

    def delete(self, task_id: UUID) -> bool:
        """Remove a task by its ID.

        Args:
            task_id: Unique identifier of the task to remove

        Returns:
            True if task was deleted, False if it didn't exist
        """
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def exists(self, task_id: UUID) -> bool:
        """Check if a task exists.

        Args:
            task_id: Unique identifier to check

        Returns:
            True if task exists, False otherwise
        """
        return task_id in self._tasks

"""Task service - Business logic and use case orchestration."""

from typing import List, Optional
from uuid import UUID

from ..domain.task import Task
from ..domain.task_repository import TaskRepository
from .exceptions import InvalidTaskDataError, TaskNotFoundError


class TaskService:
    """Orchestrates task operations and enforces business rules.

    This service layer sits between the interface (CLI) and domain/infrastructure,
    coordinating task operations and handling exceptions.
    """

    def __init__(self, repository: TaskRepository) -> None:
        """Initialize service with a task repository.

        Args:
            repository: Implementation of TaskRepository interface
        """
        self._repository = repository

    def create_task(self, title: str, description: str = "") -> Task:
        """Create a new task with validation.

        Args:
            title: Task title (required, non-empty)
            description: Task description (optional)

        Returns:
            Newly created task with unique ID

        Raises:
            InvalidTaskDataError: If title is empty or exceeds length limits
        """
        try:
            task = Task.create(title=title, description=description)
            return self._repository.create(task)
        except ValueError as e:
            raise InvalidTaskDataError(str(e)) from e

    def get_task(self, task_id: str) -> Task:
        """Retrieve a task by ID.

        Args:
            task_id: String representation of task UUID

        Returns:
            The requested task

        Raises:
            TaskNotFoundError: If task does not exist
            InvalidTaskDataError: If task_id is not a valid UUID
        """
        try:
            uuid_id = UUID(task_id)
        except ValueError as e:
            raise InvalidTaskDataError(f"Invalid task ID format: {task_id}") from e

        task = self._repository.get_by_id(uuid_id)
        if task is None:
            raise TaskNotFoundError(task_id)

        return task

    def list_tasks(self) -> List[Task]:
        """Retrieve all tasks.

        Returns:
            List of all tasks (empty list if none exist)
        """
        return self._repository.get_all()

    def update_task(
        self,
        task_id: str,
        title: Optional[str] = None,
        description: Optional[str] = None
    ) -> Task:
        """Update a task's title and/or description.

        Args:
            task_id: String representation of task UUID
            title: New title (optional, if provided must be non-empty)
            description: New description (optional)

        Returns:
            The updated task

        Raises:
            TaskNotFoundError: If task does not exist
            InvalidTaskDataError: If validation fails
        """
        # Get existing task
        task = self.get_task(task_id)

        # Update fields if provided
        try:
            if title is not None:
                task.update_title(title)
            if description is not None:
                task.update_description(description)

            return self._repository.update(task)
        except ValueError as e:
            raise InvalidTaskDataError(str(e)) from e

    def complete_task(self, task_id: str) -> Task:
        """Toggle a task's completion status.

        Args:
            task_id: String representation of task UUID

        Returns:
            The updated task

        Raises:
            TaskNotFoundError: If task does not exist
            InvalidTaskDataError: If task_id is not a valid UUID
        """
        task = self.get_task(task_id)
        task.toggle_completion()
        return self._repository.update(task)

    def delete_task(self, task_id: str) -> None:
        """Delete a task by ID.

        Args:
            task_id: String representation of task UUID

        Raises:
            TaskNotFoundError: If task does not exist
            InvalidTaskDataError: If task_id is not a valid UUID
        """
        try:
            uuid_id = UUID(task_id)
        except ValueError as e:
            raise InvalidTaskDataError(f"Invalid task ID format: {task_id}") from e

        if not self._repository.exists(uuid_id):
            raise TaskNotFoundError(task_id)

        self._repository.delete(uuid_id)

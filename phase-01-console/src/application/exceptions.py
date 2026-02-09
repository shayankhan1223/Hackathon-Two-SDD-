"""Custom exceptions for the todo application."""


class TaskNotFoundError(Exception):
    """Raised when a requested task ID does not exist."""

    def __init__(self, task_id: str) -> None:
        """Initialize with task ID.

        Args:
            task_id: The ID that was not found
        """
        self.task_id = task_id
        super().__init__(f"Task with ID '{task_id}' not found")


class InvalidTaskDataError(Exception):
    """Raised when task data fails validation."""

    def __init__(self, message: str) -> None:
        """Initialize with validation error message.

        Args:
            message: Description of the validation failure
        """
        super().__init__(message)


class DuplicateTaskError(Exception):
    """Raised when attempting to create a task with an existing ID."""

    def __init__(self, task_id: str) -> None:
        """Initialize with duplicate task ID.

        Args:
            task_id: The ID that already exists
        """
        self.task_id = task_id
        super().__init__(f"Task with ID '{task_id}' already exists")

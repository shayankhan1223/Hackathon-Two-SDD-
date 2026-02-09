"""Task entity - Core domain model for todo items."""

from dataclasses import dataclass
from typing import Optional
from uuid import UUID, uuid4


# Validation constants
MAX_TITLE_LENGTH = 200
MAX_DESCRIPTION_LENGTH = 1000


@dataclass
class Task:
    """Represents a single todo task.

    Attributes:
        id: Unique identifier (UUID4)
        title: Short description (required, max 200 chars)
        description: Detailed information (optional, max 1000 chars)
        completed: Whether the task is done (default False)
    """

    id: UUID
    title: str
    description: str
    completed: bool = False

    def __post_init__(self) -> None:
        """Validate task data after initialization."""
        self._validate_title()
        self._validate_description()

    def _validate_title(self) -> None:
        """Ensure title is non-empty and within length limits."""
        if not self.title or not self.title.strip():
            raise ValueError("Task title cannot be empty")

        if len(self.title) > MAX_TITLE_LENGTH:
            raise ValueError(
                f"Task title cannot exceed {MAX_TITLE_LENGTH} characters"
            )

    def _validate_description(self) -> None:
        """Ensure description is within length limits."""
        if self.description and len(self.description) > MAX_DESCRIPTION_LENGTH:
            raise ValueError(
                f"Task description cannot exceed {MAX_DESCRIPTION_LENGTH} characters"
            )

    @staticmethod
    def create(title: str, description: str = "") -> "Task":
        """Factory method to create a new task with auto-generated ID.

        Args:
            title: Task title (required, non-empty)
            description: Task description (optional)

        Returns:
            New Task instance with unique UUID

        Raises:
            ValueError: If title is empty or exceeds length limits
        """
        return Task(
            id=uuid4(),
            title=title,
            description=description,
            completed=False
        )

    def toggle_completion(self) -> None:
        """Toggle the task's completion status."""
        self.completed = not self.completed

    def update_title(self, new_title: str) -> None:
        """Update the task title with validation.

        Args:
            new_title: New title for the task

        Raises:
            ValueError: If new title is empty or exceeds length limits
        """
        original_title = self.title
        self.title = new_title
        try:
            self._validate_title()
        except ValueError:
            self.title = original_title
            raise

    def update_description(self, new_description: str) -> None:
        """Update the task description with validation.

        Args:
            new_description: New description for the task

        Raises:
            ValueError: If new description exceeds length limits
        """
        original_description = self.description
        self.description = new_description
        try:
            self._validate_description()
        except ValueError:
            self.description = original_description
            raise

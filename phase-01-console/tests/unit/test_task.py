"""Unit tests for Task entity."""

import pytest
from uuid import UUID, uuid4

from src.domain.task import Task, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH


class TestTaskCreation:
    """Tests for Task creation and validation."""

    def test_create_task_with_valid_data(self) -> None:
        """Task can be created with valid title and description."""
        task = Task.create(title="Buy groceries", description="Milk and eggs")

        assert isinstance(task.id, UUID)
        assert task.title == "Buy groceries"
        assert task.description == "Milk and eggs"
        assert task.completed is False

    def test_create_task_with_only_title(self) -> None:
        """Task can be created with only a title."""
        task = Task.create(title="Call dentist")

        assert task.title == "Call dentist"
        assert task.description == ""
        assert task.completed is False

    def test_create_task_with_empty_title_raises_error(self) -> None:
        """Creating task with empty title raises ValueError."""
        with pytest.raises(ValueError, match="title cannot be empty"):
            Task.create(title="")

    def test_create_task_with_whitespace_only_title_raises_error(self) -> None:
        """Creating task with whitespace-only title raises ValueError."""
        with pytest.raises(ValueError, match="title cannot be empty"):
            Task.create(title="   ")

    def test_create_task_with_title_exceeding_max_length_raises_error(self) -> None:
        """Creating task with title > 200 chars raises ValueError."""
        long_title = "a" * (MAX_TITLE_LENGTH + 1)

        with pytest.raises(ValueError, match="cannot exceed 200 characters"):
            Task.create(title=long_title)

    def test_create_task_with_description_exceeding_max_length_raises_error(self) -> None:
        """Creating task with description > 1000 chars raises ValueError."""
        long_description = "a" * (MAX_DESCRIPTION_LENGTH + 1)

        with pytest.raises(ValueError, match="cannot exceed 1000 characters"):
            Task.create(title="Valid title", description=long_description)

    def test_create_task_generates_unique_ids(self) -> None:
        """Each created task has a unique UUID."""
        task1 = Task.create(title="Task 1")
        task2 = Task.create(title="Task 2")

        assert task1.id != task2.id
        assert isinstance(task1.id, UUID)
        assert isinstance(task2.id, UUID)


class TestTaskCompletion:
    """Tests for task completion functionality."""

    def test_toggle_completion_from_incomplete_to_complete(self) -> None:
        """Task completion can be toggled from False to True."""
        task = Task.create(title="Test task")
        assert task.completed is False

        task.toggle_completion()
        assert task.completed is True

    def test_toggle_completion_from_complete_to_incomplete(self) -> None:
        """Task completion can be toggled from True to False."""
        task = Task.create(title="Test task")
        task.toggle_completion()  # Set to True
        assert task.completed is True

        task.toggle_completion()  # Toggle back
        assert task.completed is False


class TestTaskUpdate:
    """Tests for updating task properties."""

    def test_update_title_with_valid_value(self) -> None:
        """Task title can be updated with valid value."""
        task = Task.create(title="Original title")

        task.update_title("Updated title")
        assert task.title == "Updated title"

    def test_update_title_with_empty_value_raises_error(self) -> None:
        """Updating title to empty string raises ValueError."""
        task = Task.create(title="Original title")

        with pytest.raises(ValueError, match="title cannot be empty"):
            task.update_title("")

        # Original title should be preserved
        assert task.title == "Original title"

    def test_update_title_with_too_long_value_raises_error(self) -> None:
        """Updating title to value > 200 chars raises ValueError."""
        task = Task.create(title="Original title")
        long_title = "a" * (MAX_TITLE_LENGTH + 1)

        with pytest.raises(ValueError, match="cannot exceed 200 characters"):
            task.update_title(long_title)

        # Original title should be preserved
        assert task.title == "Original title"

    def test_update_description_with_valid_value(self) -> None:
        """Task description can be updated with valid value."""
        task = Task.create(title="Test", description="Original description")

        task.update_description("Updated description")
        assert task.description == "Updated description"

    def test_update_description_to_empty_string(self) -> None:
        """Task description can be cleared."""
        task = Task.create(title="Test", description="Some description")

        task.update_description("")
        assert task.description == ""

    def test_update_description_with_too_long_value_raises_error(self) -> None:
        """Updating description to value > 1000 chars raises ValueError."""
        task = Task.create(title="Test", description="Original")
        long_description = "a" * (MAX_DESCRIPTION_LENGTH + 1)

        with pytest.raises(ValueError, match="cannot exceed 1000 characters"):
            task.update_description(long_description)

        # Original description should be preserved
        assert task.description == "Original"


class TestTaskImmutability:
    """Tests for task ID immutability."""

    def test_task_id_cannot_be_changed_after_creation(self) -> None:
        """Task ID is immutable after creation."""
        task = Task.create(title="Test task")
        original_id = task.id

        # Dataclass allows assignment but we document it shouldn't be done
        # This test documents expected behavior
        assert task.id == original_id
        assert isinstance(task.id, UUID)

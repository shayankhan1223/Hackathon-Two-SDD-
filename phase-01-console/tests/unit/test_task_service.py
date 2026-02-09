"""Unit tests for TaskService."""

import pytest
from uuid import UUID

from src.application.task_service import TaskService
from src.application.exceptions import InvalidTaskDataError, TaskNotFoundError
from src.domain.task import Task, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH


# Import fixtures
pytest_plugins = ['tests.fixtures.task_fixtures']


class TestCreateTask:
    """Tests for TaskService.create_task() - User Story 1."""

    def test_create_task_with_valid_data(self, task_service: TaskService) -> None:
        """Task can be created with valid title and description."""
        task = task_service.create_task(
            title="Buy groceries",
            description="Milk and eggs"
        )

        assert isinstance(task.id, UUID)
        assert task.title == "Buy groceries"
        assert task.description == "Milk and eggs"
        assert task.completed is False

    def test_create_task_with_only_title(self, task_service: TaskService) -> None:
        """Task can be created with only a title."""
        task = task_service.create_task(title="Call dentist")

        assert task.title == "Call dentist"
        assert task.description == ""
        assert task.completed is False

    def test_create_task_with_empty_title_raises_error(
        self,
        task_service: TaskService
    ) -> None:
        """Creating task with empty title raises InvalidTaskDataError."""
        with pytest.raises(InvalidTaskDataError, match="title cannot be empty"):
            task_service.create_task(title="")

    def test_create_task_with_whitespace_only_title_raises_error(
        self,
        task_service: TaskService
    ) -> None:
        """Creating task with whitespace-only title raises InvalidTaskDataError."""
        with pytest.raises(InvalidTaskDataError, match="title cannot be empty"):
            task_service.create_task(title="   ")

    def test_create_task_generates_unique_id(self, task_service: TaskService) -> None:
        """Each created task has a unique UUID."""
        task1 = task_service.create_task(title="Task 1")
        task2 = task_service.create_task(title="Task 2")

        assert task1.id != task2.id
        assert isinstance(task1.id, UUID)
        assert isinstance(task2.id, UUID)

    def test_create_task_with_title_exceeding_max_length(
        self,
        task_service: TaskService
    ) -> None:
        """Creating task with title > 200 chars raises InvalidTaskDataError."""
        long_title = "a" * (MAX_TITLE_LENGTH + 1)

        with pytest.raises(InvalidTaskDataError, match="cannot exceed 200 characters"):
            task_service.create_task(title=long_title)

    def test_create_task_with_description_exceeding_max_length(
        self,
        task_service: TaskService
    ) -> None:
        """Creating task with description > 1000 chars raises InvalidTaskDataError."""
        long_description = "a" * (MAX_DESCRIPTION_LENGTH + 1)

        with pytest.raises(
            InvalidTaskDataError,
            match="cannot exceed 1000 characters"
        ):
            task_service.create_task(
                title="Valid title",
                description=long_description
            )


class TestListTasks:
    """Tests for TaskService.list_tasks() - User Story 2."""

    def test_list_tasks_returns_all_tasks(
        self,
        populated_service: TaskService
    ) -> None:
        """list_tasks returns all created tasks."""
        tasks = populated_service.list_tasks()

        assert len(tasks) == 3
        assert all(isinstance(task, Task) for task in tasks)

    def test_list_tasks_returns_empty_list_when_no_tasks(
        self,
        task_service: TaskService
    ) -> None:
        """list_tasks returns empty list when no tasks exist."""
        tasks = task_service.list_tasks()

        assert tasks == []
        assert isinstance(tasks, list)

    def test_list_tasks_shows_completed_status(
        self,
        task_service: TaskService
    ) -> None:
        """list_tasks returns tasks with correct completion status."""
        task1 = task_service.create_task(title="Incomplete task")
        task2 = task_service.create_task(title="Complete task")
        task_service.complete_task(str(task2.id))

        tasks = task_service.list_tasks()

        incomplete = next(t for t in tasks if t.id == task1.id)
        complete = next(t for t in tasks if t.id == task2.id)

        assert incomplete.completed is False
        assert complete.completed is True


class TestGetTask:
    """Tests for TaskService.get_task()."""

    def test_get_task_returns_existing_task(
        self,
        task_service: TaskService
    ) -> None:
        """Existing task can be retrieved by ID."""
        created_task = task_service.create_task(title="Test task")

        retrieved_task = task_service.get_task(str(created_task.id))

        assert retrieved_task.id == created_task.id
        assert retrieved_task.title == "Test task"

    def test_get_task_with_invalid_id_raises_error(
        self,
        task_service: TaskService
    ) -> None:
        """Getting task with invalid UUID format raises InvalidTaskDataError."""
        with pytest.raises(InvalidTaskDataError, match="Invalid task ID format"):
            task_service.get_task("not-a-uuid")

    def test_get_task_with_nonexistent_id_raises_error(
        self,
        task_service: TaskService
    ) -> None:
        """Getting nonexistent task raises TaskNotFoundError."""
        fake_uuid = "550e8400-e29b-41d4-a716-446655440000"

        with pytest.raises(TaskNotFoundError, match="not found"):
            task_service.get_task(fake_uuid)


class TestCompleteTask:
    """Tests for TaskService.complete_task() - User Story 3."""

    def test_complete_task_toggles_status(self, task_service: TaskService) -> None:
        """Task completion status can be toggled."""
        task = task_service.create_task(title="Test task")
        assert task.completed is False

        completed = task_service.complete_task(str(task.id))
        assert completed.completed is True

    def test_complete_task_with_invalid_id_raises_error(
        self,
        task_service: TaskService
    ) -> None:
        """Completing task with invalid UUID raises InvalidTaskDataError."""
        with pytest.raises(InvalidTaskDataError, match="Invalid task ID format"):
            task_service.complete_task("not-a-uuid")

    def test_complete_already_completed_task_toggles_back(
        self,
        task_service: TaskService
    ) -> None:
        """Completing already completed task toggles it back to incomplete."""
        task = task_service.create_task(title="Test task")

        # Complete it
        task_service.complete_task(str(task.id))
        # Complete again (toggle back)
        toggled = task_service.complete_task(str(task.id))

        assert toggled.completed is False


class TestUpdateTask:
    """Tests for TaskService.update_task() - User Story 4."""

    def test_update_task_title(self, task_service: TaskService) -> None:
        """Task title can be updated."""
        task = task_service.create_task(title="Original title")

        updated = task_service.update_task(
            task_id=str(task.id),
            title="Updated title"
        )

        assert updated.title == "Updated title"
        # Original description should remain
        assert updated.description == ""

    def test_update_task_description(self, task_service: TaskService) -> None:
        """Task description can be updated."""
        task = task_service.create_task(
            title="Test",
            description="Original description"
        )

        updated = task_service.update_task(
            task_id=str(task.id),
            description="Updated description"
        )

        assert updated.description == "Updated description"
        # Original title should remain
        assert updated.title == "Test"

    def test_update_task_title_and_description(
        self,
        task_service: TaskService
    ) -> None:
        """Both title and description can be updated simultaneously."""
        task = task_service.create_task(
            title="Original title",
            description="Original description"
        )

        updated = task_service.update_task(
            task_id=str(task.id),
            title="Updated title",
            description="Updated description"
        )

        assert updated.title == "Updated title"
        assert updated.description == "Updated description"

    def test_update_task_with_invalid_id_raises_error(
        self,
        task_service: TaskService
    ) -> None:
        """Updating task with invalid ID raises InvalidTaskDataError."""
        with pytest.raises(InvalidTaskDataError, match="Invalid task ID format"):
            task_service.update_task(task_id="not-a-uuid", title="New title")

    def test_update_task_with_nonexistent_id_raises_error(
        self,
        task_service: TaskService
    ) -> None:
        """Updating nonexistent task raises TaskNotFoundError."""
        fake_uuid = "550e8400-e29b-41d4-a716-446655440000"

        with pytest.raises(TaskNotFoundError, match="not found"):
            task_service.update_task(task_id=fake_uuid, title="New title")

    def test_update_task_with_empty_title_raises_error(
        self,
        task_service: TaskService
    ) -> None:
        """Updating task with empty title raises InvalidTaskDataError."""
        task = task_service.create_task(title="Original title")

        with pytest.raises(InvalidTaskDataError, match="title cannot be empty"):
            task_service.update_task(task_id=str(task.id), title="")

    def test_update_task_with_too_long_title_raises_error(
        self,
        task_service: TaskService
    ) -> None:
        """Updating task with title > 200 chars raises InvalidTaskDataError."""
        task = task_service.create_task(title="Original title")
        long_title = "a" * (MAX_TITLE_LENGTH + 1)

        with pytest.raises(InvalidTaskDataError, match="cannot exceed 200 characters"):
            task_service.update_task(task_id=str(task.id), title=long_title)


class TestDeleteTask:
    """Tests for TaskService.delete_task() - User Story 5."""

    def test_delete_task(self, task_service: TaskService) -> None:
        """Task can be deleted successfully."""
        task = task_service.create_task(title="Test task")

        task_service.delete_task(str(task.id))

        with pytest.raises(TaskNotFoundError):
            task_service.get_task(str(task.id))

    def test_delete_task_with_invalid_id_raises_error(
        self,
        task_service: TaskService
    ) -> None:
        """Deleting task with invalid ID raises InvalidTaskDataError."""
        with pytest.raises(InvalidTaskDataError, match="Invalid task ID format"):
            task_service.delete_task("not-a-uuid")

    def test_delete_task_with_nonexistent_id_raises_error(
        self,
        task_service: TaskService
    ) -> None:
        """Deleting nonexistent task raises TaskNotFoundError."""
        fake_uuid = "550e8400-e29b-41d4-a716-446655440000"

        with pytest.raises(TaskNotFoundError, match="not found"):
            task_service.delete_task(fake_uuid)

    def test_delete_task_removes_from_list(self, task_service: TaskService) -> None:
        """Deleted task no longer appears in task list."""
        task1 = task_service.create_task(title="Task 1")
        task2 = task_service.create_task(title="Task 2")

        task_service.delete_task(str(task1.id))

        remaining_tasks = task_service.list_tasks()
        assert len(remaining_tasks) == 1
        assert remaining_tasks[0].id == task2.id

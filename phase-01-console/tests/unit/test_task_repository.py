"""Unit tests for InMemoryTaskRepository."""

import pytest
from uuid import uuid4

from src.domain.task import Task
from src.infrastructure.in_memory_task_repository import InMemoryTaskRepository


class TestRepositoryCreate:
    """Tests for creating tasks in repository."""

    def test_create_task_stores_successfully(self) -> None:
        """Task can be created and stored in repository."""
        repo = InMemoryTaskRepository()
        task = Task.create(title="Test task")

        result = repo.create(task)

        assert result == task
        assert repo.exists(task.id)

    def test_create_task_with_duplicate_id_raises_error(self) -> None:
        """Creating task with existing ID raises ValueError."""
        repo = InMemoryTaskRepository()
        task = Task.create(title="Test task")
        repo.create(task)

        with pytest.raises(ValueError, match="already exists"):
            repo.create(task)


class TestRepositoryGetById:
    """Tests for retrieving tasks by ID."""

    def test_get_by_id_returns_existing_task(self) -> None:
        """Existing task can be retrieved by ID."""
        repo = InMemoryTaskRepository()
        task = Task.create(title="Test task")
        repo.create(task)

        result = repo.get_by_id(task.id)

        assert result == task
        assert result.id == task.id
        assert result.title == "Test task"

    def test_get_by_id_returns_none_for_nonexistent_task(self) -> None:
        """Getting nonexistent task returns None."""
        repo = InMemoryTaskRepository()
        nonexistent_id = uuid4()

        result = repo.get_by_id(nonexistent_id)

        assert result is None


class TestRepositoryGetAll:
    """Tests for retrieving all tasks."""

    def test_get_all_returns_empty_list_when_no_tasks(self) -> None:
        """Empty repository returns empty list."""
        repo = InMemoryTaskRepository()

        result = repo.get_all()

        assert result == []
        assert isinstance(result, list)

    def test_get_all_returns_all_stored_tasks(self) -> None:
        """All created tasks are returned by get_all."""
        repo = InMemoryTaskRepository()
        task1 = Task.create(title="Task 1")
        task2 = Task.create(title="Task 2")
        task3 = Task.create(title="Task 3")

        repo.create(task1)
        repo.create(task2)
        repo.create(task3)

        result = repo.get_all()

        assert len(result) == 3
        assert task1 in result
        assert task2 in result
        assert task3 in result


class TestRepositoryUpdate:
    """Tests for updating tasks."""

    def test_update_existing_task_succeeds(self) -> None:
        """Existing task can be updated."""
        repo = InMemoryTaskRepository()
        task = Task.create(title="Original title")
        repo.create(task)

        task.update_title("Updated title")
        result = repo.update(task)

        assert result.title == "Updated title"
        # Verify it's persisted
        retrieved = repo.get_by_id(task.id)
        assert retrieved.title == "Updated title"

    def test_update_nonexistent_task_raises_error(self) -> None:
        """Updating nonexistent task raises ValueError."""
        repo = InMemoryTaskRepository()
        task = Task.create(title="Test task")

        with pytest.raises(ValueError, match="not found"):
            repo.update(task)

    def test_update_task_completion_status(self) -> None:
        """Task completion status can be updated."""
        repo = InMemoryTaskRepository()
        task = Task.create(title="Test task")
        repo.create(task)

        task.toggle_completion()
        repo.update(task)

        retrieved = repo.get_by_id(task.id)
        assert retrieved.completed is True


class TestRepositoryDelete:
    """Tests for deleting tasks."""

    def test_delete_existing_task_returns_true(self) -> None:
        """Deleting existing task returns True."""
        repo = InMemoryTaskRepository()
        task = Task.create(title="Test task")
        repo.create(task)

        result = repo.delete(task.id)

        assert result is True
        assert not repo.exists(task.id)

    def test_delete_nonexistent_task_returns_false(self) -> None:
        """Deleting nonexistent task returns False."""
        repo = InMemoryTaskRepository()
        nonexistent_id = uuid4()

        result = repo.delete(nonexistent_id)

        assert result is False

    def test_delete_removes_task_from_get_all(self) -> None:
        """Deleted task no longer appears in get_all."""
        repo = InMemoryTaskRepository()
        task1 = Task.create(title="Task 1")
        task2 = Task.create(title="Task 2")
        repo.create(task1)
        repo.create(task2)

        repo.delete(task1.id)

        all_tasks = repo.get_all()
        assert len(all_tasks) == 1
        assert task2 in all_tasks
        assert task1 not in all_tasks


class TestRepositoryExists:
    """Tests for checking task existence."""

    def test_exists_returns_true_for_existing_task(self) -> None:
        """exists() returns True for stored task."""
        repo = InMemoryTaskRepository()
        task = Task.create(title="Test task")
        repo.create(task)

        assert repo.exists(task.id) is True

    def test_exists_returns_false_for_nonexistent_task(self) -> None:
        """exists() returns False for nonexistent task."""
        repo = InMemoryTaskRepository()
        nonexistent_id = uuid4()

        assert repo.exists(nonexistent_id) is False

    def test_exists_returns_false_after_deletion(self) -> None:
        """exists() returns False after task is deleted."""
        repo = InMemoryTaskRepository()
        task = Task.create(title="Test task")
        repo.create(task)

        repo.delete(task.id)

        assert repo.exists(task.id) is False

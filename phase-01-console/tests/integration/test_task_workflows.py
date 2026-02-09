"""Integration tests for end-to-end task workflows."""

import pytest

from src.infrastructure.in_memory_task_repository import InMemoryTaskRepository
from src.application.task_service import TaskService
from src.application.exceptions import TaskNotFoundError, InvalidTaskDataError


class TestCompleteTaskWorkflow:
    """Test complete workflow for adding and managing tasks."""

    def test_create_view_complete_delete_workflow(self) -> None:
        """Test full CRUD workflow for a task."""
        # Setup
        repository = InMemoryTaskRepository()
        service = TaskService(repository=repository)

        # Create a task
        task = service.create_task(
            title="Complete project",
            description="Finish the console app"
        )
        assert task.completed is False

        # Verify it appears in list
        all_tasks = service.list_tasks()
        assert len(all_tasks) == 1
        assert all_tasks[0].id == task.id

        # Complete the task
        completed_task = service.complete_task(str(task.id))
        assert completed_task.completed is True

        # Update the task
        updated_task = service.update_task(
            task_id=str(task.id),
            title="Complete project (updated)",
            description="Finish the console app with tests"
        )
        assert updated_task.title == "Complete project (updated)"
        assert updated_task.description == "Finish the console app with tests"
        assert updated_task.completed is True  # Status should be preserved

        # Delete the task
        service.delete_task(str(task.id))

        # Verify it's gone
        all_tasks = service.list_tasks()
        assert len(all_tasks) == 0

        # Verify getting it raises error
        with pytest.raises(TaskNotFoundError):
            service.get_task(str(task.id))


class TestMultipleTasksWorkflow:
    """Test workflows with multiple tasks."""

    def test_create_multiple_tasks_and_manage(self) -> None:
        """Test creating and managing multiple tasks."""
        repository = InMemoryTaskRepository()
        service = TaskService(repository=repository)

        # Create multiple tasks
        task1 = service.create_task(title="Task 1", description="First task")
        task2 = service.create_task(title="Task 2", description="Second task")
        task3 = service.create_task(title="Task 3", description="Third task")

        # Verify all are in list
        all_tasks = service.list_tasks()
        assert len(all_tasks) == 3

        # Complete one task
        service.complete_task(str(task2.id))

        # Verify completion status
        all_tasks = service.list_tasks()
        task2_updated = next(t for t in all_tasks if t.id == task2.id)
        assert task2_updated.completed is True

        # Other tasks should remain incomplete
        task1_current = next(t for t in all_tasks if t.id == task1.id)
        task3_current = next(t for t in all_tasks if t.id == task3.id)
        assert task1_current.completed is False
        assert task3_current.completed is False

        # Delete middle task
        service.delete_task(str(task2.id))

        # Verify only 2 tasks remain
        all_tasks = service.list_tasks()
        assert len(all_tasks) == 2
        assert task1.id in [t.id for t in all_tasks]
        assert task3.id in [t.id for t in all_tasks]
        assert task2.id not in [t.id for t in all_tasks]


class TestErrorHandlingWorkflows:
    """Test error handling in workflows."""

    def test_invalid_operations_raise_appropriate_errors(self) -> None:
        """Test that invalid operations raise correct exceptions."""
        repository = InMemoryTaskRepository()
        service = TaskService(repository=repository)

        # Try to create task with invalid data
        with pytest.raises(InvalidTaskDataError):
            service.create_task(title="")

        # Create a valid task
        task = service.create_task(title="Valid task")

        # Try to get nonexistent task
        with pytest.raises(TaskNotFoundError):
            service.get_task("550e8400-e29b-41d4-a716-446655440000")

        # Try to update with invalid ID format
        with pytest.raises(InvalidTaskDataError):
            service.update_task(task_id="not-a-uuid", title="New title")

        # Try to update with invalid data
        with pytest.raises(InvalidTaskDataError):
            service.update_task(task_id=str(task.id), title="")

        # Try to complete nonexistent task
        with pytest.raises(TaskNotFoundError):
            service.complete_task("550e8400-e29b-41d4-a716-446655440000")

        # Try to delete nonexistent task
        with pytest.raises(TaskNotFoundError):
            service.delete_task("550e8400-e29b-41d4-a716-446655440000")


class TestTaskPersistenceInSession:
    """Test that tasks persist correctly within a session."""

    def test_task_modifications_persist_across_operations(self) -> None:
        """Test that task changes are reflected in subsequent operations."""
        repository = InMemoryTaskRepository()
        service = TaskService(repository=repository)

        # Create task
        task = service.create_task(
            title="Original title",
            description="Original description"
        )
        original_id = task.id

        # Update title
        service.update_task(task_id=str(task.id), title="Updated title")

        # Retrieve and verify
        retrieved = service.get_task(str(original_id))
        assert retrieved.title == "Updated title"
        assert retrieved.description == "Original description"

        # Update description
        service.update_task(
            task_id=str(task.id),
            description="Updated description"
        )

        # Retrieve and verify both changes persist
        retrieved = service.get_task(str(original_id))
        assert retrieved.title == "Updated title"
        assert retrieved.description == "Updated description"

        # Complete task
        service.complete_task(str(task.id))

        # Verify completion persists
        retrieved = service.get_task(str(original_id))
        assert retrieved.completed is True
        assert retrieved.title == "Updated title"
        assert retrieved.description == "Updated description"


class TestEmptyStateHandling:
    """Test handling of empty/initial state."""

    def test_operations_on_empty_repository(self) -> None:
        """Test that operations handle empty state gracefully."""
        repository = InMemoryTaskRepository()
        service = TaskService(repository=repository)

        # List should return empty list
        tasks = service.list_tasks()
        assert tasks == []
        assert isinstance(tasks, list)

        # Get nonexistent task should raise error
        with pytest.raises(TaskNotFoundError):
            service.get_task("550e8400-e29b-41d4-a716-446655440000")

        # Delete nonexistent task should raise error
        with pytest.raises(TaskNotFoundError):
            service.delete_task("550e8400-e29b-41d4-a716-446655440000")


class TestTaskToggling:
    """Test task completion toggling behavior."""

    def test_task_can_be_toggled_multiple_times(self) -> None:
        """Test that task completion can be toggled repeatedly."""
        repository = InMemoryTaskRepository()
        service = TaskService(repository=repository)

        task = service.create_task(title="Toggle test")
        task_id = str(task.id)

        # Initial state: incomplete
        assert task.completed is False

        # Toggle to complete
        service.complete_task(task_id)
        task = service.get_task(task_id)
        assert task.completed is True

        # Toggle back to incomplete
        service.complete_task(task_id)
        task = service.get_task(task_id)
        assert task.completed is False

        # Toggle to complete again
        service.complete_task(task_id)
        task = service.get_task(task_id)
        assert task.completed is True


class TestUpdatePartialFields:
    """Test updating individual fields without affecting others."""

    def test_update_only_title_preserves_description(self) -> None:
        """Test that updating only title doesn't affect description."""
        repository = InMemoryTaskRepository()
        service = TaskService(repository=repository)

        task = service.create_task(
            title="Original title",
            description="Original description"
        )

        service.update_task(task_id=str(task.id), title="New title")

        updated = service.get_task(str(task.id))
        assert updated.title == "New title"
        assert updated.description == "Original description"

    def test_update_only_description_preserves_title(self) -> None:
        """Test that updating only description doesn't affect title."""
        repository = InMemoryTaskRepository()
        service = TaskService(repository=repository)

        task = service.create_task(
            title="Original title",
            description="Original description"
        )

        service.update_task(
            task_id=str(task.id),
            description="New description"
        )

        updated = service.get_task(str(task.id))
        assert updated.title == "Original title"
        assert updated.description == "New description"

    def test_completion_status_unaffected_by_updates(self) -> None:
        """Test that updating fields doesn't change completion status."""
        repository = InMemoryTaskRepository()
        service = TaskService(repository=repository)

        task = service.create_task(title="Test task")
        service.complete_task(str(task.id))

        # Update title while task is completed
        service.update_task(task_id=str(task.id), title="Updated title")

        updated = service.get_task(str(task.id))
        assert updated.completed is True
        assert updated.title == "Updated title"

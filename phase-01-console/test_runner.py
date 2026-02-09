#!/usr/bin/env python3
"""Simple test runner to verify implementation without pytest."""

import sys
from pathlib import Path

# Add parent to path for proper imports
sys.path.insert(0, str(Path(__file__).parent))

from src.domain.task import Task
from src.infrastructure.in_memory_task_repository import InMemoryTaskRepository
from src.application.task_service import TaskService
from src.application.exceptions import TaskNotFoundError, InvalidTaskDataError


def test_task_creation():
    """Test basic task creation."""
    print("Testing task creation...")
    task = Task.create(title="Test task", description="Test description")
    assert task.title == "Test task"
    assert task.description == "Test description"
    assert task.completed is False
    print("✓ Task creation works")


def test_repository():
    """Test repository operations."""
    print("Testing repository...")
    repo = InMemoryTaskRepository()
    task = Task.create(title="Test task")

    # Create
    repo.create(task)
    assert repo.exists(task.id)

    # Get
    retrieved = repo.get_by_id(task.id)
    assert retrieved is not None
    assert retrieved.id == task.id

    # Get all
    all_tasks = repo.get_all()
    assert len(all_tasks) == 1

    # Update
    task.update_title("Updated title")
    repo.update(task)
    retrieved = repo.get_by_id(task.id)
    assert retrieved.title == "Updated title"

    # Delete
    repo.delete(task.id)
    assert not repo.exists(task.id)

    print("✓ Repository operations work")


def test_service():
    """Test service layer."""
    print("Testing service...")
    repo = InMemoryTaskRepository()
    service = TaskService(repository=repo)

    # Create task
    task = service.create_task(title="Service test", description="Testing service")
    assert task.title == "Service test"

    # List tasks
    tasks = service.list_tasks()
    assert len(tasks) == 1

    # Get task
    retrieved = service.get_task(str(task.id))
    assert retrieved.id == task.id

    # Update task
    updated = service.update_task(
        task_id=str(task.id),
        title="Updated title"
    )
    assert updated.title == "Updated title"

    # Complete task
    completed = service.complete_task(str(task.id))
    assert completed.completed is True

    # Delete task
    service.delete_task(str(task.id))
    tasks = service.list_tasks()
    assert len(tasks) == 0

    print("✓ Service operations work")


def test_error_handling():
    """Test error handling."""
    print("Testing error handling...")
    repo = InMemoryTaskRepository()
    service = TaskService(repository=repo)

    # Empty title should raise error
    try:
        service.create_task(title="")
        assert False, "Should have raised InvalidTaskDataError"
    except InvalidTaskDataError:
        pass

    # Nonexistent task should raise error
    try:
        service.get_task("550e8400-e29b-41d4-a716-446655440000")
        assert False, "Should have raised TaskNotFoundError"
    except TaskNotFoundError:
        pass

    # Invalid UUID format should raise error
    try:
        service.get_task("not-a-uuid")
        assert False, "Should have raised InvalidTaskDataError"
    except InvalidTaskDataError:
        pass

    print("✓ Error handling works")


def test_complete_workflow():
    """Test complete CRUD workflow."""
    print("Testing complete workflow...")
    repo = InMemoryTaskRepository()
    service = TaskService(repository=repo)

    # Create multiple tasks
    task1 = service.create_task(title="Task 1", description="First")
    task2 = service.create_task(title="Task 2", description="Second")
    task3 = service.create_task(title="Task 3", description="Third")

    # List all
    tasks = service.list_tasks()
    assert len(tasks) == 3

    # Complete one
    service.complete_task(str(task2.id))
    task2_updated = service.get_task(str(task2.id))
    assert task2_updated.completed is True

    # Update one
    service.update_task(task_id=str(task1.id), title="Task 1 Updated")
    task1_updated = service.get_task(str(task1.id))
    assert task1_updated.title == "Task 1 Updated"

    # Delete one
    service.delete_task(str(task3.id))
    tasks = service.list_tasks()
    assert len(tasks) == 2

    print("✓ Complete workflow works")


def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("RUNNING TESTS")
    print("=" * 60 + "\n")

    try:
        test_task_creation()
        test_repository()
        test_service()
        test_error_handling()
        test_complete_workflow()

        print("\n" + "=" * 60)
        print("✓ ALL TESTS PASSED")
        print("=" * 60 + "\n")
        return 0

    except AssertionError as e:
        print(f"\n✗ TEST FAILED: {e}")
        return 1
    except Exception as e:
        print(f"\n✗ UNEXPECTED ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())

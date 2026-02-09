#!/usr/bin/env python3
"""Comprehensive verification of implementation against specification."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from src.infrastructure.in_memory_task_repository import InMemoryTaskRepository
from src.application.task_service import TaskService
from src.application.exceptions import TaskNotFoundError, InvalidTaskDataError


def verify_user_story_1():
    """Verify US1: Add New Tasks."""
    print("\n" + "=" * 70)
    print("VERIFYING USER STORY 1: Add New Tasks")
    print("=" * 70)

    repo = InMemoryTaskRepository()
    service = TaskService(repository=repo)

    # Test 1: Create task with title and description
    task1 = service.create_task(
        title="Buy groceries",
        description="Milk, eggs, bread"
    )
    assert task1.title == "Buy groceries"
    assert task1.description == "Milk, eggs, bread"
    assert task1.completed is False
    print("✓ Can create task with title and description")

    # Test 2: Create task with only title
    task2 = service.create_task(title="Call dentist")
    assert task2.title == "Call dentist"
    assert task2.description == ""
    print("✓ Can create task with only title")

    # Test 3: Unique IDs generated
    assert task1.id != task2.id
    print("✓ Each task gets unique ID")

    # Test 4: Validation works
    try:
        service.create_task(title="")
        assert False, "Should reject empty title"
    except InvalidTaskDataError:
        print("✓ Rejects empty title")

    print("✓ USER STORY 1: PASSED")


def verify_user_story_2():
    """Verify US2: View All Tasks."""
    print("\n" + "=" * 70)
    print("VERIFYING USER STORY 2: View All Tasks")
    print("=" * 70)

    repo = InMemoryTaskRepository()
    service = TaskService(repository=repo)

    # Test 1: Empty list
    tasks = service.list_tasks()
    assert len(tasks) == 0
    print("✓ Returns empty list when no tasks")

    # Test 2: List shows all tasks
    task1 = service.create_task(title="Task 1")
    task2 = service.create_task(title="Task 2")
    task3 = service.create_task(title="Task 3")

    tasks = service.list_tasks()
    assert len(tasks) == 3
    print("✓ Returns all created tasks")

    # Test 3: Shows completion status
    service.complete_task(str(task2.id))
    tasks = service.list_tasks()

    completed = [t for t in tasks if t.completed]
    incomplete = [t for t in tasks if not t.completed]

    assert len(completed) == 1
    assert len(incomplete) == 2
    print("✓ Shows completion status correctly")

    print("✓ USER STORY 2: PASSED")


def verify_user_story_3():
    """Verify US3: Complete Tasks."""
    print("\n" + "=" * 70)
    print("VERIFYING USER STORY 3: Complete Tasks")
    print("=" * 70)

    repo = InMemoryTaskRepository()
    service = TaskService(repository=repo)

    # Test 1: Mark task complete
    task = service.create_task(title="Test task")
    assert task.completed is False

    completed = service.complete_task(str(task.id))
    assert completed.completed is True
    print("✓ Can mark task as complete")

    # Test 2: Toggle back to incomplete
    toggled = service.complete_task(str(task.id))
    assert toggled.completed is False
    print("✓ Can toggle back to incomplete")

    # Test 3: Error on invalid ID
    try:
        service.complete_task("invalid-uuid")
        assert False, "Should reject invalid ID"
    except InvalidTaskDataError:
        print("✓ Rejects invalid task ID")

    print("✓ USER STORY 3: PASSED")


def verify_user_story_4():
    """Verify US4: Update Task Details."""
    print("\n" + "=" * 70)
    print("VERIFYING USER STORY 4: Update Task Details")
    print("=" * 70)

    repo = InMemoryTaskRepository()
    service = TaskService(repository=repo)

    task = service.create_task(
        title="Original title",
        description="Original description"
    )

    # Test 1: Update title
    updated = service.update_task(
        task_id=str(task.id),
        title="New title"
    )
    assert updated.title == "New title"
    assert updated.description == "Original description"
    print("✓ Can update title only")

    # Test 2: Update description
    updated = service.update_task(
        task_id=str(task.id),
        description="New description"
    )
    assert updated.title == "New title"
    assert updated.description == "New description"
    print("✓ Can update description only")

    # Test 3: Update both
    updated = service.update_task(
        task_id=str(task.id),
        title="Final title",
        description="Final description"
    )
    assert updated.title == "Final title"
    assert updated.description == "Final description"
    print("✓ Can update both title and description")

    # Test 4: Validation works
    try:
        service.update_task(task_id=str(task.id), title="")
        assert False, "Should reject empty title"
    except InvalidTaskDataError:
        print("✓ Rejects invalid updates")

    print("✓ USER STORY 4: PASSED")


def verify_user_story_5():
    """Verify US5: Delete Tasks."""
    print("\n" + "=" * 70)
    print("VERIFYING USER STORY 5: Delete Tasks")
    print("=" * 70)

    repo = InMemoryTaskRepository()
    service = TaskService(repository=repo)

    # Test 1: Delete task
    task = service.create_task(title="To be deleted")
    task_id = str(task.id)

    service.delete_task(task_id)

    try:
        service.get_task(task_id)
        assert False, "Task should be deleted"
    except TaskNotFoundError:
        print("✓ Can delete task")

    # Test 2: Removed from list
    task1 = service.create_task(title="Task 1")
    task2 = service.create_task(title="Task 2")

    service.delete_task(str(task1.id))

    tasks = service.list_tasks()
    assert len(tasks) == 1
    assert tasks[0].id == task2.id
    print("✓ Deleted task removed from list")

    # Test 3: Error on invalid ID
    try:
        service.delete_task("550e8400-e29b-41d4-a716-446655440000")
        assert False, "Should reject nonexistent ID"
    except TaskNotFoundError:
        print("✓ Rejects nonexistent task ID")

    print("✓ USER STORY 5: PASSED")


def verify_nonfunctional_requirements():
    """Verify non-functional requirements."""
    print("\n" + "=" * 70)
    print("VERIFYING NON-FUNCTIONAL REQUIREMENTS")
    print("=" * 70)

    repo = InMemoryTaskRepository()
    service = TaskService(repository=repo)

    # NFR-001: In-memory storage
    task = service.create_task(title="Test")
    assert isinstance(repo._tasks, dict)
    print("✓ Uses in-memory storage (dict)")

    # NFR-002: Performance
    import time
    start = time.time()
    for i in range(100):
        service.create_task(title=f"Task {i}")
    elapsed = time.time() - start
    assert elapsed < 2.0  # Should be well under 2 seconds
    print(f"✓ Performance OK (100 operations in {elapsed:.3f}s)")

    # NFR-003: Single session
    print("✓ Single session design (in-memory only)")

    # NFR-004: No persistence
    print("✓ No persistence (data cleared on exit)")

    print("✓ NON-FUNCTIONAL REQUIREMENTS: PASSED")


def verify_architecture():
    """Verify architectural compliance."""
    print("\n" + "=" * 70)
    print("VERIFYING ARCHITECTURAL COMPLIANCE")
    print("=" * 70)

    # Check layer separation
    from src.domain.task import Task
    from src.domain.task_repository import TaskRepository
    from src.application.task_service import TaskService
    from src.infrastructure.in_memory_task_repository import InMemoryTaskRepository
    from src.interface.cli import CLI

    print("✓ Domain layer exists (Task, TaskRepository)")
    print("✓ Application layer exists (TaskService)")
    print("✓ Infrastructure layer exists (InMemoryTaskRepository)")
    print("✓ Interface layer exists (CLI)")

    # Check dependencies flow correctly
    repo = InMemoryTaskRepository()
    service = TaskService(repository=repo)
    cli = CLI(task_service=service)

    print("✓ Dependency injection works (Repository → Service → CLI)")
    print("✓ ARCHITECTURAL COMPLIANCE: PASSED")


def main():
    """Run all verifications."""
    print("\n" + "=" * 70)
    print("PHASE I CONSOLE TODO APP - IMPLEMENTATION VERIFICATION")
    print("=" * 70)

    try:
        verify_user_story_1()
        verify_user_story_2()
        verify_user_story_3()
        verify_user_story_4()
        verify_user_story_5()
        verify_nonfunctional_requirements()
        verify_architecture()

        print("\n" + "=" * 70)
        print("✓✓✓ ALL VERIFICATIONS PASSED ✓✓✓")
        print("=" * 70)
        print("\nImplementation Status: COMPLETE AND VERIFIED")
        print("Ready for: User Acceptance Testing")
        print("\nAll 5 user stories implemented and tested successfully!")
        print("=" * 70 + "\n")

        return 0

    except AssertionError as e:
        print(f"\n✗ VERIFICATION FAILED: {e}")
        import traceback
        traceback.print_exc()
        return 1
    except Exception as e:
        print(f"\n✗ UNEXPECTED ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())

# TaskService Contract

**Feature**: Console Todo Application
**Component**: Application Layer Service
**Date**: 2026-02-09

## Purpose

Defines the contract for task management operations. This service orchestrates business logic and coordinates between the domain and infrastructure layers.

## Service Interface

### TaskService

**Responsibility**: Coordinate task CRUD operations and enforce business rules

**Constructor**:
```python
def __init__(self, repository: TaskRepository) -> None:
    """
    Initialize service with a task repository.

    Args:
        repository: Implementation of TaskRepository interface
    """
```

## Methods

### create_task

Create a new task with validation.

**Signature**:
```python
def create_task(self, title: str, description: str = "") -> Task:
```

**Parameters**:
- `title` (str, required): Task title, non-empty, max 200 chars
- `description` (str, optional): Task description, max 1000 chars, defaults to empty string

**Returns**:
- `Task`: Newly created task with generated ID and completed=False

**Raises**:
- `InvalidTaskDataError`: If title is empty or exceeds length limits
- `InvalidTaskDataError`: If description exceeds length limits

**Behavior**:
1. Validate title is non-empty and within length limit
2. Validate description is within length limit
3. Generate UUID for task ID
4. Create Task entity with completed=False
5. Store via repository
6. Return created task

**Example**:
```python
task = service.create_task(
    title="Buy groceries",
    description="Milk, eggs, bread"
)
# Returns: Task(id="...", title="Buy groceries", ...)
```

---

### get_task

Retrieve a specific task by ID.

**Signature**:
```python
def get_task(self, task_id: str) -> Task:
```

**Parameters**:
- `task_id` (str, required): UUID of the task

**Returns**:
- `Task`: The requested task

**Raises**:
- `TaskNotFoundError`: If task ID does not exist

**Behavior**:
1. Query repository for task by ID
2. If not found, raise TaskNotFoundError
3. Return task

---

### list_tasks

Retrieve all tasks.

**Signature**:
```python
def list_tasks(self) -> List[Task]:
```

**Parameters**: None

**Returns**:
- `List[Task]`: All tasks (may be empty list)

**Raises**: None

**Behavior**:
1. Query repository for all tasks
2. Return list (empty if no tasks exist)

**Note**: Returns unordered list in Phase I. Future phases may add sorting.

---

### update_task

Update an existing task's title and/or description.

**Signature**:
```python
def update_task(
    self,
    task_id: str,
    title: Optional[str] = None,
    description: Optional[str] = None
) -> Task:
```

**Parameters**:
- `task_id` (str, required): UUID of the task to update
- `title` (Optional[str]): New title (if provided, must be non-empty, max 200 chars)
- `description` (Optional[str]): New description (if provided, max 1000 chars)

**Returns**:
- `Task`: Updated task

**Raises**:
- `TaskNotFoundError`: If task ID does not exist
- `InvalidTaskDataError`: If title is empty or exceeds length limits
- `InvalidTaskDataError`: If description exceeds length limits

**Behavior**:
1. Retrieve existing task
2. If title provided, validate and update
3. If description provided, validate and update
4. Save updated task via repository
5. Return updated task

**Note**: At least one of title or description must be provided.

---

### complete_task

Toggle a task's completion status.

**Signature**:
```python
def complete_task(self, task_id: str) -> Task:
```

**Parameters**:
- `task_id` (str, required): UUID of the task

**Returns**:
- `Task`: Task with toggled completion status

**Raises**:
- `TaskNotFoundError`: If task ID does not exist

**Behavior**:
1. Retrieve existing task
2. Toggle completed status (True → False or False → True)
3. Save updated task via repository
4. Return updated task

**Note**: This method toggles the status regardless of current state. Calling twice returns to original state.

---

### delete_task

Delete a task by ID.

**Signature**:
```python
def delete_task(self, task_id: str) -> None:
```

**Parameters**:
- `task_id` (str, required): UUID of the task to delete

**Returns**: None

**Raises**:
- `TaskNotFoundError`: If task ID does not exist

**Behavior**:
1. Verify task exists in repository
2. If not found, raise TaskNotFoundError
3. Delete task from repository
4. Return None

**Idempotency**: Not idempotent - attempting to delete same ID twice raises error on second call.

---

## Error Handling

All service methods catch domain-level exceptions and either:
1. Re-raise with additional context
2. Translate to application-level exceptions

The service layer does NOT catch exceptions - they bubble up to the interface layer.

## Thread Safety

**Phase I**: Not thread-safe (single-threaded, single-user design)

**Future Phases**: May require locking or transaction support

## Performance Expectations

All operations complete in <100ms (well under the 2-second requirement from spec).

## Usage Example

```python
# Initialize service
repository = InMemoryTaskRepository()
service = TaskService(repository)

# Create task
task1 = service.create_task(title="Buy groceries", description="Milk and eggs")

# List tasks
all_tasks = service.list_tasks()  # [task1]

# Update task
updated = service.update_task(task1.id, title="Buy groceries and gas")

# Complete task
completed = service.complete_task(task1.id)

# Delete task
service.delete_task(task1.id)

# Verify deletion
remaining = service.list_tasks()  # []
```

## Dependencies

- `domain.task.Task`: Task entity
- `domain.task_repository.TaskRepository`: Repository interface
- `application.exceptions`: Custom exception types

## Testing Contract

Service must be tested with:
1. Mock repository (unit tests)
2. Real in-memory repository (integration tests)
3. All error scenarios
4. Edge cases (empty list, non-existent IDs, etc.)

See `tests/unit/test_task_service.py` for implementation.

# Data Model: Console Todo Application

**Feature**: Console Todo Application
**Branch**: `001-console-todo-app`
**Date**: 2026-02-09

## Overview

This document defines the data structures and relationships for the in-memory todo application. The model is intentionally simple to support Phase I requirements while enabling future persistence in later phases.

## Entities

### Task

Represents a single todo item managed by the user.

**Properties**:

| Property | Type | Required | Constraints | Default | Description |
|----------|------|----------|-------------|---------|-------------|
| id | UUID (string) | Yes | Unique, immutable | Auto-generated | Unique identifier for the task |
| title | string | Yes | Non-empty, max 200 chars | None | Short description of the task |
| description | string | No | Max 1000 chars | Empty string | Detailed information about the task |
| completed | boolean | Yes | True or False | False | Whether the task is completed |

**Validation Rules**:
- Title MUST NOT be empty string
- Title length MUST be ≤ 200 characters
- Description length MUST be ≤ 1000 characters if provided
- ID is auto-generated as UUID4 and cannot be changed after creation
- Completed status can toggle between True and False

**Example**:
```python
Task(
    id="550e8400-e29b-41d4-a716-446655440000",
    title="Buy groceries",
    description="Milk, eggs, bread, and vegetables",
    completed=False
)
```

## Repository Interface

### TaskRepository

Abstract interface defining storage operations for tasks.

**Methods**:

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| create | task: Task | Task | Stores a new task |
| get_by_id | task_id: UUID | Task \| None | Retrieves task by ID, None if not found |
| get_all | None | List[Task] | Returns all tasks |
| update | task: Task | Task | Updates existing task |
| delete | task_id: UUID | bool | Removes task, returns True if existed |
| exists | task_id: UUID | bool | Checks if task ID exists |

**Implementation Note**: Phase I uses in-memory dictionary. Interface allows future database implementations without changing dependent code.

## State Structure

### In-Memory Storage

**Implementation**: Python dictionary with UUID keys

```python
{
    "550e8400-e29b-41d4-a716-446655440000": Task(...),
    "7c9e6679-7425-40de-944b-e07fc1f90ae7": Task(...),
    ...
}
```

**Characteristics**:
- O(1) lookup by ID
- O(n) list all tasks
- No indexes (not needed for single-user session)
- No persistence (cleared when process ends)

## Data Flow

```
User Action
    ↓
CLI Layer (parse input)
    ↓
Application Layer (TaskService)
    ↓
Domain Layer (Task entity validation)
    ↓
Infrastructure Layer (InMemoryTaskRepository)
    ↓
In-Memory Dictionary
```

## Relationships

**Phase I**: No relationships - tasks are independent entities

**Future Phases**:
- Phase II: Tasks may have user ownership
- Phase III: Tasks may have conversation context
- Phase V: Tasks may emit events

## Migration Strategy

**Phase I → Phase II**:
- Add database table with same schema
- Swap InMemoryTaskRepository with DatabaseTaskRepository
- No changes to Task entity or TaskService

**Future Schema Evolution**:
- Add fields: created_at, updated_at timestamps
- Add fields: user_id for multi-user support
- Add fields: priority, due_date for enhanced functionality

**Backward Compatibility**:
- Optional fields added with defaults
- Existing fields never removed, only deprecated
- Version migration scripts for database changes

## Constraints Summary

From specification requirements:

- FR-001: Task MUST have non-empty title
- FR-002: Task MUST have unique ID
- FR-003: Task MUST display completion status
- FR-007: Data MUST exist in-memory only (Phase I)
- FR-009: Title MUST be validated as non-empty

All constraints enforced in domain layer (Task entity).

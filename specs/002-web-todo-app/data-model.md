# Data Model: Web Todo Application (Phase II)

**Feature**: Web Todo Application
**Branch**: `002-web-todo-app`
**Date**: 2026-02-09

## Overview

Phase II uses the same domain model as Phase I. This document describes how the domain entities are exposed through the HTTP API and represented in the frontend.

## Domain Entities (Unchanged from Phase I)

### Task

Core business entity representing a todo item.

**Properties**:

| Property | Type | Required | Constraints | Default | Description |
|----------|------|----------|-------------|---------|-------------|
| id | UUID (string) | Yes | Unique, immutable | Auto-generated | Unique identifier |
| title | string | Yes | Non-empty, max 200 chars | None | Task title |
| description | string | No | Max 1000 chars | Empty string | Task details |
| completed | boolean | Yes | True or False | False | Completion status |

**Validation Rules**: Same as Phase I
- Title MUST NOT be empty
- Title length ≤ 200 characters
- Description length ≤ 1000 characters
- ID is auto-generated (UUID4)
- Completed status is boolean

## API Models (NEW for Phase II)

### Request Models (Input to API)

#### CreateTaskRequest

Used for POST /tasks

```json
{
  "title": "string (required, non-empty, max 200)",
  "description": "string (optional, max 1000, default empty)"
}
```

**Validation**:
- Title required and non-empty
- Title max length 200
- Description optional, max length 1000

#### UpdateTaskRequest

Used for PUT /tasks/{id}

```json
{
  "title": "string (optional, non-empty if provided, max 200)",
  "description": "string (optional, max 1000)"
}
```

**Validation**:
- At least one field must be provided
- Title non-empty if provided
- Title max length 200 if provided
- Description max length 1000 if provided

### Response Models (Output from API)

#### TaskResponse

Returned by GET /tasks, GET /tasks/{id}, POST /tasks, PUT /tasks/{id}, PATCH /tasks/{id}/complete

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

#### TaskListResponse

Returned by GET /tasks

```json
{
  "tasks": [
    {
      "id": "uuid-1",
      "title": "Task 1",
      "description": "Description 1",
      "completed": false
    },
    {
      "id": "uuid-2",
      "title": "Task 2",
      "description": "Description 2",
      "completed": true
    }
  ],
  "count": 2
}
```

#### ErrorResponse

Returned on any error (400, 404, 500)

```json
{
  "detail": "Task not found with ID: abc-123",
  "error_code": "TASK_NOT_FOUND",
  "status_code": 404
}
```

**Error Codes**:
- `TASK_NOT_FOUND` - Task ID does not exist (404)
- `INVALID_TASK_DATA` - Validation failure (400)
- `INTERNAL_ERROR` - Unexpected server error (500)

## Frontend Data Structures

### Task (UI Model)

JavaScript object representing a task in the UI:

```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Buy groceries",
  description: "Milk, eggs, bread",
  completed: false
}
```

**Note**: Frontend task structure matches API response exactly (no transformation needed).

### UI State

```javascript
{
  tasks: [],           // Array of task objects
  loading: false,      // Loading indicator
  error: null,        // Error message (if any)
  selectedTask: null  // Task being edited (if any)
}
```

## Data Flow

### Create Task Flow

```
User Input (form)
    ↓
Frontend validation (client-side)
    ↓
POST /tasks { title, description }
    ↓
Pydantic validation (CreateTaskRequest)
    ↓
TaskService.create_task()
    ↓
Task entity (domain validation)
    ↓
InMemoryTaskRepository.create()
    ↓
201 Created + TaskResponse
    ↓
Frontend updates task list
    ↓
UI displays new task
```

### Update Task Flow

```
User edits task
    ↓
Frontend captures changes
    ↓
PUT /tasks/{id} { title, description }
    ↓
Pydantic validation (UpdateTaskRequest)
    ↓
TaskService.update_task()
    ↓
Task entity update with validation
    ↓
InMemoryTaskRepository.update()
    ↓
200 OK + TaskResponse
    ↓
Frontend updates task in list
    ↓
UI reflects changes
```

### Error Flow Example

```
Invalid title (empty string)
    ↓
Task entity validation fails
    ↓
InvalidTaskDataError raised
    ↓
API layer catches exception
    ↓
400 Bad Request + ErrorResponse
    ↓
Frontend displays error message
    ↓
User sees validation feedback
```

## Storage Strategy

**Phase II**: Same as Phase I - Python dictionary

```python
# InMemoryTaskRepository._tasks
{
    "uuid-1": Task(...),
    "uuid-2": Task(...),
}
```

**Characteristics**:
- O(1) lookup by ID
- O(n) list all tasks
- Thread-safe: Not required (single-process for Phase II)
- Persistence: None (resets on backend restart)

## API Contract Versioning

**Phase II**: No versioning (v1 implicit)

**Future**: API version can be added in Phase III/IV
- URL prefix: `/v1/tasks` or `/v2/tasks`
- Header-based: `Accept: application/vnd.todo.v1+json`

## CORS Configuration

**Development**: Allow localhost origins

```python
# FastAPI CORS middleware
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",  # VS Code Live Server
    "http://127.0.0.1:5500",
]
```

**Production**: Not applicable for Phase II (local only)

## Data Validation Rules

### API Layer Validation (Pydantic)

- Request body structure and types
- Field presence (required vs optional)
- String length constraints
- Type coercion where appropriate

### Domain Layer Validation (Task Entity)

- Business rules (non-empty title)
- Domain constraints (max lengths)
- State transitions (completion toggle)

**Two-Layer Validation**: API validates format, Domain validates business rules

## Migration from Phase I

**No Migration Needed**: Phase II is a separate deployment

**Code Reuse**:
1. Copy `domain/` directory from Phase I → Phase II backend
2. Copy `application/` directory from Phase I → Phase II backend
3. Copy `infrastructure/` directory from Phase I → Phase II backend
4. Copy `tests/unit/` from Phase I → Phase II backend
5. Add new API layer and tests

**No Code Changes**: Phase I domain logic used as-is

## Frontend-Backend Contract

**Communication Protocol**: HTTP/JSON over REST

**Responsibilities**:
- **Backend**: Enforce all business rules, maintain state, validate all inputs
- **Frontend**: Present data, collect input, provide UX feedback, basic client-side validation (optional)

**Trust Model**:
- Frontend trusts backend validation (doesn't duplicate complex rules)
- Backend never trusts frontend (always validates)
- Frontend gracefully handles all backend responses

## Phase II Constraints

- In-memory storage only (no database)
- Single backend instance (no load balancing)
- Local development only (no public hosting)
- No authentication (open API)
- No persistent sessions
- Browser-based UI only (no mobile apps)

## Future Evolution (Phase III-V)

**Phase III (Chatbot)**:
- Same Task model
- Add MCP tool schemas
- Backend remains unchanged

**Phase IV (Kubernetes)**:
- Same API contract
- Add database-backed repository
- Multiple backend replicas (need session persistence decision)

**Phase V (Cloud)**:
- Same domain model
- Add event publishing
- Cloud-native persistence

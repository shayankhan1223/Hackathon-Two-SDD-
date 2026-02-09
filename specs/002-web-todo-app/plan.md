# Implementation Plan: Web Todo Application (Phase II)

**Branch**: `002-web-todo-app` | **Date**: 2026-02-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-web-todo-app/spec.md`

## Summary

Transform the Phase I console-based todo application into a web-based system with a FastAPI backend exposing REST API endpoints and a web frontend UI. Reuse Phase I domain logic (Task entity, TaskRepository, TaskService) without modification, adding only HTTP transport layer and web UI.

## Technical Context

**Language/Version**: Python 3.13+ (backend), HTML/CSS/JavaScript (frontend)
**Primary Dependencies**:
- Backend: FastAPI, uvicorn, pydantic
- Frontend: Vanilla JavaScript (no framework required for Phase II)
**Storage**: In-memory (reuse InMemoryTaskRepository from Phase I)
**Testing**:
- Backend: pytest, FastAPI TestClient
- Frontend: Basic JavaScript tests or manual verification
**Target Platform**: Local development (localhost)
**Project Type**: Web application (backend + frontend)
**Performance Goals**: <2 seconds API response, <500ms UI feedback
**Constraints**: In-memory only, no persistence, single-user, local deployment
**Scale/Scope**: Single-user, local development, no production deployment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase Isolation
- ✅ Phase II web app is self-contained in `/phase-02-web/`
- ✅ No cross-phase dependencies except intentional domain logic reuse
- ✅ Includes own README, specs, backend/, frontend/, tests/

### Naming Conventions
- ✅ Python files use `snake_case`
- ✅ JavaScript files use `camelCase` for functions, `kebab-case` for files
- ✅ Classes use `PascalCase`
- ✅ API endpoints use REST conventions (`/tasks`, `/tasks/{id}`)
- ✅ Domain entities: Task (unchanged from Phase I)

### Architecture Quality
- ✅ Single Responsibility Principle enforced
- ✅ Clear layer separation: Domain / Application / API / Frontend
- ✅ No business logic in API routes (delegated to TaskService)
- ✅ No hard-coded values (use environment variables)

### Testing Requirements
- ✅ Backend unit tests (domain, service)
- ✅ Backend API tests (FastAPI TestClient)
- ✅ Frontend integration tests with mocked API
- ✅ Tests independent of browser interaction where possible

### Evolution Guarantee
- ✅ Architecture allows Phase III MCP tool integration
- ✅ API design supports Phase IV containerization
- ✅ Domain layer remains framework-agnostic
- ✅ No design decisions block Phase III-V

**Status**: ✅ All gates passed

## Project Structure

### Documentation (this feature)

```text
specs/002-web-todo-app/
├── plan.md              # This file
├── research.md          # Phase 0 output (if needed)
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # API contracts (OpenAPI spec)
└── tasks.md             # Phase 2 output (from /sp.tasks)
```

### Source Code (repository root)

```text
phase-02-web/
├── backend/
│   ├── src/
│   │   ├── domain/              # Copied from Phase I
│   │   │   ├── __init__.py
│   │   │   ├── task.py          # Reused from Phase I
│   │   │   └── task_repository.py
│   │   │
│   │   ├── application/         # Copied from Phase I
│   │   │   ├── __init__.py
│   │   │   ├── task_service.py  # Reused from Phase I
│   │   │   └── exceptions.py
│   │   │
│   │   ├── infrastructure/      # Copied from Phase I
│   │   │   ├── __init__.py
│   │   │   └── in_memory_task_repository.py
│   │   │
│   │   ├── api/                 # NEW for Phase II
│   │   │   ├── __init__.py
│   │   │   ├── main.py          # FastAPI app initialization
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py
│   │   │   │   └── tasks.py     # Task CRUD endpoints
│   │   │   ├── models/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── task_request.py   # Request schemas
│   │   │   │   ├── task_response.py  # Response schemas
│   │   │   │   └── error_response.py # Error schemas
│   │   │   └── dependencies.py  # Dependency injection
│   │   │
│   │   └── main.py              # Backend entry point
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── unit/                # Reuse Phase I tests
│   │   │   ├── test_task.py
│   │   │   ├── test_task_repository.py
│   │   │   └── test_task_service.py
│   │   ├── api/                 # NEW API tests
│   │   │   ├── __init__.py
│   │   │   ├── test_tasks_api.py
│   │   │   └── test_error_handling.py
│   │   └── fixtures/
│   │       └── api_fixtures.py
│   │
│   ├── pyproject.toml           # Backend dependencies
│   └── README.md                # Backend setup instructions
│
├── frontend/
│   ├── src/
│   │   ├── index.html           # Main UI page
│   │   ├── css/
│   │   │   └── styles.css       # UI styling
│   │   ├── js/
│   │   │   ├── api-client.js    # API communication layer
│   │   │   ├── task-manager.js  # UI logic and rendering
│   │   │   └── main.js          # Application initialization
│   │   └── assets/              # Images, icons (if needed)
│   │
│   ├── tests/                   # Frontend tests (optional)
│   │   └── test-api-client.js
│   │
│   └── README.md                # Frontend setup instructions
│
├── README.md                    # Phase II overview and setup
└── CONSTITUTION.md              # Copy of constitution
```

**Structure Decision**: Web application with separate backend and frontend directories. Backend is a FastAPI application reusing Phase I domain/application/infrastructure layers with new API layer. Frontend is vanilla HTML/CSS/JavaScript served statically (no complex framework needed for Phase II MVP).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations - all constitution requirements satisfied.

**Reuse Strategy Note**: Phase I code is COPIED (not imported) to Phase II to maintain phase isolation per constitution. This allows each phase to be independently runnable while demonstrating domain logic portability.

## High-Level Architecture

### Layer 1: Domain Layer (Reused from Phase I)
**Purpose**: Core business entities and rules, framework-agnostic

**Components**:
- `Task` entity: Same as Phase I (id, title, description, completed)
- `TaskRepository` interface: Same abstract contract
- Validation rules: Unchanged from Phase I

**Dependencies**: None

**Changes from Phase I**: None - exact copy

### Layer 2: Application Layer (Reused from Phase I)
**Purpose**: Use-case orchestration

**Components**:
- `TaskService`: Same business logic
- `Exceptions`: Same domain exceptions (TaskNotFoundError, InvalidTaskDataError)

**Dependencies**: Domain layer only

**Changes from Phase I**: None - exact copy

### Layer 3: Infrastructure Layer (Reused from Phase I)
**Purpose**: Storage implementation

**Components**:
- `InMemoryTaskRepository`: Same dict-based storage

**Dependencies**: Domain layer

**Changes from Phase I**: None - exact copy

### Layer 4: API Layer (NEW for Phase II)
**Purpose**: HTTP transport and request/response handling

**Components**:
- `FastAPI App`: HTTP server and routing
- `API Routes`: REST endpoints for tasks
  - POST /tasks - Create task
  - GET /tasks - List all tasks
  - GET /tasks/{id} - Get single task
  - PUT /tasks/{id} - Update task
  - DELETE /tasks/{id} - Delete task
  - PATCH /tasks/{id}/complete - Toggle completion
- `Request Models`: Pydantic schemas for validation
- `Response Models`: Pydantic schemas for serialization
- `Error Handlers`: HTTP exception translation
- `Dependency Injection`: Service instantiation for routes

**Dependencies**: Application and Domain layers

### Layer 5: Frontend Layer (NEW for Phase II)
**Purpose**: User interface and presentation

**Components**:
- `HTML Page`: Single-page interface
- `API Client`: JavaScript module for HTTP requests
- `Task Manager`: UI rendering and state management
- `Event Handlers`: User interaction handlers
- `CSS Styles`: UI styling and layout

**Dependencies**: Backend API (via HTTP)

## Data Flow

```
User Browser
    ↓
Frontend JS (validate & format)
    ↓
HTTP Request (JSON)
    ↓
FastAPI Routes (parse & validate with Pydantic)
    ↓
TaskService (business logic - REUSED FROM PHASE I)
    ↓
Domain (Task entity + validation)
    ↓
InMemoryTaskRepository (storage)
    ↓
[Return result or raise exception]
    ↓
FastAPI Routes (catch exceptions)
    ↓
HTTP Response (JSON with status code)
    ↓
Frontend JS (update UI)
    ↓
Display to User
```

**Key Principles**:
- Backend is stateless (state in repository only)
- Frontend holds no authoritative state (backend is source of truth)
- Errors propagate up, responses propagate down
- Each layer validates its own inputs

## API Design (REST)

### Endpoints

| Method | Endpoint | Purpose | Request Body | Success Response | Error Response |
|--------|----------|---------|--------------|------------------|----------------|
| GET | /tasks | List all tasks | None | 200 + JSON array | 500 on failure |
| GET | /tasks/{id} | Get single task | None | 200 + JSON object | 404 if not found |
| POST | /tasks | Create task | JSON with title, description | 201 + created task | 400 if invalid |
| PUT | /tasks/{id} | Update task | JSON with title, description | 200 + updated task | 404 if not found, 400 if invalid |
| DELETE | /tasks/{id} | Delete task | None | 204 (no content) | 404 if not found |
| PATCH | /tasks/{id}/complete | Toggle completion | None | 200 + updated task | 404 if not found |

### Request/Response Format

**Task Response Model**:
```json
{
  "id": "uuid-string",
  "title": "string",
  "description": "string",
  "completed": boolean
}
```

**Create/Update Request Model**:
```json
{
  "title": "string (required, non-empty, max 200)",
  "description": "string (optional, max 1000)"
}
```

**Error Response Model**:
```json
{
  "detail": "string (user-friendly message)",
  "error_code": "string (machine-readable code)",
  "status_code": number
}
```

## State Management

**Backend State**:
- Single InMemoryTaskRepository instance per backend process
- State lifetime = backend process lifetime
- State resets when backend restarts
- No session state (stateless API)

**Frontend State**:
- Ephemeral UI state only (form inputs, loading states)
- No local storage or persistence
- Refetch data on page load
- Optimistic UI updates with rollback on error

## Error Handling Strategy

### Backend Error Flow

**Domain Exceptions** → **Application Exceptions** → **HTTP Exceptions**

1. **Domain Layer**: Raises `InvalidTaskDataError`
2. **Application Layer**: Raises `TaskNotFoundError`, catches domain errors
3. **API Layer**: Translates to HTTP responses:
   - `TaskNotFoundError` → 404 Not Found
   - `InvalidTaskDataError` → 400 Bad Request
   - `Unexpected errors` → 500 Internal Server Error

### Frontend Error Handling

- Network errors: "Cannot connect to server"
- 400 errors: Display validation message
- 404 errors: "Task not found"
- 500 errors: "Server error, please try again"
- Timeout: "Request timed out"

## Testing Strategy

### Backend Tests

**Unit Tests** (Phase I tests - reused):
- `tests/unit/test_task.py` - Task entity
- `tests/unit/test_task_repository.py` - Repository
- `tests/unit/test_task_service.py` - Service

**API Tests** (NEW):
- `tests/api/test_tasks_api.py`:
  - POST /tasks with valid/invalid data
  - GET /tasks returns all tasks
  - GET /tasks/{id} with valid/invalid ID
  - PUT /tasks/{id} with valid/invalid data
  - DELETE /tasks/{id} with valid/invalid ID
  - PATCH /tasks/{id}/complete
- `tests/api/test_error_handling.py`:
  - 400 responses for validation errors
  - 404 responses for missing tasks
  - 500 responses for unexpected errors

**Coverage Target**: >90% for backend (domain, application, API layers)

### Frontend Tests

**Component Tests** (optional for Phase II):
- API client: Mocked HTTP requests
- Task rendering: DOM manipulation
- Form validation: Input handling

**Manual Testing**: Primary approach for Phase II frontend
- Create task flow
- View tasks flow
- Update task flow
- Complete task flow
- Delete task flow

### Integration Tests

**End-to-End** (optional but recommended):
- Backend running + Frontend interaction
- Full CRUD workflows
- Error scenarios

## Extensibility Plan

**Phase III (Chatbot) Preparation**:
- TaskService already isolated and reusable
- Add MCP tool layer alongside API layer
- No changes to domain/application needed

**Phase IV (Kubernetes) Preparation**:
- Stateless API design ready for horizontal scaling
- Environment variables for configuration
- Health check endpoints can be added

**Phase V (Cloud) Preparation**:
- Repository interface allows database swap
- API design supports distributed deployment
- Domain events can be added for event sourcing

## Configuration

**Backend Environment Variables**:
- `HOST` = "0.0.0.0" (default)
- `PORT` = 8000 (default)
- `CORS_ORIGINS` = "http://localhost:3000" (for frontend)
- `DEBUG` = True (development only)

**Frontend Configuration**:
- `API_BASE_URL` = "http://localhost:8000" (hardcoded or config.js)

**No Secrets**: Phase II has no sensitive configuration

## Dependencies & Tooling

**Backend Runtime Dependencies**:
- fastapi >= 0.115.0
- uvicorn >= 0.34.0
- pydantic >= 2.10.0
- python-multipart (for form data if needed)

**Backend Development Dependencies**:
- pytest >= 8.0.0
- pytest-cov >= 4.1.0
- httpx >= 0.28.0 (for TestClient)

**Frontend Dependencies**:
- None (vanilla JavaScript)

**Build Tools**:
- Backend: uv (Python package manager)
- Frontend: None (static files)

## Phase 0: Research

**Frontend Framework Decision**:

**Decision**: Vanilla HTML/CSS/JavaScript (no framework)

**Rationale**:
- Phase II MVP requires simple CRUD operations only
- No complex state management needed
- Faster development without framework overhead
- Easier to understand and maintain
- Can be replaced with React/Vue in future if needed

**Alternatives Considered**:
- React: Overkill for simple CRUD, adds build complexity
- Vue: Similar reasoning, unnecessary for Phase II scope
- Svelte: Same concerns, defer to future phase if needed

**CORS Handling**:

**Decision**: Enable CORS in FastAPI for localhost development

**Rationale**:
- Backend and frontend run on different ports during development
- CORS middleware in FastAPI is simple and standard
- Production CORS handling deferred to Phase IV/V

## Phase 1: Design Artifacts

Creating the following artifacts now...

# Implementation Plan: Console Todo Application

**Branch**: `001-console-todo-app` | **Date**: 2026-02-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-console-todo-app/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build an in-memory Python console Todo application with clean architecture supporting CRUD operations for tasks. The system uses a layered architecture (Domain, Application, Interface) to ensure testability, maintainability, and extensibility for future phases.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: Python standard library only (no external dependencies)
**Storage**: In-memory (Python dict/list structures)
**Testing**: pytest
**Target Platform**: Cross-platform console (Linux, macOS, Windows)
**Project Type**: Single console application
**Performance Goals**: <2 seconds per operation
**Constraints**: In-memory only, no persistence, single-user session
**Scale/Scope**: Single-session, no concurrency requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase Isolation
- ✅ Phase I console app is self-contained in `/phase-01-console/`
- ✅ No cross-phase dependencies
- ✅ Includes own README, specs, src, tests

### Naming Conventions
- ✅ Python files use `snake_case`
- ✅ Classes use `PascalCase` (Task, TaskService, TaskRepository)
- ✅ Functions use `verb_noun` format (create_task, delete_task)
- ✅ Domain entities: Task (canonical name)

### Architecture Quality
- ✅ Single Responsibility Principle enforced
- ✅ Clear layer separation: Domain / Application / Interface
- ✅ No business logic in CLI layer
- ✅ No hard-coded values (use constants/config)

### Testing Requirements
- ✅ Unit tests for task CRUD logic
- ✅ In-memory state tests
- ✅ Edge case tests (invalid IDs, empty list)
- ✅ Tests independent of console I/O

### Evolution Guarantee
- ✅ Architecture allows future persistence layer
- ✅ Domain layer isolated from transport (CLI can be replaced)
- ✅ Repository pattern enables database swap
- ✅ No design decisions block Phase II-V

**Status**: ✅ All gates passed

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
phase-01-console/
├── src/
│   ├── domain/
│   │   ├── __init__.py
│   │   ├── task.py              # Task entity with validation
│   │   └── task_repository.py   # Repository interface
│   │
│   ├── application/
│   │   ├── __init__.py
│   │   ├── task_service.py      # Task operations orchestration
│   │   └── exceptions.py        # Domain-specific exceptions
│   │
│   ├── infrastructure/
│   │   ├── __init__.py
│   │   └── in_memory_task_repository.py  # In-memory implementation
│   │
│   ├── interface/
│   │   ├── __init__.py
│   │   ├── cli.py               # Main CLI entry point
│   │   ├── command_router.py    # Command parsing and routing
│   │   ├── console_renderer.py  # Output formatting
│   │   └── input_handler.py     # Input validation and parsing
│   │
│   └── main.py                   # Application entry point
│
├── tests/
│   ├── __init__.py
│   ├── unit/
│   │   ├── test_task.py
│   │   ├── test_task_repository.py
│   │   └── test_task_service.py
│   │
│   ├── integration/
│   │   └── test_task_workflows.py
│   │
│   └── fixtures/
│       └── task_fixtures.py
│
├── pyproject.toml                # uv project configuration
├── README.md                     # Setup and usage instructions
└── CONSTITUTION.md               # Copy of project constitution
```

**Structure Decision**: Single console project with layered architecture. The src/ directory is organized by architectural concern (domain, application, infrastructure, interface) to enforce separation of concerns and enable future extensibility. Tests mirror the source structure and focus on logic layers independent of I/O.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations - all constitution requirements satisfied without additional complexity.

## High-Level Architecture

The system follows a layered architecture pattern with clear separation of concerns:

### Layer 1: Domain Layer
**Purpose**: Core business entities and rules, independent of infrastructure

**Components**:
- `Task` entity: Represents a todo item with validation rules
  - Properties: id (UUID), title (non-empty string), description (optional string), completed (boolean)
  - Validates title is non-empty on creation
  - Immutable ID after creation
  
- `TaskRepository` interface: Abstract contract for task storage
  - Methods: create, get_by_id, get_all, update, delete, exists
  - No implementation details (in-memory vs database)

**Dependencies**: None (pure Python, no external dependencies)

### Layer 2: Application Layer
**Purpose**: Use-case orchestration and business logic coordination

**Components**:
- `TaskService`: Orchestrates task operations
  - Methods: create_task, get_task, list_tasks, update_task, complete_task, delete_task
  - Enforces business rules (e.g., title validation, ID existence)
  - Returns domain objects or raises domain exceptions
  
- `Exceptions`: Domain-specific error types
  - `TaskNotFoundError`: Task ID does not exist
  - `InvalidTaskDataError`: Validation failure (empty title, etc.)
  - `DuplicateTaskError`: Attempting to create duplicate ID

**Dependencies**: Domain layer only

### Layer 3: Infrastructure Layer
**Purpose**: Concrete implementations of repository interfaces

**Components**:
- `InMemoryTaskRepository`: Dictionary-based storage implementation
  - Uses Python dict for O(1) lookups by ID
  - Implements TaskRepository interface
  - Thread-safe not required (single-user session)

**Dependencies**: Domain layer interfaces

### Layer 4: Interface Layer (CLI)
**Purpose**: User interaction and presentation logic

**Components**:
- `CLI`: Main console loop
  - Displays menu
  - Routes commands to handlers
  - Manages application lifecycle
  
- `CommandRouter`: Maps user input to service calls
  - Parses command choices
  - Invokes appropriate TaskService methods
  - Catches and translates exceptions
  
- `ConsoleRenderer`: Formats output
  - Task list formatting (table view)
  - Success/error message formatting
  - User prompts and instructions
  
- `InputHandler`: Validates and sanitizes input
  - Reads user input
  - Validates format (e.g., numeric IDs)
  - Returns parsed values or validation errors

**Dependencies**: Application and Domain layers

## Data Flow

```
User Input
    ↓
InputHandler (validate & parse)
    ↓
CommandRouter (route to service)
    ↓
TaskService (orchestrate business logic)
    ↓
Domain (Task entity + repository interface)
    ↓
Infrastructure (in-memory implementation)
    ↓
[Return result or exception]
    ↓
CommandRouter (catch exceptions)
    ↓
ConsoleRenderer (format output)
    ↓
Display to User
```

**Key Principles**:
- No domain logic in CLI
- No direct repository access from CLI
- Exceptions flow up, presentation flows down

## State Management

**Strategy**: Single in-memory repository instance per application session

- Repository instantiated at application startup
- Passed to TaskService via dependency injection
- State lifetime = process lifetime
- No global mutable state
- No singleton patterns (use constructor injection)

**Data Structure**:
```python
# InMemoryTaskRepository internal structure
{
    "task-uuid-1": Task(id="task-uuid-1", title="...", ...),
    "task-uuid-2": Task(id="task-uuid-2", title="...", ...),
}
```

## Error Handling Strategy

**Layers**:

1. **Domain Layer**: Raises domain exceptions
   - `InvalidTaskDataError` for validation failures
   
2. **Application Layer**: Raises application exceptions
   - `TaskNotFoundError` for missing IDs
   - Catches domain exceptions and adds context
   
3. **Interface Layer**: Translates to user messages
   - Catches all exceptions
   - Maps to user-friendly error messages
   - Logs unexpected exceptions (future: proper logging)

**User Experience**:
- No stack traces visible to users
- Clear actionable error messages
- Graceful degradation (return to menu on error)

## Testing Strategy

**Domain Tests** (`tests/unit/test_task.py`):
- Task creation with valid/invalid data
- Task property immutability (ID)
- Title validation rules

**Repository Tests** (`tests/unit/test_task_repository.py`):
- CRUD operations
- ID uniqueness
- Non-existent ID handling

**Service Tests** (`tests/unit/test_task_service.py`):
- Create task workflow
- Update existing task
- Complete task toggle
- Delete task
- Error scenarios (invalid ID, empty title)

**Integration Tests** (`tests/integration/test_task_workflows.py`):
- End-to-end user scenarios
- Multiple operation sequences
- State consistency across operations

**CLI Tests**: Minimal (focus on logic, not I/O)

**Coverage Target**: >90% for domain and application layers

## Extensibility Plan

**Phase II (Web) Preparation**:
- TaskService can be reused without modification
- Replace CLI layer with FastAPI controllers
- Repository interface remains the same, swap implementation

**Phase III (Chatbot) Preparation**:
- TaskService exposed as MCP tools
- Same domain model, different transport layer

**Phase IV (Kubernetes) Preparation**:
- Replace InMemoryTaskRepository with database implementation
- No changes to domain or application layers

**Phase V (Cloud) Preparation**:
- TaskService methods can publish events
- Domain events added without breaking existing code

**Design Decisions Supporting Evolution**:
- Repository pattern abstracts storage
- Service layer isolates business logic
- Domain layer has zero external dependencies
- Interface layer is completely replaceable

## Configuration

**Environment Variables**: None (Phase I has no configurable behavior)

**Constants** (in `src/domain/task.py`):
- `MAX_TITLE_LENGTH = 200`
- `MAX_DESCRIPTION_LENGTH = 1000`

**Future Configuration Needs**:
- Database connection string (Phase II+)
- API keys (Phase III+)
- Deployment config (Phase IV+)

## Validation Rules

From spec FR-001, FR-009:
- Task title MUST be non-empty string
- Task title MUST be ≤ 200 characters
- Task description MUST be ≤ 1000 characters if provided
- Task ID MUST be unique (UUID4 format)
- Completion status MUST be boolean

Enforced in:
- Domain layer (Task entity constructor)
- Application layer (TaskService methods)

## Performance Considerations

**Requirements**: <2 seconds per operation (spec SC-002)

**Implementation**:
- O(1) task lookup by ID (dict-based storage)
- O(n) list all tasks (acceptable for single-user session)
- No network latency (in-memory only)
- No database query overhead

**Expected Performance**: <100ms per operation (well under 2s requirement)

## Dependencies & Tooling

**Runtime Dependencies**:
- Python 3.13+ (standard library only)

**Development Dependencies**:
- `pytest` - test framework
- `pytest-cov` - coverage reporting

**Build Tool**:
- `uv` - package manager and virtualenv

**No External Libraries**: Per spec FR-007 exclusions

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ID collision | Low | High | Use UUID4 (collision probability negligible) |
| Memory overflow | Low | Medium | Single-user session, limited task count expected |
| Input injection | Low | Low | Input validation at interface layer |
| Concurrency issues | None | None | Single-threaded, single-user design |

## Deployment Strategy

**Phase I Deployment**: Manual execution from command line

**Setup Steps**:
1. Clone repository
2. Install Python 3.13+
3. Run `uv sync` to install dependencies
4. Execute `uv run python src/main.py`

**No Deployment Infrastructure**: Per spec (no containers, no cloud)

## Phase 0: Research

No research needed - all technical decisions are determined by spec:
- Python 3.13+ (spec requirement)
- In-memory storage (spec requirement)
- CLI interface (spec requirement)
- No external dependencies (spec constraint)

## Phase 1: Design Artifacts

### Data Model (`data-model.md`)

**Task Entity**:
```
Task
├── id: UUID (unique, immutable)
├── title: string (required, non-empty, max 200 chars)
├── description: string (optional, max 1000 chars)
└── completed: boolean (default: False)
```

**TaskRepository Interface**:
```
TaskRepository
├── create(task: Task) -> Task
├── get_by_id(task_id: UUID) -> Task | None
├── get_all() -> List[Task]
├── update(task: Task) -> Task
├── delete(task_id: UUID) -> bool
└── exists(task_id: UUID) -> bool
```

### Contracts (`contracts/`)

**TaskService Interface**:
```python
class TaskService:
    def create_task(title: str, description: str = "") -> Task
    def get_task(task_id: str) -> Task
    def list_tasks() -> List[Task]
    def update_task(task_id: str, title: str = None, description: str = None) -> Task
    def complete_task(task_id: str) -> Task
    def delete_task(task_id: str) -> None
```

### Quickstart (`quickstart.md`)

See separate file generated in Phase 1.

## Plan Readiness Checklist

- ✅ Every section maps to Phase I specification
- ✅ No code-level implementation details included
- ✅ Responsibilities clearly separated by layer
- ✅ Plan can be broken into atomic tasks (verified below)

## Task Breakdown Preview

From this plan, tasks will be generated as:
1. Create domain entities (Task class)
2. Create repository interface and in-memory implementation
3. Create application service (TaskService)
4. Create exception types
5. Create CLI components (router, renderer, input handler)
6. Wire up main application entry point
7. Write unit tests (domain, repository, service)
8. Write integration tests
9. Create README with setup instructions
10. Verify all acceptance criteria from spec

**Status**: ✅ Plan is ready for task generation (`/sp.tasks`)


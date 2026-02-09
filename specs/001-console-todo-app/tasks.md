# Tasks: Console Todo Application

**Input**: Design documents from `/specs/001-console-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

**Tests**: Test tasks are included per constitution requirement (Section 5: Testing Constitution)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Project structure based on plan.md:
- **Phase I root**: `phase-01-console/`
- **Source code**: `phase-01-console/src/`
- **Tests**: `phase-01-console/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create phase-01-console/ directory structure with src/, tests/, pyproject.toml
- [ ] T002 Initialize pyproject.toml with Python 3.13+ and pytest dependencies for uv
- [ ] T003 [P] Create all __init__.py files for src/ package structure
- [ ] T004 [P] Create README.md with setup instructions per constitution
- [ ] T005 [P] Copy CONSTITUTION.md to phase-01-console/
- [ ] T006 [P] Create CLAUDE.md with phase-specific context

**Checkpoint**: Basic project structure ready for development

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core domain and infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create Task entity class in phase-01-console/src/domain/task.py with id, title, description, completed properties
- [ ] T008 Add validation to Task entity (non-empty title, max lengths per data-model.md)
- [ ] T009 Create TaskRepository abstract interface in phase-01-console/src/domain/task_repository.py with create, get_by_id, get_all, update, delete, exists methods
- [ ] T010 [P] Create exception classes in phase-01-console/src/application/exceptions.py (TaskNotFoundError, InvalidTaskDataError)
- [ ] T011 Implement InMemoryTaskRepository in phase-01-console/src/infrastructure/in_memory_task_repository.py using dict storage
- [ ] T012 Create TaskService class in phase-01-console/src/application/task_service.py with constructor accepting repository
- [ ] T013 [P] Write unit tests for Task entity in phase-01-console/tests/unit/test_task.py
- [ ] T014 [P] Write unit tests for InMemoryTaskRepository in phase-01-console/tests/unit/test_task_repository.py
- [ ] T015 [P] Create test fixtures in phase-01-console/tests/fixtures/task_fixtures.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Tasks (Priority: P1) 🎯 MVP

**Goal**: Users can create tasks with title and optional description, establishing the core value proposition

**Independent Test**: Launch app, add tasks with titles, verify they're created with unique IDs and incomplete status

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T016 [P] [US1] Write test_create_task_with_valid_data in phase-01-console/tests/unit/test_task_service.py
- [ ] T017 [P] [US1] Write test_create_task_with_empty_title_raises_error in phase-01-console/tests/unit/test_task_service.py
- [ ] T018 [P] [US1] Write test_create_task_generates_unique_id in phase-01-console/tests/unit/test_task_service.py

### Implementation for User Story 1

- [ ] T019 [US1] Implement TaskService.create_task() method in phase-01-console/src/application/task_service.py
- [ ] T020 [US1] Add title validation in TaskService.create_task() (non-empty, max 200 chars)
- [ ] T021 [US1] Add description validation in TaskService.create_task() (max 1000 chars)
- [ ] T022 [US1] Generate UUID4 for task ID in TaskService.create_task()
- [ ] T023 [US1] Create console renderer for task creation confirmation in phase-01-console/src/interface/console_renderer.py
- [ ] T024 [US1] Create input handler for task data collection in phase-01-console/src/interface/input_handler.py
- [ ] T025 [US1] Implement add_task command in phase-01-console/src/interface/command_router.py
- [ ] T026 [US1] Add "Add Task" menu option to CLI in phase-01-console/src/interface/cli.py

**Checkpoint**: At this point, User Story 1 should be fully functional - users can add tasks

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1)

**Goal**: Users can view all their tasks with status, providing visibility into their task list

**Independent Test**: View list of created tasks showing ID, title, description, and completion status

### Tests for User Story 2 ⚠️

- [ ] T027 [P] [US2] Write test_list_tasks_returns_all_tasks in phase-01-console/tests/unit/test_task_service.py
- [ ] T028 [P] [US2] Write test_list_tasks_returns_empty_list_when_no_tasks in phase-01-console/tests/unit/test_task_service.py
- [ ] T029 [P] [US2] Write test_list_tasks_shows_completed_status in phase-01-console/tests/unit/test_task_service.py

### Implementation for User Story 2

- [ ] T030 [US2] Implement TaskService.list_tasks() method in phase-01-console/src/application/task_service.py
- [ ] T031 [US2] Create task list formatter in phase-01-console/src/interface/console_renderer.py
- [ ] T032 [US2] Add completion status indicator (○ incomplete, ● complete) to renderer
- [ ] T033 [US2] Implement view_tasks command in phase-01-console/src/interface/command_router.py
- [ ] T034 [US2] Add "View All Tasks" menu option to CLI in phase-01-console/src/interface/cli.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - MVP is functional

---

## Phase 5: User Story 3 - Complete Tasks (Priority: P2)

**Goal**: Users can toggle task completion status to track progress

**Independent Test**: Mark tasks as complete and verify status changes in task list

### Tests for User Story 3 ⚠️

- [ ] T035 [P] [US3] Write test_complete_task_toggles_status in phase-01-console/tests/unit/test_task_service.py
- [ ] T036 [P] [US3] Write test_complete_task_with_invalid_id_raises_error in phase-01-console/tests/unit/test_task_service.py
- [ ] T037 [P] [US3] Write test_complete_already_completed_task_toggles_back in phase-01-console/tests/unit/test_task_service.py

### Implementation for User Story 3

- [ ] T038 [US3] Implement TaskService.get_task() method in phase-01-console/src/application/task_service.py
- [ ] T039 [US3] Implement TaskService.complete_task() method in phase-01-console/src/application/task_service.py
- [ ] T040 [US3] Add task ID input handling in phase-01-console/src/interface/input_handler.py
- [ ] T041 [US3] Create completion confirmation message in phase-01-console/src/interface/console_renderer.py
- [ ] T042 [US3] Implement complete_task command in phase-01-console/src/interface/command_router.py
- [ ] T043 [US3] Add "Complete Task" menu option to CLI in phase-01-console/src/interface/cli.py

**Checkpoint**: Core todo functionality complete (add, view, complete)

---

## Phase 6: User Story 4 - Update Task Details (Priority: P3)

**Goal**: Users can modify task title and/or description to correct mistakes

**Independent Test**: Update a task's title or description and verify changes persist

### Tests for User Story 4 ⚠️

- [ ] T044 [P] [US4] Write test_update_task_title in phase-01-console/tests/unit/test_task_service.py
- [ ] T045 [P] [US4] Write test_update_task_description in phase-01-console/tests/unit/test_task_service.py
- [ ] T046 [P] [US4] Write test_update_task_with_invalid_id_raises_error in phase-01-console/tests/unit/test_task_service.py
- [ ] T047 [P] [US4] Write test_update_task_with_empty_title_raises_error in phase-01-console/tests/unit/test_task_service.py

### Implementation for User Story 4

- [ ] T048 [US4] Implement TaskService.update_task() method in phase-01-console/src/application/task_service.py
- [ ] T049 [US4] Add optional parameter handling (title and/or description) in update_task
- [ ] T050 [US4] Add validation for updated title/description in update_task
- [ ] T051 [US4] Create update task input flow in phase-01-console/src/interface/input_handler.py
- [ ] T052 [US4] Create update confirmation message in phase-01-console/src/interface/console_renderer.py
- [ ] T053 [US4] Implement update_task command in phase-01-console/src/interface/command_router.py
- [ ] T054 [US4] Add "Update Task" menu option to CLI in phase-01-console/src/interface/cli.py

**Checkpoint**: Full task editing capability available

---

## Phase 7: User Story 5 - Delete Tasks (Priority: P3)

**Goal**: Users can remove tasks to maintain a clean, focused task list

**Independent Test**: Delete a task and verify it no longer appears in listings

### Tests for User Story 5 ⚠️

- [ ] T055 [P] [US5] Write test_delete_task in phase-01-console/tests/unit/test_task_service.py
- [ ] T056 [P] [US5] Write test_delete_task_with_invalid_id_raises_error in phase-01-console/tests/unit/test_task_service.py
- [ ] T057 [P] [US5] Write test_delete_task_removes_from_list in phase-01-console/tests/unit/test_task_service.py

### Implementation for User Story 5

- [ ] T058 [US5] Implement TaskService.delete_task() method in phase-01-console/src/application/task_service.py
- [ ] T059 [US5] Add task existence check before deletion in delete_task
- [ ] T060 [US5] Create deletion confirmation message in phase-01-console/src/interface/console_renderer.py
- [ ] T061 [US5] Implement delete_task command in phase-01-console/src/interface/command_router.py
- [ ] T062 [US5] Add "Delete Task" menu option to CLI in phase-01-console/src/interface/cli.py

**Checkpoint**: All 5 user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, edge cases, integration testing, documentation

- [ ] T063 [P] Add error message rendering for all exception types in phase-01-console/src/interface/console_renderer.py
- [ ] T064 [P] Implement exception catching in command_router for all commands
- [ ] T065 [P] Add input validation for malformed IDs in phase-01-console/src/interface/input_handler.py
- [ ] T066 [P] Write integration tests for full workflows in phase-01-console/tests/integration/test_task_workflows.py
- [ ] T067 [P] Test edge case: empty task list display
- [ ] T068 [P] Test edge case: invalid ID handling across all commands
- [ ] T069 [P] Test edge case: maximum length validation for title and description
- [ ] T070 Create main.py application entry point in phase-01-console/src/main.py
- [ ] T071 Wire up dependency injection (repository → service → CLI)
- [ ] T072 Add exit functionality to CLI menu
- [ ] T073 Add welcome message and instructions to CLI
- [ ] T074 [P] Verify test coverage >90% for domain and application layers
- [ ] T075 [P] Update README.md with complete usage instructions
- [ ] T076 [P] Add quickstart examples to README.md

**Checkpoint**: Application is production-ready for Phase I scope

---

## Dependencies & Execution Strategy

### Story Dependencies

```
Foundation (Phase 2)
     ↓
US1 (Add Tasks) ───────────┐
     ↓                     │
US2 (View Tasks) ──────────┤
     ↓                     │
US3 (Complete Tasks) ──────┤── Can be built in parallel after Foundation
     ↓                     │
US4 (Update Tasks) ────────┤
     ↓                     │
US5 (Delete Tasks) ────────┘
     ↓
Polish (Phase 8)
```

**Critical Path**: Setup → Foundation → US1 → US2 → Polish

**Parallelizable**: US3, US4, US5 can be developed concurrently after US1 and US2

### Parallel Execution Opportunities

**Within Phase 1 (Setup)**:
- T003, T004, T005, T006 can run in parallel after T001-T002

**Within Phase 2 (Foundation)**:
- T010, T013, T014, T015 can run in parallel after T007-T009

**Across User Stories** (after Foundation):
- All test tasks marked [P] can run in parallel
- Model/entity tasks marked [P] can run in parallel
- Documentation tasks marked [P] can run in parallel

### MVP Scope Recommendation

**Minimum Viable Product**: Phase 1 + Phase 2 + Phase 3 + Phase 4
- Setup and foundation
- User Story 1 (Add Tasks)
- User Story 2 (View Tasks)

This delivers the core value proposition: users can create and view tasks.

**Next Increment**: Add Phase 5 (Complete Tasks) for progress tracking

**Full Feature Set**: All phases through Phase 8

---

## Implementation Strategy

### Test-Driven Development (TDD)

Per constitution Section 5, tests are **not optional**:

1. Write test (should fail)
2. Run test to confirm failure
3. Implement minimal code to pass
4. Refactor if needed
5. Verify test passes

### Task Execution Order

1. **Sequential within user story**: Tasks within a story phase must be done in order
2. **Independent across stories**: Different user stories can be built in parallel after foundation
3. **Parallel within phase**: Tasks marked [P] have no dependencies and can run concurrently

### Verification Checklist (Before marking any phase complete)

- [ ] All tests for the phase pass
- [ ] Code follows naming conventions (snake_case, PascalCase, verb_noun)
- [ ] No business logic in CLI layer
- [ ] Repository pattern properly implemented
- [ ] Error handling returns user-friendly messages
- [ ] Coverage >90% for domain and application layers (Phase 8)

---

## Final Validation

Before concluding implementation:

- [ ] All 75+ tests pass (unit + integration)
- [ ] All 5 user stories independently testable and functional
- [ ] No persistence mechanisms present (in-memory only)
- [ ] No future-phase features leaked
- [ ] Constitution compliance verified (naming, architecture, testing)
- [ ] README complete with setup and usage instructions
- [ ] Performance <2 seconds per operation (should be <100ms)

**Total Tasks**: 76
**By User Story**: US1 (11), US2 (8), US3 (9), US4 (11), US5 (8), Foundation (9), Setup (6), Polish (14)
**Parallel Opportunities**: 35 tasks marked [P]
**Test Tasks**: 30 (covering domain, application, integration)

---

## Ready for Implementation

✅ All tasks map to Phase I plan and specification
✅ All functional requirements covered (FR-001 through FR-010)
✅ Tests exist for domain and application logic
✅ System will be production-grade for Phase I scope
✅ Architecture supports evolution to Phase II-V

**Next Command**: `/sp.implement` to begin execution

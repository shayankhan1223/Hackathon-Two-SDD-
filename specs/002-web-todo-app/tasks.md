# Tasks: Web Todo Application (Phase II)

**Input**: Design documents from `/specs/002-web-todo-app/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/openapi.yaml

**Tests**: Test tasks included per constitution requirement (Section 5: Testing Constitution - Phase II)

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

Project structure based on plan.md:
- **Phase II root**: `phase-02-web/`
- **Backend**: `phase-02-web/backend/src/`
- **Frontend**: `phase-02-web/frontend/src/`
- **Tests**: `phase-02-web/backend/tests/`, `phase-02-web/frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and structure for backend + frontend

- [ ] T001 Create phase-02-web/ directory with backend/, frontend/, subdirectories
- [ ] T002 Create backend directory structure: src/domain, src/application, src/infrastructure, src/api, tests/
- [X] T003 Create frontend directory structure: src/, src/js, src/css, tests/
- [X] T004 Initialize backend pyproject.toml with FastAPI, uvicorn, pydantic, pytest dependencies
- [ ] T005 [P] Create all __init__.py files for backend package structure
- [ ] T006 [P] Copy CONSTITUTION.md to phase-02-web/
- [ ] T007 [P] Create phase-02-web/README.md with Phase II overview
- [ ] T008 [P] Create phase-02-web/backend/README.md with backend setup
- [X] T009 [P] Create phase-02-web/frontend/README.md with frontend setup
- [ ] T010 [P] Create CLAUDE.md with Phase II-specific context

**Checkpoint**: Basic project structure ready for development

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Copy Phase I domain logic and set up core infrastructure

**⚠️ CRITICAL**: This phase MUST complete before ANY user story work begins

- [ ] T011 Copy Task entity from phase-01-console/src/domain/task.py to phase-02-web/backend/src/domain/task.py
- [ ] T012 Copy TaskRepository interface from phase-01-console/src/domain/task_repository.py to phase-02-web/backend/src/domain/task_repository.py
- [ ] T013 Copy TaskService from phase-01-console/src/application/task_service.py to phase-02-web/backend/src/application/task_service.py
- [ ] T014 Copy exceptions from phase-01-console/src/application/exceptions.py to phase-02-web/backend/src/application/exceptions.py
- [ ] T015 Copy InMemoryTaskRepository from phase-01-console/src/infrastructure/in_memory_task_repository.py to phase-02-web/backend/src/infrastructure/in_memory_task_repository.py
- [ ] T016 [P] Copy Phase I unit tests to phase-02-web/backend/tests/unit/ (test_task.py, test_task_repository.py, test_task_service.py)
- [ ] T017 [P] Copy test fixtures from phase-01-console/tests/fixtures/ to phase-02-web/backend/tests/fixtures/
- [ ] T018 Run copied unit tests to verify Phase I logic works in Phase II context
- [X] T019 Create FastAPI app initialization in phase-02-web/backend/src/api/main.py with CORS configuration
- [X] T020 Create dependency injection setup in phase-02-web/backend/src/api/dependencies.py

**Checkpoint**: Foundation ready - Phase I logic verified, FastAPI initialized

---

## Phase 3: User Story 1 - Create Task via Web UI (Priority: P1) 🎯 MVP

**Goal**: Users can create tasks through browser, establishing core Phase II value

**Independent Test**: Open web UI, submit task with title/description, verify it appears in list via API and UI

### Backend API for User Story 1 ⚠️

- [X] T021 [P] [US1] Create CreateTaskRequest Pydantic model in phase-02-web/backend/src/api/models/task_request.py
- [X] T022 [P] [US1] Create TaskResponse Pydantic model in phase-02-web/backend/src/api/models/task_response.py
- [X] T023 [P] [US1] Create ErrorResponse Pydantic model in phase-02-web/backend/src/api/models/error_response.py
- [X] T024 [US1] Implement POST /tasks endpoint in phase-02-web/backend/src/api/routes/tasks.py
- [X] T025 [US1] Add HTTP exception handlers for domain errors in phase-02-web/backend/src/api/routes/tasks.py
- [ ] T026 [P] [US1] Write API test for POST /tasks success case in phase-02-web/backend/tests/api/test_tasks_api.py
- [ ] T027 [P] [US1] Write API test for POST /tasks with empty title (400 error) in phase-02-web/backend/tests/api/test_tasks_api.py
- [ ] T028 [P] [US1] Write API test for POST /tasks with title too long (400 error) in phase-02-web/backend/tests/api/test_tasks_api.py

### Frontend UI for User Story 1

- [X] T029 [US1] Create index.html with task creation form in phase-02-web/frontend/src/index.html
- [X] T030 [US1] Create API client module with createTask function in phase-02-web/frontend/src/js/api-client.js
- [X] T031 [US1] Implement task creation form handler in phase-02-web/frontend/src/js/task-manager.js
- [X] T032 [US1] Add success/error feedback display in UI for task creation
- [X] T033 [US1] Create basic CSS styling in phase-02-web/frontend/src/css/styles.css

**Checkpoint**: User Story 1 complete - users can create tasks via web UI

---

## Phase 4: User Story 2 - View Tasks via Web UI (Priority: P1)

**Goal**: Users can view all their tasks in browser with visual status indicators

**Independent Test**: Load web page, verify tasks display with titles, descriptions, and completion status

### Backend API for User Story 2 ⚠️

- [X] T034 [P] [US2] Create TaskListResponse Pydantic model in phase-02-web/backend/src/api/models/task_response.py
- [X] T035 [US2] Implement GET /tasks endpoint in phase-02-web/backend/src/api/routes/tasks.py
- [X] T036 [US2] Implement GET /tasks/{id} endpoint in phase-02-web/backend/src/api/routes/tasks.py
- [ ] T037 [P] [US2] Write API test for GET /tasks returns all tasks in phase-02-web/backend/tests/api/test_tasks_api.py
- [ ] T038 [P] [US2] Write API test for GET /tasks with empty list in phase-02-web/backend/tests/api/test_tasks_api.py
- [ ] T039 [P] [US2] Write API test for GET /tasks/{id} success in phase-02-web/backend/tests/api/test_tasks_api.py
- [ ] T040 [P] [US2] Write API test for GET /tasks/{id} with invalid ID (404 error) in phase-02-web/backend/tests/api/test_tasks_api.py

### Frontend UI for User Story 2

- [X] T041 [US2] Add task list container to index.html in phase-02-web/frontend/src/index.html
- [X] T042 [US2] Create API client getTasks and getTask functions in phase-02-web/frontend/src/js/api-client.js
- [X] T043 [US2] Implement renderTaskList function in phase-02-web/frontend/src/js/task-manager.js
- [X] T044 [US2] Add task list styling (completed/incomplete indicators) in phase-02-web/frontend/src/css/styles.css
- [X] T045 [US2] Implement page load handler to fetch and display tasks in phase-02-web/frontend/src/js/app.js
- [X] T046 [US2] Add empty state message when no tasks exist

**Checkpoint**: User Stories 1 AND 2 complete - MVP functional (create and view tasks)

---

## Phase 5: User Story 3 - Complete Task via Web UI (Priority: P2)

**Goal**: Users can toggle task completion status via checkbox in UI

**Independent Test**: Click task checkbox, verify status toggles and persists

### Backend API for User Story 3 ⚠️

- [X] T047 [US3] Implement PATCH /tasks/{id}/complete endpoint in phase-02-web/backend/src/api/routes/tasks.py
- [ ] T048 [P] [US3] Write API test for PATCH /tasks/{id}/complete success in phase-02-web/backend/tests/api/test_tasks_api.py
- [ ] T049 [P] [US3] Write API test for PATCH /tasks/{id}/complete with invalid ID (404) in phase-02-web/backend/tests/api/test_tasks_api.py

### Frontend UI for User Story 3

- [X] T050 [US3] Add completion checkbox to task list items in phase-02-web/frontend/src/index.html
- [X] T051 [US3] Create API client completeTask function in phase-02-web/frontend/src/js/api-client.js
- [X] T052 [US3] Implement checkbox toggle handler in phase-02-web/frontend/src/js/task-manager.js
- [X] T053 [US3] Add visual feedback for completion toggle (loading state, success/error)
- [X] T054 [US3] Update task list rendering to show completed status

**Checkpoint**: Core todo functionality complete (create, view, complete)

---

## Phase 6: User Story 4 - Update Task via Web UI (Priority: P3)

**Goal**: Users can edit task details through web interface

**Independent Test**: Edit task title/description, submit, verify changes persist

### Backend API for User Story 4 ⚠️

- [X] T055 [P] [US4] Create UpdateTaskRequest Pydantic model in phase-02-web/backend/src/api/models/task_request.py
- [X] T056 [US4] Implement PUT /tasks/{id} endpoint in phase-02-web/backend/src/api/routes/tasks.py
- [ ] T057 [P] [US4] Write API test for PUT /tasks/{id} update title in phase-02-web/backend/tests/api/test_tasks_api.py
- [ ] T058 [P] [US4] Write API test for PUT /tasks/{id} update description in phase-02-web/backend/tests/api/test_tasks_api.py
- [ ] T059 [P] [US4] Write API test for PUT /tasks/{id} with empty title (400) in phase-02-web/backend/tests/api/test_tasks_api.py
- [ ] T060 [P] [US4] Write API test for PUT /tasks/{id} with invalid ID (404) in phase-02-web/backend/tests/api/test_tasks_api.py

### Frontend UI for User Story 4

- [X] T061 [US4] Add edit button to each task in task list
- [X] T062 [US4] Create edit mode UI (inline editing or modal) in phase-02-web/frontend/src/index.html
- [X] T063 [US4] Create API client updateTask function in phase-02-web/frontend/src/js/api-client.js
- [X] T064 [US4] Implement edit task handler in phase-02-web/frontend/src/js/task-manager.js
- [X] T065 [US4] Add save/cancel buttons for edit mode
- [X] T066 [US4] Add validation feedback for empty title in edit mode

**Checkpoint**: Full task editing capability available

---

## Phase 7: User Story 5 - Delete Task via Web UI (Priority: P3)

**Goal**: Users can remove tasks from the system via web interface

**Independent Test**: Click delete button, confirm deletion, verify task removed from list

### Backend API for User Story 5 ⚠️

- [X] T067 [US5] Implement DELETE /tasks/{id} endpoint in phase-02-web/backend/src/api/routes/tasks.py
- [ ] T068 [P] [US5] Write API test for DELETE /tasks/{id} success (204) in phase-02-web/backend/tests/api/test_tasks_api.py
- [ ] T069 [P] [US5] Write API test for DELETE /tasks/{id} with invalid ID (404) in phase-02-web/backend/tests/api/test_tasks_api.py

### Frontend UI for User Story 5

- [X] T070 [US5] Add delete button to each task in task list
- [X] T071 [US5] Create API client deleteTask function in phase-02-web/frontend/src/js/api-client.js
- [X] T072 [US5] Implement delete task handler in phase-02-web/frontend/src/js/task-manager.js
- [X] T073 [US5] Add delete confirmation dialog (optional but recommended)
- [X] T074 [US5] Update task list after successful deletion

**Checkpoint**: All 5 user stories complete - full CRUD via web interface

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, edge cases, integration testing, documentation

- [ ] T075 [P] Add global error handler in FastAPI main.py for unexpected exceptions
- [ ] T076 [P] Write API test for 500 Internal Server Error handling in phase-02-web/backend/tests/api/test_error_handling.py
- [ ] T077 [P] Add API request logging (FastAPI middleware) for debugging
- [ ] T078 [P] Add CORS configuration for local development in phase-02-web/backend/src/api/main.py
- [ ] T079 [P] Create OpenAPI/Swagger documentation configuration in FastAPI main.py
- [X] T080 [P] Add loading indicators for all async operations in frontend
- [X] T081 [P] Implement error message display component in phase-02-web/frontend/src/js/task-manager.js
- [X] T082 [P] Add frontend error handling for network failures
- [X] T083 [P] Add frontend validation for form inputs (client-side)
- [ ] T084 Write backend integration tests in phase-02-web/backend/tests/integration/test_full_workflows.py
- [ ] T085 [P] Test edge case: Backend unavailable (frontend shows error)
- [ ] T086 [P] Test edge case: Invalid JSON response from backend
- [ ] T087 [P] Test edge case: Rapid multiple requests (double-click)
- [ ] T088 Create backend startup script or document uvicorn command
- [ ] T089 Create frontend server script or document python http.server command
- [ ] T090 [P] Verify backend test coverage >90% for domain/application/API layers
- [ ] T091 [P] Update phase-02-web/README.md with complete setup and usage instructions
- [ ] T092 [P] Add API usage examples (curl commands) to README
- [ ] T093 [P] Document known limitations and Phase II scope in README

**Checkpoint**: Application is production-ready for Phase II scope

---

## Dependencies & Execution Strategy

### Story Dependencies

```
Foundation (Phase 2)
     ↓
US1 (Create Task) ──────────┐
     ↓                      │
US2 (View Tasks) ───────────┤
     ↓                      │
US3 (Complete Task) ────────┤── Can be built in parallel after Foundation + US1 + US2
     ↓                      │
US4 (Update Task) ──────────┤
     ↓                      │
US5 (Delete Task) ──────────┘
     ↓
Polish (Phase 8)
```

**Critical Path**: Setup → Foundation → US1 → US2 → Polish

**Parallel After US2**: US3, US4, US5 can be developed concurrently

### Parallel Execution Opportunities

**Within Phase 1 (Setup)**:
- T005, T006, T007, T008, T009, T010 can run in parallel

**Within Phase 2 (Foundation)**:
- T016, T017 (copying tests) can run in parallel after T011-T015

**Backend API Tasks** (within each user story):
- All test writing tasks marked [P] can run in parallel
- Model creation tasks marked [P] can run in parallel

**Frontend Tasks**:
- CSS styling can be done in parallel with JavaScript logic
- Multiple UI components can be built in parallel

### MVP Scope Recommendation

**Minimum Viable Product**: Phase 1 + Phase 2 + Phase 3 + Phase 4
- Setup and foundation
- User Story 1 (Create Task via Web)
- User Story 2 (View Tasks via Web)

This delivers the core value: web-based task creation and viewing.

**Next Increment**: Add Phase 5 (Complete Task) for progress tracking

**Full Feature Set**: All phases through Phase 8

---

## Implementation Strategy

### Test-Driven Development (TDD)

Per constitution Section 5:

**Backend**:
1. Write API test (should fail)
2. Implement endpoint
3. Run test (should pass)
4. Refactor if needed

**Frontend**:
- Tests optional for Phase II (manual testing acceptable)
- Focus on backend API contract correctness

### Phase I Code Reuse Strategy

**DO NOT MODIFY** Phase I code when copying:
- Copy files exactly as-is
- Verify with diff if needed
- Phase I tests should pass unchanged in Phase II

**Benefit**: Demonstrates domain logic portability and proper layering

### Task Execution Order

1. **Sequential phases**: Complete each phase before moving to next
2. **Independent user stories**: After Foundation + US1 + US2, US3/US4/US5 can be parallel
3. **Parallel within phase**: Tasks marked [P] can run concurrently

### Verification Checklist (Before marking phase complete)

- [ ] All phase tests pass
- [ ] API endpoints return correct HTTP codes
- [ ] UI correctly displays backend state
- [ ] Error scenarios handled gracefully
- [ ] No business logic in API routes or frontend
- [ ] Coverage >90% for backend business logic
- [ ] README updated with setup instructions

---

## Backend Testing Requirements

Per constitution Section 5 (Phase II):

### Unit Tests (from Phase I - copied)
- Task entity tests
- Repository tests
- Service tests

### API Tests (NEW for Phase II)
- Endpoint success scenarios
- Validation error scenarios (400)
- Not found scenarios (404)
- Internal error scenarios (500)
- HTTP status code verification
- Response body schema validation

### Integration Tests
- Full CRUD workflows via API
- Error propagation from domain to HTTP
- State consistency across operations

**Coverage Target**: >90% for backend (domain, application, API layers)

---

## Frontend Testing Requirements

### Manual Testing (Primary for Phase II)
- All CRUD operations via browser
- Error message display
- Loading states
- Edge cases (empty list, network errors)

### Automated Tests (Optional)
- API client tests with mocked fetch
- DOM manipulation tests
- Event handler tests

---

## Final Validation

Before concluding implementation:

- [ ] All backend tests pass (unit + API + integration)
- [ ] All 5 user stories testable via browser
- [ ] Backend runs independently on localhost:8000
- [ ] Frontend runs independently and communicates with backend
- [ ] API documentation accessible at /docs
- [ ] No persistence mechanisms present
- [ ] No authentication/authorization present
- [ ] No AI or chatbot features present
- [ ] Constitution compliance verified (naming, architecture, testing)
- [ ] README complete with backend/frontend setup instructions
- [ ] Performance <2 seconds API response (<500ms UI feedback)

**Total Tasks**: 93
**By User Story**: US1 (13), US2 (13), US3 (8), US4 (12), US5 (8), Foundation (10), Setup (10), Polish (19)
**Parallel Opportunities**: 42 tasks marked [P]
**Test Tasks**: 18 backend API tests + copied Phase I tests

---

## Ready for Implementation

✅ All tasks map to Phase II plan and specification
✅ All functional requirements covered (FR-001 through FR-014)
✅ Backend and frontend independently testable
✅ System will be production-grade for Phase II scope
✅ Architecture supports evolution to Phase III-V

**Next Command**: `/sp.implement` to begin execution with backend-sub-agent and frontend-react-nextjs agents

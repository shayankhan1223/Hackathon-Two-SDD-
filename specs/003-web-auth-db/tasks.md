# Tasks: Multi-User Todo Application with Authentication & Database

**Feature**: 003-web-auth-db
**Input**: Design documents from `/specs/003-web-auth-db/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/openapi.yaml, research.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Tests**: Tests are included per the spec's Test-Driven Development requirement. Tests MUST be written FIRST and MUST FAIL before implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

This is a web application with:
- **Backend**: `backend/src/` (FastAPI + SQLModel)
- **Frontend**: `frontend/src/` (Next.js 14 App Router)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend directory structure per plan.md (backend/src/{domain,infrastructure,application,api}, backend/tests/{unit,integration})
- [ ] T002 Create frontend directory structure per plan.md (frontend/src/app, frontend/src/components, frontend/src/lib)
- [ ] T003 [P] Initialize backend Python project with requirements.txt (FastAPI, SQLModel, PyJWT, passlib, psycopg2, pytest)
- [ ] T004 [P] Initialize frontend Next.js project with package.json (Next.js 14, Better Auth, React 18, TypeScript)
- [ ] T005 [P] Create backend/.env.example with DATABASE_URL, JWT_SECRET, CORS_ORIGINS
- [ ] T006 [P] Create frontend/.env.local.example with NEXT_PUBLIC_API_URL, JWT_SECRET
- [ ] T007 [P] Setup linting for backend (flake8, black) in backend/
- [ ] T008 [P] Setup linting for frontend (ESLint, Prettier) in frontend/
- [ ] T009 [P] Create .gitignore for Python and Node.js in repository root
- [ ] T010 [P] Initialize Alembic for database migrations in backend/alembic/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Setup Neon PostgreSQL database and configure connection string in backend/.env
- [ ] T012 Create database session management in backend/src/infrastructure/database.py
- [ ] T013 [P] Create User SQLModel in backend/src/infrastructure/models.py (id, email, hashed_password, created_at)
- [ ] T014 [P] Create Task SQLModel in backend/src/infrastructure/models.py (id, user_id FK, title, description, completed, created_at, updated_at)
- [ ] T015 Generate initial Alembic migration for users and tasks tables in backend/alembic/versions/
- [ ] T016 Apply database migrations (alembic upgrade head)
- [ ] T017 Create password hashing utilities in backend/src/application/auth_service.py (bcrypt via passlib)
- [ ] T018 Create JWT generation function in backend/src/application/auth_service.py (PyJWT with HS256)
- [ ] T019 Create JWT verification function in backend/src/application/auth_service.py (validates signature and expiration)
- [ ] T020 Create JWT dependency for FastAPI in backend/src/api/deps.py (extracts user_id from Authorization header)
- [ ] T021 Create FastAPI app initialization in backend/src/api/main.py (CORS, routes, error handlers)
- [ ] T022 Create error response models in backend/src/api/main.py (RFC 7807 format: detail, error_code, status_code)
- [ ] T023 [P] Configure Better Auth with JWT plugin in frontend/src/lib/auth.ts (shared JWT secret)
- [ ] T024 [P] Create API client with JWT interceptor in frontend/src/lib/api-client.ts (Axios with Authorization header)
- [ ] T025 [P] Create TypeScript types in frontend/src/lib/types.ts (User, Task, AuthResponse, ErrorResponse)
- [ ] T026 [P] Create protected route middleware in frontend/src/middleware.ts (redirects to sign-in if no JWT)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration & Sign In (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts and authenticate to access the application

**Independent Test**: Open application, sign up with email/password, verify JWT issued, sign in with credentials, verify JWT stored, refresh page and remain signed in, sign out and verify token cleared

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T027 [P] [US1] Unit test for password hashing in backend/tests/unit/test_auth_service.py
- [ ] T028 [P] [US1] Unit test for JWT generation in backend/tests/unit/test_auth_service.py
- [ ] T029 [P] [US1] Unit test for JWT verification in backend/tests/unit/test_auth_service.py
- [ ] T030 [P] [US1] Integration test for sign-up endpoint in backend/tests/integration/test_auth_api.py (POST /api/auth/sign-up)
- [ ] T031 [P] [US1] Integration test for sign-in endpoint in backend/tests/integration/test_auth_api.py (POST /api/auth/sign-in)
- [ ] T032 [P] [US1] Integration test for invalid credentials in backend/tests/integration/test_auth_api.py (401 response)
- [ ] T033 [P] [US1] Integration test for duplicate email in backend/tests/integration/test_auth_api.py (409 response)
- [ ] T034 [P] [US1] Frontend test for sign-up flow in frontend/tests/auth.test.tsx
- [ ] T035 [P] [US1] Frontend test for sign-in flow in frontend/tests/auth.test.tsx
- [ ] T036 [P] [US1] Frontend test for token persistence in frontend/tests/auth.test.tsx

### Implementation for User Story 1

- [ ] T037 [US1] Implement sign-up endpoint in backend/src/api/auth.py (POST /api/auth/sign-up, hash password, create user, return JWT)
- [ ] T038 [US1] Implement sign-in endpoint in backend/src/api/auth.py (POST /api/auth/sign-in, verify password, return JWT)
- [ ] T039 [US1] Add validation for sign-up in backend/src/api/auth.py (email format, password min 8 chars)
- [ ] T040 [US1] Add error handling for auth endpoints in backend/src/api/auth.py (409 for duplicate email, 401 for invalid credentials)
- [ ] T041 [US1] Register auth routes in backend/src/api/main.py
- [ ] T042 [P] [US1] Create sign-up page in frontend/src/app/(auth)/sign-up/page.tsx (form with email/password)
- [ ] T043 [P] [US1] Create sign-in page in frontend/src/app/(auth)/sign-in/page.tsx (form with email/password)
- [ ] T044 [US1] Implement sign-up form submission in frontend/src/app/(auth)/sign-up/page.tsx (calls API, stores JWT, redirects)
- [ ] T045 [US1] Implement sign-in form submission in frontend/src/app/(auth)/sign-in/page.tsx (calls API, stores JWT, redirects)
- [ ] T046 [US1] Add client-side validation in frontend/src/app/(auth)/sign-up/page.tsx (email format, password min 8 chars)
- [ ] T047 [US1] Add error display for auth failures in frontend/src/app/(auth)/sign-in/page.tsx (401, 409 errors)
- [ ] T048 [US1] Implement sign-out functionality in frontend/src/components/Header.tsx (clear JWT, redirect to sign-in)
- [ ] T049 [US1] Test token persistence across page refreshes in frontend/

**Checkpoint**: User Story 1 complete - users can sign up, sign in, and sign out with JWT authentication

---

## Phase 4: User Story 2 - View Personal Task List (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can view their own tasks (and only their tasks) in a list

**Independent Test**: Sign in as User A, create 3 tasks, sign out, sign in as User B, create 2 tasks, verify User B sees only 2 tasks, sign in as User A and verify they see only 3 tasks

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T050 [P] [US2] Unit test for task filtering by user_id in backend/tests/unit/test_task_service.py
- [ ] T051 [P] [US2] Integration test for GET /api/{user_id}/tasks in backend/tests/integration/test_task_api.py (returns only user's tasks)
- [ ] T052 [P] [US2] Integration test for user isolation in backend/tests/integration/test_task_api.py (User A cannot see User B's tasks)
- [ ] T053 [P] [US2] Integration test for 401 when no JWT in backend/tests/integration/test_task_api.py
- [ ] T054 [P] [US2] Integration test for 403 when user_id mismatch in backend/tests/integration/test_task_api.py (URL user_id != JWT user_id)
- [ ] T055 [P] [US2] Frontend test for task list rendering in frontend/tests/tasks.test.tsx
- [ ] T056 [P] [US2] Frontend test for empty state in frontend/tests/tasks.test.tsx

### Implementation for User Story 2

- [ ] T057 [P] [US2] Create Task domain entity in backend/src/domain/task.py (business rules, ownership validation)
- [ ] T058 [US2] Implement TaskService in backend/src/application/task_service.py (get_user_tasks method with user_id filter)
- [ ] T059 [US2] Implement GET /api/{user_id}/tasks endpoint in backend/src/api/tasks.py (validate user_id matches JWT, call service)
- [ ] T060 [US2] Add user_id validation middleware in backend/src/api/tasks.py (403 if URL user_id != JWT user_id)
- [ ] T061 [US2] Register task routes in backend/src/api/main.py
- [ ] T062 [P] [US2] Create TaskList component in frontend/src/components/TaskList.tsx (displays tasks array)
- [ ] T063 [P] [US2] Create TaskCard component in frontend/src/components/TaskCard.tsx (renders single task)
- [ ] T064 [US2] Create task list page in frontend/src/app/tasks/page.tsx (fetches tasks, renders TaskList)
- [ ] T065 [US2] Add empty state UI in frontend/src/components/TaskList.tsx (friendly message when no tasks)
- [ ] T066 [US2] Add loading state in frontend/src/app/tasks/page.tsx
- [ ] T067 [US2] Add error handling for 401/403 in frontend/src/app/tasks/page.tsx (redirect to sign-in)
- [ ] T068 [US2] Style task list with Tailwind CSS in frontend/src/components/TaskList.tsx (responsive grid/list)

**Checkpoint**: User Story 2 complete - users can view their personal task list with proper isolation

---

## Phase 5: User Story 3 - Create Personal Tasks (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can create new tasks that are automatically associated with their account

**Independent Test**: Sign in, click "Add Task", enter title "Buy groceries" and description "Milk, eggs, bread", submit, verify task appears in list and is persisted in database with correct user_id

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T069 [P] [US3] Unit test for task creation in backend/tests/unit/test_task_service.py (validates user_id set correctly)
- [ ] T070 [P] [US3] Integration test for POST /api/{user_id}/tasks in backend/tests/integration/test_task_api.py (creates task)
- [ ] T071 [P] [US3] Integration test for validation errors in backend/tests/integration/test_task_api.py (400 for empty title)
- [ ] T072 [P] [US3] Integration test for title length validation in backend/tests/integration/test_task_api.py (400 for >200 chars)
- [ ] T073 [P] [US3] Integration test for user_id enforcement in backend/tests/integration/test_task_api.py (403 if user_id mismatch)
- [ ] T074 [P] [US3] Frontend test for task creation in frontend/tests/tasks.test.tsx

### Implementation for User Story 3

- [ ] T075 [US3] Add create_task method to TaskService in backend/src/application/task_service.py (validates and persists task)
- [ ] T076 [US3] Implement POST /api/{user_id}/tasks endpoint in backend/src/api/tasks.py (validates user_id, creates task)
- [ ] T077 [US3] Add request validation in backend/src/api/tasks.py (title required, max lengths)
- [ ] T078 [US3] Add automatic user_id assignment in backend/src/api/tasks.py (from JWT, not request body)
- [ ] T079 [P] [US3] Create TaskForm component in frontend/src/components/TaskForm.tsx (title, description inputs)
- [ ] T080 [US3] Create new task page in frontend/src/app/tasks/new/page.tsx (renders TaskForm)
- [ ] T081 [US3] Implement form submission in frontend/src/components/TaskForm.tsx (calls POST API with JWT)
- [ ] T082 [US3] Add client-side validation in frontend/src/components/TaskForm.tsx (title required, max 200 chars)
- [ ] T083 [US3] Add success feedback in frontend/src/app/tasks/new/page.tsx (redirect to task list on success)
- [ ] T084 [US3] Add error handling in frontend/src/components/TaskForm.tsx (display 400/401/403 errors)
- [ ] T085 [US3] Add "New Task" button to task list page in frontend/src/app/tasks/page.tsx

**Checkpoint**: User Story 3 complete - users can create tasks that persist and appear in their list

---

## Phase 6: User Story 4 - Update & Complete Personal Tasks (Priority: P2)

**Goal**: Authenticated users can edit task details and toggle completion status

**Independent Test**: Sign in, create task, edit title/description, verify changes persist, toggle completion multiple times, verify state persists across refreshes

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T086 [P] [US4] Unit test for task update in backend/tests/unit/test_task_service.py (validates ownership)
- [ ] T087 [P] [US4] Integration test for GET /api/{user_id}/tasks/{task_id} in backend/tests/integration/test_task_api.py
- [ ] T088 [P] [US4] Integration test for PATCH /api/{user_id}/tasks/{task_id} in backend/tests/integration/test_task_api.py (updates task)
- [ ] T089 [P] [US4] Integration test for completion toggle in backend/tests/integration/test_task_api.py
- [ ] T090 [P] [US4] Integration test for ownership validation in backend/tests/integration/test_task_api.py (403 for other user's task)
- [ ] T091 [P] [US4] Integration test for 404 on non-existent task in backend/tests/integration/test_task_api.py
- [ ] T092 [P] [US4] Frontend test for task edit in frontend/tests/tasks.test.tsx
- [ ] T093 [P] [US4] Frontend test for completion toggle in frontend/tests/tasks.test.tsx

### Implementation for User Story 4

- [ ] T094 [US4] Add get_task method to TaskService in backend/src/application/task_service.py (validates ownership)
- [ ] T095 [US4] Add update_task method to TaskService in backend/src/application/task_service.py (validates ownership, updates fields)
- [ ] T096 [US4] Implement GET /api/{user_id}/tasks/{task_id} endpoint in backend/src/api/tasks.py (return 403 if not owner)
- [ ] T097 [US4] Implement PATCH /api/{user_id}/tasks/{task_id} endpoint in backend/src/api/tasks.py (partial update)
- [ ] T098 [US4] Add immutable user_id validation in backend/src/api/tasks.py (prevent user_id changes)
- [ ] T099 [US4] Add updated_at timestamp update in backend/src/application/task_service.py
- [ ] T100 [US4] Create task detail page in frontend/src/app/tasks/[id]/page.tsx (displays single task, edit button)
- [ ] T101 [US4] Add edit mode to TaskForm in frontend/src/components/TaskForm.tsx (pre-fill values, PATCH instead of POST)
- [ ] T102 [US4] Create edit task page in frontend/src/app/tasks/[id]/edit/page.tsx (renders TaskForm in edit mode)
- [ ] T103 [US4] Add completion toggle checkbox in frontend/src/components/TaskCard.tsx (PATCH request on change)
- [ ] T104 [US4] Add optimistic UI update in frontend/src/components/TaskCard.tsx (update UI before API response)
- [ ] T105 [US4] Add error rollback in frontend/src/components/TaskCard.tsx (revert UI if PATCH fails)

**Checkpoint**: User Story 4 complete - users can edit and complete their tasks

---

## Phase 7: User Story 5 - Delete Personal Tasks (Priority: P3)

**Goal**: Authenticated users can permanently delete tasks they no longer need

**Independent Test**: Sign in, create task, delete with confirmation, verify removed from list and database, confirm deletion is permanent

### Tests for User Story 5 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T106 [P] [US5] Unit test for task deletion in backend/tests/unit/test_task_service.py (validates ownership)
- [ ] T107 [P] [US5] Integration test for DELETE /api/{user_id}/tasks/{task_id} in backend/tests/integration/test_task_api.py (204 response)
- [ ] T108 [P] [US5] Integration test for ownership validation in backend/tests/integration/test_task_api.py (403 for other user's task)
- [ ] T109 [P] [US5] Integration test for permanent deletion in backend/tests/integration/test_task_api.py (task gone from DB)
- [ ] T110 [P] [US5] Frontend test for delete confirmation in frontend/tests/tasks.test.tsx
- [ ] T111 [P] [US5] Frontend test for delete cancellation in frontend/tests/tasks.test.tsx

### Implementation for User Story 5

- [ ] T112 [US5] Add delete_task method to TaskService in backend/src/application/task_service.py (validates ownership, deletes)
- [ ] T113 [US5] Implement DELETE /api/{user_id}/tasks/{task_id} endpoint in backend/src/api/tasks.py (return 204 on success)
- [ ] T114 [US5] Add ownership validation in backend/src/api/tasks.py (403 if not owner)
- [ ] T115 [US5] Add 404 handling in backend/src/api/tasks.py (task not found or not owned)
- [ ] T116 [P] [US5] Create DeleteConfirmation component in frontend/src/components/DeleteConfirmation.tsx (modal with confirm/cancel)
- [ ] T117 [US5] Add delete button to TaskCard in frontend/src/components/TaskCard.tsx (opens confirmation modal)
- [ ] T118 [US5] Add delete button to task detail page in frontend/src/app/tasks/[id]/page.tsx
- [ ] T119 [US5] Implement delete handler in frontend/src/components/TaskCard.tsx (DELETE API call on confirm)
- [ ] T120 [US5] Remove deleted task from UI in frontend/src/app/tasks/page.tsx (optimistic update)
- [ ] T121 [US5] Add error handling for delete failures in frontend/src/components/TaskCard.tsx (403, 404 errors)

**Checkpoint**: User Story 5 complete - users can delete their tasks with confirmation

---

## Phase 8: End-to-End Verification & Security

**Purpose**: Validate complete user workflows and security guarantees

- [ ] T122 [P] End-to-end test: Sign up → Create task → View list → Sign out → Sign in → Task persists
- [ ] T123 [P] End-to-end test: User A creates task → User B cannot view/edit/delete it (403 errors)
- [ ] T124 [P] Security test: Verify JWT required for all task endpoints (401 without token)
- [ ] T125 [P] Security test: Verify expired JWT rejected (401 response)
- [ ] T126 [P] Security test: Verify tampered JWT rejected (401 response)
- [ ] T127 [P] Security test: Verify user_id in URL must match JWT (403 if mismatch)
- [ ] T128 [P] Security test: Verify passwords stored hashed (never plaintext)
- [ ] T129 [P] Performance test: Task list loads in <2 seconds for 100 tasks
- [ ] T130 [P] Performance test: API endpoints respond in <500ms p95
- [ ] T131 [P] Database test: Verify tasks persist across backend restarts
- [ ] T132 [P] Database test: Verify user isolation at database level (query returns only user's tasks)

---

## Phase 9: Documentation & Polish

**Purpose**: Finalize documentation and cross-cutting improvements

- [ ] T133 [P] Create backend README.md with setup instructions (virtualenv, dependencies, .env config, migrations)
- [ ] T134 [P] Create frontend README.md with setup instructions (npm install, .env.local config, dev server)
- [ ] T135 [P] Document API endpoints in backend/README.md (reference contracts/openapi.yaml)
- [ ] T136 [P] Document environment variables in backend/.env.example (with descriptions)
- [ ] T137 [P] Document environment variables in frontend/.env.local.example (with descriptions)
- [ ] T138 [P] Add security documentation in backend/docs/security.md (JWT flow, password hashing, user isolation)
- [ ] T139 [P] Add inline code comments for complex logic in backend/src/
- [ ] T140 [P] Add inline code comments for complex logic in frontend/src/
- [ ] T141 [P] Run linters and fix issues in backend/ (flake8, black)
- [ ] T142 [P] Run linters and fix issues in frontend/ (ESLint, Prettier)
- [ ] T143 [P] Verify quickstart.md steps work end-to-end
- [ ] T144 [P] Add architecture diagram to backend/docs/ (layers, JWT flow)
- [ ] T145 [P] Code cleanup: Remove debug logging, console.logs
- [ ] T146 [P] Code cleanup: Remove unused imports and dead code

---

## Phase 10: Final Validation

**Purpose**: Verify all requirements met before completion

- [ ] T147 Verify all User Story 1 acceptance scenarios pass
- [ ] T148 Verify all User Story 2 acceptance scenarios pass
- [ ] T149 Verify all User Story 3 acceptance scenarios pass
- [ ] T150 Verify all User Story 4 acceptance scenarios pass
- [ ] T151 Verify all User Story 5 acceptance scenarios pass
- [ ] T152 Verify JWT required on all task endpoints (no anonymous access)
- [ ] T153 Verify Neon PostgreSQL persistence works (restart backend, data persists)
- [ ] T154 Verify user isolation enforced (User A cannot access User B's data)
- [ ] T155 Verify no hardcoded secrets in code (all in .env files)
- [ ] T156 Verify all tests passing (backend and frontend)
- [ ] T157 Verify performance goals met (<500ms API, <2s task list)
- [ ] T158 Verify error responses follow RFC 7807 format
- [ ] T159 Run complete quickstart.md workflow from scratch
- [ ] T160 Final code review and sign-off

**✅ Phase II Complete**: Multi-user todo application with authentication and database persistence

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational (Phase 2) completion
  - User Story 1 (P1): Authentication foundation - BLOCKS User Stories 2, 3, 4, 5
  - User Story 2 (P1): View tasks - BLOCKS User Stories 3, 4, 5 (needs task list UI)
  - User Story 3 (P1): Create tasks - Independent after US2
  - User Story 4 (P2): Update tasks - Depends on US3 (needs tasks to exist)
  - User Story 5 (P3): Delete tasks - Depends on US3 (needs tasks to exist)
- **Verification (Phase 8)**: Depends on all MVP user stories (US1, US2, US3)
- **Documentation (Phase 9)**: Can start after MVP complete
- **Final Validation (Phase 10)**: Depends on all phases complete

### User Story Dependencies

- **User Story 1 (P1)**: Foundation for authentication - MUST complete first
- **User Story 2 (P1)**: Can start after US1 - provides task list UI
- **User Story 3 (P1)**: Can start after US2 - adds task creation to existing list
- **User Story 4 (P2)**: Depends on US3 (needs tasks to edit)
- **User Story 5 (P3)**: Depends on US3 (needs tasks to delete)

### Within Each User Story

1. Tests MUST be written FIRST and MUST FAIL before implementation
2. Backend models before services
3. Backend services before API endpoints
4. Frontend components before pages
5. Core functionality before error handling
6. Story validation at checkpoint before moving to next

### Parallel Opportunities

**Within Setup (Phase 1)**:
- T003, T004, T005, T006, T007, T008, T009, T010 can all run in parallel

**Within Foundational (Phase 2)**:
- T013, T014 (models) can run in parallel
- T017, T018, T019 (auth utilities) can run in parallel
- T023, T024, T025, T026 (frontend foundation) can run in parallel

**Within User Story 1**:
- All tests (T027-T036) can run in parallel
- Frontend pages (T042, T043) can run in parallel

**Within User Story 2**:
- All tests (T050-T056) can run in parallel
- Frontend components (T062, T063) can run in parallel

**Within User Story 3**:
- All tests (T069-T074) can run in parallel

**Within User Story 4**:
- All tests (T086-T093) can run in parallel

**Within User Story 5**:
- All tests (T106-T111) can run in parallel

**Across User Stories** (after Foundational complete):
- Once US1 complete, US2 and US3 can proceed in parallel
- US4 and US5 can proceed in parallel once US3 complete

**Phase 8-9**: All tasks can run in parallel (different concerns)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task T027: "Unit test for password hashing in backend/tests/unit/test_auth_service.py"
Task T028: "Unit test for JWT generation in backend/tests/unit/test_auth_service.py"
Task T029: "Unit test for JWT verification in backend/tests/unit/test_auth_service.py"
Task T030: "Integration test for sign-up endpoint in backend/tests/integration/test_auth_api.py"
Task T031: "Integration test for sign-in endpoint in backend/tests/integration/test_auth_api.py"

# Then launch frontend auth pages in parallel:
Task T042: "Create sign-up page in frontend/src/app/(auth)/sign-up/page.tsx"
Task T043: "Create sign-in page in frontend/src/app/(auth)/sign-in/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 3 Only)

1. **Complete Phase 1**: Setup → Foundation ready
2. **Complete Phase 2**: Foundational → Infrastructure ready
3. **Complete Phase 3**: User Story 1 → Authentication works
4. **VALIDATE**: Test sign-up, sign-in, sign-out independently
5. **Complete Phase 4**: User Story 2 → Task viewing works
6. **VALIDATE**: Test user isolation independently
7. **Complete Phase 5**: User Story 3 → Task creation works
8. **VALIDATE**: End-to-end test (sign up → create task → view list)
9. **Complete Phase 8**: Security validation
10. **Deploy MVP**: Working multi-user todo app with auth and persistence

### Incremental Delivery

- **Sprint 1**: Setup + Foundational + US1 → Users can authenticate
- **Sprint 2**: US2 → Users can view their tasks
- **Sprint 3**: US3 → Users can create tasks (MVP complete!)
- **Sprint 4**: US4 → Users can edit tasks
- **Sprint 5**: US5 + Polish → Users can delete tasks, documentation complete

### Parallel Team Strategy

With 3 developers after Foundational phase:

1. **Developer A**: User Story 1 (Authentication) - BLOCKING for others
2. Wait for US1 complete
3. **Developer A**: User Story 2 (View tasks)
4. **Developer B**: User Story 3 (Create tasks) - parallel with US2
5. **Developer C**: User Story 4 (Update tasks) - after US3
6. **Developer C**: User Story 5 (Delete tasks) - after US4

---

## Task Summary

- **Total Tasks**: 160
- **Setup Phase**: 10 tasks
- **Foundational Phase**: 16 tasks (BLOCKING)
- **User Story 1 (P1 MVP)**: 23 tasks (10 tests + 13 implementation)
- **User Story 2 (P1 MVP)**: 19 tasks (7 tests + 12 implementation)
- **User Story 3 (P1 MVP)**: 17 tasks (6 tests + 11 implementation)
- **User Story 4 (P2)**: 20 tasks (8 tests + 12 implementation)
- **User Story 5 (P3)**: 16 tasks (6 tests + 10 implementation)
- **Verification**: 11 tasks
- **Documentation**: 14 tasks
- **Final Validation**: 14 tasks

**MVP Scope** (US1 + US2 + US3): 69 tasks (Setup + Foundational + US1 + US2 + US3)

**Parallel Opportunities**:
- 57 tasks marked [P] for parallel execution
- User stories can proceed in parallel after dependencies met
- Tests within each story can all run in parallel

---

## Notes

- [P] tasks = different files, no dependencies within the group
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable
- Tests MUST be written FIRST and MUST FAIL before implementation (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All paths are absolute from repository root
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

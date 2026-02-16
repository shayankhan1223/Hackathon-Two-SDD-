---
id: 0002
title: generate-web-auth-db-tasks
stage: tasks
date: 2026-02-09
surface: agent
model: claude-sonnet-4-5-20250929
feature: 003-web-auth-db
branch: 003-web-auth-db
user: shayan
command: /sp.tasks
labels: ["tasks", "implementation", "tdd", "user-stories", "multi-user"]
links:
  spec: specs/003-web-auth-db/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/003-web-auth-db/tasks.md
tests:
 - 160 tasks total, including 37 test tasks (unit + integration) for TDD approach
---

## Prompt

```text
You are operating under the rules defined in **/sp.constitution**.
Tasks MUST be derived strictly from **/sp.plan (Phase II Improved)**.

---

## Task Group 0: Project Setup

- Create /phase-02-web/ structure
- Configure env variables:
  - DATABASE_URL
  - BETTER_AUTH_SECRET

---

## Task Group 1: Database & ORM

- Define SQLModel Task model
- Add user_id ownership
- Create DB session handling
- Write persistence tests

---

## Task Group 2: JWT Verification (Backend)

- Implement JWT verification middleware
- Extract user_id from token
- Reject invalid or expired tokens
- Write auth tests

---

## Task Group 3: Application Layer

- Implement task CRUD services
- Enforce ownership checks
- Write service-level tests

---

## Task Group 4: API Layer

- Implement REST endpoints
- Enforce JWT + user_id match
- Map errors to HTTP responses
- Write API integration tests

---

## Task Group 5: Frontend Authentication

- Configure Better Auth
- Enable JWT issuing
- Validate token lifecycle

---

## Task Group 6: Frontend API Client

- Attach JWT to requests
- Handle auth failures
- Test API client

---

## Task Group 7: Frontend UI

- Responsive task UI
- CRUD interactions
- Error handling states

---

## Task Group 8: End-to-End Verification

- Signup → Login → Create Task
- Refresh → Data persists
- Cross-user isolation test

---

## Task Group 9: Documentation

- README with setup steps
- Env configuration
- Security explanation

---

## Task Group 10: Final Validation

Verify:
- JWT required everywhere
- Neon DB persistence works
- User isolation enforced
- No phase leakage

Only then Phase II is DONE.
```

## Response snapshot

Generated comprehensive implementation tasks organized by user story priority (5 user stories: US1-US5) with Test-Driven Development approach. Created 160 tasks across 10 phases:

**Phase Structure:**
- Phase 1: Setup (10 tasks) - Project initialization, dependencies, linting
- Phase 2: Foundational (16 tasks) - Database, JWT auth, middleware (BLOCKS all user stories)
- Phase 3: User Story 1 - Authentication (23 tasks: 10 tests + 13 implementation)
- Phase 4: User Story 2 - View Tasks (19 tasks: 7 tests + 12 implementation)
- Phase 5: User Story 3 - Create Tasks (17 tasks: 6 tests + 11 implementation)
- Phase 6: User Story 4 - Update/Complete Tasks (20 tasks: 8 tests + 12 implementation)
- Phase 7: User Story 5 - Delete Tasks (16 tasks: 6 tests + 10 implementation)
- Phase 8: End-to-End Verification (11 security/performance tests)
- Phase 9: Documentation & Polish (14 tasks)
- Phase 10: Final Validation (14 acceptance checks)

**Key Features:**
- All tasks follow strict checklist format: `- [ ] [ID] [P?] [Story] Description with file path`
- 57 tasks marked [P] for parallel execution
- Tests MUST be written FIRST and MUST FAIL before implementation (TDD)
- Each user story independently testable at checkpoint
- MVP scope = 69 tasks (Setup + Foundational + US1 + US2 + US3)
- Clear dependencies: US1 blocks US2, US3; US3 blocks US4, US5

**User Stories Mapped:**
- US1 (P1 MVP): User registration & sign-in with JWT
- US2 (P1 MVP): View personal task list with user isolation
- US3 (P1 MVP): Create personal tasks
- US4 (P2): Update & complete tasks
- US5 (P3): Delete tasks with confirmation

**Technology Stack Implemented:**
- Backend: FastAPI + SQLModel + PyJWT + bcrypt + Neon PostgreSQL
- Frontend: Next.js 14 App Router + Better Auth + TypeScript
- Testing: pytest + Vitest + React Testing Library

## Outcome

- ✅ Impact: Created 160 implementation tasks organized by user story with TDD approach, enabling independent story delivery and parallel execution
- 🧪 Tests: 37 test tasks (unit + integration) with TDD requirement that tests MUST be written first and MUST fail before implementation
- 📁 Files: tasks.md with complete task breakdown, dependencies, parallel opportunities, and MVP strategy
- 🔁 Next prompts: /sp.implement to begin implementation, /sp.adr to document architectural decisions before coding
- 🧠 Reflection: User story organization enables incremental MVP delivery (US1+US2+US3 = 69 tasks) and parallel team execution after foundational phase

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A (task generation phase)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A

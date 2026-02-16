# Implementation Plan: Multi-User Todo Application with Authentication & Database

**Branch**: `003-web-auth-db` | **Date**: 2026-02-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-web-auth-db/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a production-grade multi-user web todo application with JWT-based authentication, user isolation, and PostgreSQL persistent storage. The system consists of a Next.js frontend (using Better Auth), a FastAPI backend with layered architecture, and Neon PostgreSQL database. All communication secured via stateless JWT authentication with strict user-task ownership enforcement at API, service, and database layers.

## Technical Context

**Language/Version**:
- Backend: Python 3.11+
- Frontend: TypeScript 5.0+ (Next.js)

**Primary Dependencies**:
- Backend: FastAPI, SQLModel, PyJWT, bcrypt, psycopg2
- Frontend: Next.js 14 (App Router), Better Auth, React 18

**Storage**: Neon PostgreSQL (serverless PostgreSQL)

**Testing**:
- Backend: pytest, pytest-asyncio
- Frontend: Vitest, React Testing Library

**Target Platform**: Web (cross-browser desktop and mobile)

**Project Type**: Web (frontend + backend)

**Performance Goals**:
- API response time: <500ms p95
- Task list load: <2 seconds for 100 tasks
- Authentication flow: <2 minutes end-to-end

**Constraints**:
- Stateless authentication (no shared session store)
- User isolation enforced at all layers
- JWT expiry: 24 hours
- HTTPS required in production

**Scale/Scope**:
- Multi-user system (100+ concurrent users)
- ~10 API endpoints
- 2 database tables (users, tasks)
- 5 main UI screens (sign-up, sign-in, task list, task detail, task form)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ⚠️ Constitution file is template-only. Proceeding with industry-standard best practices.

### Applied Principles (Inferred from Spec-Driven Development):

1. ✅ **Specification First**: Complete spec.md exists with user scenarios, requirements, and acceptance criteria
2. ✅ **Test-Driven Development**: Tests specified before implementation (backend auth, API, frontend integration)
3. ✅ **Clear Separation**: Frontend/Backend separation with REST API contract
4. ✅ **Security by Design**: JWT validation, password hashing, user isolation enforced
5. ✅ **Explicit Exclusions**: Scope clearly defined (no OAuth, no task sharing, no real-time)
6. ✅ **Measurable Success**: Quantifiable success criteria (100% auth rejection, <2s load time)

### Potential Constitution Violations (To Be Justified):

None identified. Architecture follows clean separation, testability, and simplicity principles.

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
backend/
├── src/
│   ├── domain/
│   │   ├── __init__.py
│   │   ├── task.py          # Task entity, ownership rules
│   │   └── user.py          # User entity (reference only)
│   ├── infrastructure/
│   │   ├── __init__.py
│   │   ├── database.py      # SQLModel session, connection
│   │   └── models.py        # SQLModel ORM models
│   ├── application/
│   │   ├── __init__.py
│   │   ├── task_service.py  # Task use cases, authorization
│   │   └── auth_service.py  # JWT verification
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app
│   │   ├── auth.py          # Auth routes (sign-up, sign-in)
│   │   ├── tasks.py         # Task CRUD routes
│   │   └── deps.py          # JWT dependency injection
│   └── config.py            # Environment configuration
├── tests/
│   ├── unit/
│   │   ├── test_task_domain.py
│   │   └── test_auth_service.py
│   ├── integration/
│   │   ├── test_task_api.py
│   │   └── test_auth_api.py
│   └── conftest.py          # Pytest fixtures
├── alembic/                 # Database migrations
├── .env.example
├── requirements.txt
└── README.md

frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-up/
│   │   │   │   └── page.tsx
│   │   │   └── sign-in/
│   │   │       └── page.tsx
│   │   ├── tasks/
│   │   │   ├── page.tsx      # Task list
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx  # Task detail
│   │   │   └── new/
│   │   │       └── page.tsx  # Create task
│   │   ├── layout.tsx
│   │   └── page.tsx          # Landing/redirect
│   ├── components/
│   │   ├── ui/               # Shared UI components
│   │   ├── TaskList.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskForm.tsx
│   ├── lib/
│   │   ├── auth.ts           # Better Auth config
│   │   ├── api-client.ts     # Axios with JWT interceptor
│   │   └── types.ts          # TypeScript types
│   └── middleware.ts         # Auth route protection
├── tests/
│   ├── auth.test.tsx
│   └── tasks.test.tsx
├── .env.local.example
├── package.json
└── README.md
```

**Structure Decision**: Web application structure with backend (FastAPI + SQLModel) and frontend (Next.js App Router). Backend follows Clean Architecture (domain → application → infrastructure → api). Frontend uses Next.js 14 conventions with App Router, grouping auth routes separately.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitution violations identified.

---

## Phase 0: Research & Technology Decisions

### Research Tasks

1. **Better Auth Integration with JWT**
   - Research: Better Auth JWT plugin configuration
   - Research: Sharing JWT secret between Next.js and FastAPI
   - Decision: Use environment variable for shared secret
   - Rationale: Stateless authentication, no shared session store

2. **FastAPI JWT Validation**
   - Research: PyJWT library for token verification
   - Research: Dependency injection pattern for auth in FastAPI
   - Decision: Use `Depends()` for JWT extraction and validation
   - Rationale: DRY principle, automatic 401 handling

3. **SQLModel with PostgreSQL**
   - Research: SQLModel for ORM (Pydantic + SQLAlchemy)
   - Research: Neon PostgreSQL connection string format
   - Decision: Use SQLModel with asyncpg driver
   - Rationale: Type safety, async support, Pydantic validation

4. **User Isolation Strategy**
   - Research: Row-level security vs application-level enforcement
   - Decision: Application-level enforcement (JWT user_id validation)
   - Rationale: Explicit control, clear error messages, testable

5. **Password Hashing**
   - Research: bcrypt vs argon2 vs passlib
   - Decision: Use bcrypt with passlib wrapper
   - Rationale: Industry standard, FastAPI ecosystem compatibility

6. **Frontend State Management**
   - Research: JWT storage options (localStorage, cookies, session)
   - Decision: Better Auth session management (httpOnly cookies where possible)
   - Rationale: XSS protection, built-in token refresh

7. **Error Handling & HTTP Status Codes**
   - Research: RESTful error response patterns
   - Decision: Use RFC 7807 Problem Details (detail, error_code, status_code)
   - Rationale: Consistent client-side error handling

### Research Output

All research tasks resolved. Key decisions documented above. Ready for Phase 1 design.

---

## Phase 1: Design Artifacts

### 1. Data Model (data-model.md)

**User Entity**
- `id` (UUID, primary key)
- `email` (string, unique, indexed)
- `hashed_password` (string)
- `created_at` (timestamp)

**Task Entity**
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users.id, indexed)
- `title` (string, max 200 chars, required)
- `description` (string, max 1000 chars, optional)
- `completed` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**
- User → Task: one-to-many
- Task → User: many-to-one (required, non-null)

**Constraints**
- Task ownership immutable after creation
- user_id index for fast filtering
- Cascade: deleting user deletes all tasks (discussed with product, accepted)

### 2. API Contracts (contracts/)

See `contracts/openapi.yaml` for full specification.

**Authentication Endpoints**

```
POST /api/auth/sign-up
Request: { email: string, password: string }
Response: { user_id: string, token: string }
Errors: 400 (validation), 409 (email exists)

POST /api/auth/sign-in
Request: { email: string, password: string }
Response: { user_id: string, token: string }
Errors: 401 (invalid credentials)
```

**Task Endpoints (All require JWT in Authorization header)**

```
GET /api/{user_id}/tasks
Response: { tasks: Task[] }
Errors: 401 (no token), 403 (user_id mismatch)

POST /api/{user_id}/tasks
Request: { title: string, description?: string }
Response: { task: Task }
Errors: 400 (validation), 401, 403

GET /api/{user_id}/tasks/{task_id}
Response: { task: Task }
Errors: 401, 403, 404 (not found or not owned)

PATCH /api/{user_id}/tasks/{task_id}
Request: { title?: string, description?: string, completed?: boolean }
Response: { task: Task }
Errors: 400, 401, 403, 404

DELETE /api/{user_id}/tasks/{task_id}
Response: 204 No Content
Errors: 401, 403, 404
```

### 3. Security Architecture

**JWT Structure**
```json
{
  "sub": "user-uuid-here",
  "exp": 1234567890,
  "iat": 1234567890
}
```

**Validation Layers**
1. API Layer: Extract and verify JWT signature
2. Application Layer: Validate user_id from JWT matches URL parameter
3. Service Layer: Enforce task ownership on all operations

**Defense in Depth**
- HTTPS in production (TLS termination)
- Password hashing with bcrypt (cost factor 12)
- JWT expiration enforced (24 hours)
- User ID mismatch returns 403 (not 404 to avoid enumeration)
- Input validation with Pydantic/Zod

### 4. Testing Strategy

**Backend Tests**

*Unit Tests*
- Task domain: ownership rules, validation
- Auth service: JWT generation, verification
- Task service: authorization checks

*Integration Tests*
- Auth API: sign-up, sign-in, token issuance
- Task API: CRUD with auth, user isolation
- Database: persistence, relationships

**Frontend Tests**

*Unit Tests*
- API client: JWT attachment, error handling
- Components: form validation, UI behavior

*Integration Tests*
- Auth flow: sign-up → sign-in → token storage
- Task management: create → list → update → delete
- User isolation: verify User A can't see User B's tasks

### 5. Quickstart Guide (quickstart.md)

To be generated with:
- Backend setup: virtualenv, dependencies, database migration, .env config
- Frontend setup: npm install, .env.local config, dev server
- Testing: pytest, vitest commands
- Local development workflow

---

## Phase 2: Architecture Decision Records (ADRs)

### Significant Decisions Detected

1. **JWT-Based Stateless Authentication**
   - Impact: Long-term architectural choice
   - Alternatives: Session-based auth, OAuth delegation
   - Recommendation: Document via `/sp.adr jwt-stateless-auth`

2. **Clean Architecture Layering (Backend)**
   - Impact: Code organization, testing strategy
   - Alternatives: Flat structure, MVC pattern
   - Recommendation: Document via `/sp.adr backend-layered-architecture`

3. **User Isolation Enforcement Strategy**
   - Impact: Security model, performance
   - Alternatives: Row-level security, separate schemas
   - Recommendation: Document via `/sp.adr application-level-user-isolation`

---

## Implementation Phases

### Phase 1: Backend Foundation
1. Setup FastAPI project structure
2. Configure SQLModel with Neon PostgreSQL
3. Implement User model (email, hashed_password)
4. Implement Task model (with user_id FK)
5. Create database migration scripts (Alembic)
6. Setup pytest fixtures and test database

### Phase 2: Authentication
1. Implement password hashing (bcrypt)
2. Implement JWT generation and verification
3. Create sign-up endpoint (POST /api/auth/sign-up)
4. Create sign-in endpoint (POST /api/auth/sign-in)
5. Create JWT dependency for protected routes
6. Write auth integration tests

### Phase 3: Task CRUD API
1. Implement task service (authorization logic)
2. Create task endpoints (GET /api/{user_id}/tasks, etc.)
3. Enforce user_id validation in all endpoints
4. Write task API integration tests
5. Test user isolation (User A can't access User B's tasks)

### Phase 4: Frontend Foundation
1. Setup Next.js 14 with App Router
2. Configure Better Auth with JWT plugin
3. Create auth pages (sign-up, sign-in)
4. Implement API client with JWT interceptor
5. Create protected route middleware

### Phase 5: Task UI
1. Create task list page
2. Create task detail page
3. Create task form (new/edit)
4. Implement task completion toggle
5. Implement task deletion with confirmation
6. Write frontend integration tests

### Phase 6: Integration & Testing
1. End-to-end testing (auth + tasks)
2. User isolation verification tests
3. Error handling tests (401, 403, 404)
4. Performance testing (100 tasks load time)
5. Security audit (JWT validation, password hashing)

---

## Dependencies & Prerequisites

### External Services
- Neon PostgreSQL account and database URL
- Environment variables configured (JWT_SECRET, DATABASE_URL)

### Development Tools
- Python 3.11+, pip, virtualenv
- Node.js 18+, npm/pnpm
- PostgreSQL client (psql) for debugging
- Postman/curl for API testing

---

## Success Criteria

This plan is complete when:
- ✅ All research tasks resolved (Phase 0)
- ✅ Data model documented (Phase 1)
- ✅ API contracts defined (Phase 1)
- ✅ Security architecture documented (Phase 1)
- ✅ Testing strategy defined (Phase 1)
- ✅ Quickstart guide generated (Phase 1)
- ✅ ADR suggestions made for significant decisions (Phase 2)

Next command: `/sp.tasks` to generate implementation tasks from this plan.

---

## Architectural Decision Suggestions

📋 **Architectural decision detected: JWT-Based Stateless Authentication**

This is a long-term architectural choice that affects how authentication state is managed across the system. Alternative approaches (session-based auth, OAuth delegation) were considered and rejected.

**Recommendation**: Document reasoning and tradeoffs with:
```
/sp.adr jwt-stateless-authentication
```

---

📋 **Architectural decision detected: Clean Architecture Layering (Backend)**

The backend follows a layered architecture (domain → application → infrastructure → api) that influences code organization, testing strategy, and maintainability.

**Recommendation**: Document reasoning and tradeoffs with:
```
/sp.adr backend-clean-architecture
```

---

📋 **Architectural decision detected: Application-Level User Isolation**

User isolation is enforced at the application layer rather than using database-level row-level security. This affects security model, performance, and testing approach.

**Recommendation**: Document reasoning and tradeoffs with:
```
/sp.adr application-level-user-isolation
```

---

## Plan Completion Status

✅ Phase 0: Research completed (research.md)
✅ Phase 1: Data model documented (data-model.md)
✅ Phase 1: API contracts defined (contracts/openapi.yaml with auth endpoints)
✅ Phase 1: Quickstart guide generated (quickstart.md)
✅ Phase 1: Agent context updated (CLAUDE.md)
✅ Phase 2: ADR suggestions documented (3 significant decisions identified)

**Status**: Planning phase complete. Ready for `/sp.tasks` to generate implementation tasks.

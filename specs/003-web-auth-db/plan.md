# Implementation Plan: Multi-User Todo Application with Authentication & Database

**Branch**: `003-web-auth-db`  
**Date**: 2026-02-09  
**Spec**: [spec.md](spec.md)  
**Phase**: II Upgrade  
**Type**: Enhancement (Authentication + Database Persistence)

## Executive Summary

Upgrade Phase II web todo application from in-memory, single-user to **authenticated multi-user system with PostgreSQL persistence**.

**Key Changes:**
- **Authentication**: Better Auth (Next.js) with JWT plugin → JWKS-based token verification
- **Database**: Neon PostgreSQL via SQLModel ORM → Persistent storage for users + tasks
- **Authorization**: JWT verification + user_id validation → Multi-layer user isolation
- **Security**: JWKS public key verification, password hashing (Better Auth), HTTPS in production

**Technology Stack:**
- **Frontend**: Next.js 16+, React 19, TypeScript, Better Auth, Tailwind CSS
- **Backend**: Python 3.13+, FastAPI, SQLModel, python-jose (JWT), psycopg2 (PostgreSQL driver)
- **Database**: Neon Serverless PostgreSQL (cloud-hosted, managed)

---

## Architecture Overview

### System Components

```
Browser
  ↓
Next.js Frontend (localhost:3000)
  ├─ Better Auth (/api/auth/*) → Issues JWT tokens
  └─ Task UI → Sends JWT in Authorization header
      ↓
FastAPI Backend (localhost:8000)
  ├─ JWT Middleware → Verifies via JWKS
  ├─ API Layer → Routes with auth
  ├─ Application Layer → TaskService (business logic)
  ├─ Domain Layer → Task entity (validation)
  └─ Infrastructure Layer → SQLModel Repository
      ↓
Neon PostgreSQL (cloud)
  ├─ users (Better Auth)
  ├─ sessions (Better Auth)
  ├─ jwks (Better Auth - JWT keys)
  └─ tasks (Application - with user_id FK)
```

### Authentication Flow

1. **User signs up/in** → Better Auth validates credentials
2. **Better Auth issues JWT** → Signed with private key (stored in `jwks` table)
3. **Frontend calls API** → Includes `Authorization: Bearer <JWT>` header
4. **Backend verifies JWT** → Fetches public keys from Better Auth JWKS endpoint
5. **Backend authorizes** → Validates path `user_id` matches JWT `user_id`
6. **Backend queries database** → Filters tasks by `user_id` (user isolation)

---

## Technical Decisions

### Decision 1: Better Auth with JWKS (vs Shared Secret)

**Chosen**: JWKS-based JWT verification  
**Rationale**:
- Industry standard for multi-service auth
- Supports key rotation (security best practice)
- Better Auth default (aligned with library design)
- No shared secret management needed

**Implementation**:
- Backend fetches public keys from `/api/auth/jwks`
- Cache JWKS for 1 hour (refresh on verification failure)
- Use python-jose for JWKS verification

### Decision 2: Unified Database (vs Separate Databases)

**Chosen**: Single Neon PostgreSQL database  
**Rationale**:
- Simpler setup (one connection string)
- Can use foreign key constraints (tasks.user_id → users.id)
- Consistent backups and monitoring
- Easier local development

**Schema**:
- Better Auth manages: `users`, `sessions`, `accounts`, `verification`, `jwks`
- Application manages: `tasks` (with `user_id` FK referencing Better Auth users)

### Decision 3: Synchronous SQLModel (vs Async)

**Chosen**: Synchronous SQLModel for Phase II  
**Rationale**:
- Simpler code (no async/await everywhere)
- Fewer dependencies (no asyncpg)
- Sufficient for local development
- Easier to test

**Future**: Migrate to async in Phase IV/V for production scalability

### Decision 4: Multi-Layer Authorization

**Chosen**: Enforce user isolation at 4 layers  
**Rationale**: Defense in depth

**Layers**:
1. **API Layer**: Validate path `user_id` == JWT `user_id` (403 if mismatch)
2. **Service Layer**: Pass `user_id` to all methods
3. **Repository Layer**: Filter all queries: `WHERE user_id = ?`
4. **Database Layer**: Foreign key constraints, indexes on `user_id`

---

## Critical Implementation Files

Based on architecture analysis, these 5 files are most critical:

1. **`/backend/src/api/middleware/auth.py`** - JWT verification via JWKS
2. **`/backend/src/infrastructure/sqlmodel_task_repository.py`** - PostgreSQL repository
3. **`/frontend/lib/auth.ts`** - Better Auth server configuration
4. **`/backend/src/api/routes/tasks.py`** - Authenticated API routes
5. **`/frontend/hooks/useAuth.ts`** - Frontend auth state management

---

## Project Structure

### Backend Enhancements

```
backend/src/
├── domain/
│   └── task.py              # ADD: user_id, created_at, updated_at
├── application/
│   └── task_service.py      # ADD: user_id parameter, authorization checks
├── infrastructure/
│   ├── database.py          # NEW: SQLModel engine, session management
│   └── sqlmodel_task_repository.py  # NEW: PostgreSQL implementation
├── api/
│   ├── main.py              # UPDATE: CORS, error handlers, startup (create tables)
│   ├── middleware/
│   │   ├── auth.py          # NEW: JWT verification
│   │   └── jwks_client.py   # NEW: JWKS fetching/caching
│   ├── routes/
│   │   └── tasks.py         # UPDATE: Add user_id path param, auth dependencies
│   └── dependencies.py      # NEW: get_current_user, verify_user_id
└── config.py                # NEW: Environment variables
```

### Frontend Enhancements

```
frontend/
├── app/
│   ├── (auth)/              # NEW: Auth route group
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   └── api/auth/[...all]/   # NEW: Better Auth catch-all route
│       └── route.ts
├── components/
│   └── auth/                # NEW: Auth components
│       ├── SignInForm.tsx
│       ├── SignUpForm.tsx
│       └── AuthGuard.tsx
├── lib/
│   ├── auth.ts              # NEW: Better Auth config
│   ├── auth-client.ts       # NEW: Better Auth client
│   └── api-client.ts        # UPDATE: Inject JWT header
└── hooks/
    ├── useTasks.ts          # UPDATE: Handle auth errors
    └── useAuth.ts           # NEW: Authentication hook
```

---

## Implementation Phases

### Phase 0: Research & Planning ✅ COMPLETE
- ✅ Technology research (Better Auth, SQLModel, Neon)
- ✅ Architecture design (JWKS-based auth, unified database)
- ✅ Created: `research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`, `plan.md`

### Phase 1: Database Setup
**Goal**: Neon PostgreSQL operational with Better Auth tables + tasks table

**Tasks**:
1. Create Neon database (dashboard)
2. Configure environment variables (backend + frontend `.env`)
3. Run Better Auth migrations: `npx @better-auth/cli migrate`
4. Implement `backend/src/infrastructure/database.py` (SQLModel engine)
5. Create SQLModel Task model with `user_id` FK
6. Implement auto-migration on startup (`SQLModel.metadata.create_all`)
7. Verify schema in Neon dashboard

**Acceptance**: Backend connects to database, all tables exist, no errors on startup

### Phase 2: Backend Authentication
**Goal**: FastAPI verifies JWT tokens via JWKS

**Tasks**:
1. Implement `api/middleware/jwks_client.py` (fetch/cache JWKS)
2. Implement `api/middleware/auth.py` (JWT verification)
3. Create `api/dependencies.py` (get_current_user, verify_user_id)
4. Update API routes to require authentication
5. Add authorization checks (user_id validation)
6. Update error responses (401, 403)
7. Write authentication tests

**Acceptance**: JWT verified, 401 for invalid tokens, 403 for user_id mismatch

### Phase 3: Backend Database Integration
**Goal**: Tasks persist to PostgreSQL with user isolation

**Tasks**:
1. Implement `infrastructure/sqlmodel_task_repository.py`
2. Update TaskService (add `user_id` to all methods)
3. Update Task entity (add `user_id`, timestamps)
4. Replace in-memory repository with SQLModel repository
5. Configure connection pooling
6. Write database integration tests

**Acceptance**: Tasks persist across restarts, user isolation enforced, tests pass

### Phase 4: Frontend Authentication
**Goal**: Users can sign up/in, JWT stored and sent to backend

**Tasks**:
1. Install Better Auth: `npm install better-auth`
2. Configure Better Auth (`lib/auth.ts`, `lib/auth-client.ts`)
3. Create Better Auth API route (`app/api/auth/[...all]/route.ts`)
4. Implement `useAuth` hook
5. Create sign-in/sign-up pages
6. Create AuthGuard component
7. Update app layout with auth provider

**Acceptance**: Users sign up/in, JWT issued, stored in sessionStorage, sign-out works

### Phase 5: Frontend API Integration
**Goal**: Frontend sends JWT, handles auth errors

**Tasks**:
1. Update API client to inject JWT header
2. Update `useTasks` hook (handle 401 → redirect, 403 → error message)
3. Update API calls to include `user_id` in URL
4. Test multi-user isolation in UI

**Acceptance**: API requests authenticated, 401 redirects to sign-in, User A can't see User B's tasks

### Phase 6: Testing & Documentation
**Goal**: Comprehensive tests, complete documentation

**Tasks**:
1. Write backend tests (unit, integration, API)
2. Write frontend tests (authentication flow)
3. End-to-end testing (all user stories)
4. Update READMEs (backend, frontend, root)
5. Validate quickstart guide

**Acceptance**: >80% test coverage, all user stories pass, quickstart works from scratch

---

## Testing Strategy

### Backend Tests

**Unit Tests** (`tests/unit/`):
- Domain: Task entity validation, user_id required
- Application: TaskService authorization logic

**Integration Tests** (`tests/integration/`):
- Database: SQLModel repository operations, user isolation
- Transactions: Rollback on errors

**API Tests** (`tests/api/`):
- Authentication: Valid/invalid/expired JWT handling
- Authorization: User A can't access User B's tasks
- CRUD: All task operations with auth headers

**Fixtures** (`tests/conftest.py`):
- Test database session
- Test users
- Valid/expired JWT tokens
- Task factories

### Frontend Tests

**Hook Tests** (`hooks/__tests__/`):
- `useAuth`: Sign up, sign in, sign out, JWT storage
- `useTasks`: Auth error handling (401, 403)

**Component Tests** (`components/__tests__/`):
- SignInForm: Form validation, submission
- AuthGuard: Redirect unauthenticated users

---

## Security Guarantees

### Authentication
- ✅ JWT signed with asymmetric keys (ES256/RS256)
- ✅ JWKS-based verification (supports key rotation)
- ✅ 24-hour token expiration
- ✅ Passwords hashed with bcrypt (Better Auth)
- ✅ Session cookies httpOnly + secure (production)

### Authorization
- ✅ Multi-layer user isolation (API, service, repository, database)
- ✅ Path `user_id` validated against JWT `user_id`
- ✅ Repository filters all queries by `user_id`
- ✅ Foreign key constraints enforce referential integrity

### Transport
- ⚠️ HTTP in local development (acceptable)
- ✅ HTTPS required in production (Vercel automatic)
- ✅ CORS configured (allow localhost:3000)

### Database
- ✅ Parameterized queries (SQLModel default)
- ✅ SSL/TLS connections (Neon sslmode=require)
- ✅ Connection pooling limits
- ✅ Credentials in environment variables

---

## Environment Configuration

### Backend `.env`
```bash
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require
JWKS_URL=http://localhost:3000/api/auth/jwks
BETTER_AUTH_ISSUER=http://localhost:3000
FRONTEND_URL=http://localhost:3000
DEBUG=true
```

### Frontend `.env.local`
```bash
BETTER_AUTH_SECRET=<generated-32-char-secret>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
NODE_ENV=development
```

---

## Success Criteria Mapping

### From Specification

✅ **SC-001**: 100% of API requests without valid JWT rejected (401)  
✅ **SC-002**: 100% of cross-user access attempts blocked (403)  
✅ **SC-003**: Passwords never stored in plaintext (bcrypt hashing)  
✅ **SC-004**: Users can sign up, sign in, access tasks within 2 minutes  
✅ **SC-005**: Tasks persist across sessions (PostgreSQL)  
✅ **SC-006**: Each user sees only their own tasks (user isolation)  
✅ **SC-007**: CRUD operations work without errors  
✅ **SC-008**: JWT expiration handled correctly (401 → redirect)  
✅ **SC-009**: Task list loads < 2 seconds (up to 100 tasks)  
✅ **SC-010**: New users complete first task within 3 minutes  
✅ **SC-011**: Clear, actionable error messages  
✅ **SC-012**: Zero data loss (PostgreSQL ACID guarantees)  
✅ **SC-013**: Task ownership immutable (user_id cannot change)  
✅ **SC-014**: Concurrent requests handled correctly (transactions)  

---

## Documentation Artifacts

All documentation for this feature is in `specs/003-web-auth-db/`:

1. **`spec.md`** - Feature specification (WHAT to build)
2. **`plan.md`** - This file (HOW to build it)
3. **`research.md`** - Technology research & decisions
4. **`data-model.md`** - Database schema & entities
5. **`contracts/openapi.yaml`** - Complete API specification
6. **`quickstart.md`** - Setup & testing guide (15-20 min)
7. **`checklists/requirements.md`** - Acceptance criteria

---

## Next Steps

**This plan is complete and ready for task breakdown.**

Run: `/sp.tasks`

This will generate a detailed task list (`tasks.md`) breaking down each implementation phase into atomic, testable tasks with:
- Task IDs (T001, T002, etc.)
- Clear descriptions
- File paths
- Dependencies (sequential vs parallel)
- Acceptance criteria
- Test requirements

**After `/sp.tasks` completes**, you can run `/sp.implement` to execute the implementation with specialized sub-agents (backend-sub-agent, frontend-react-nextjs).

---

**Plan Status**: ✅ Complete  
**Constitution Check**: ✅ All gates passed  
**Technology Research**: ✅ Complete  
**Architecture Design**: ✅ Complete  
**Ready for**: `/sp.tasks` command

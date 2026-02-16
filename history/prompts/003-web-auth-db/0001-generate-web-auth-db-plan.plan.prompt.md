---
id: 0001
title: generate-web-auth-db-plan
stage: plan
date: 2026-02-09
surface: agent
model: claude-sonnet-4-5-20250929
feature: 003-web-auth-db
branch: 003-web-auth-db
user: shayan
command: /sp.plan
labels: ["planning", "architecture", "authentication", "database", "multi-user"]
links:
  spec: specs/003-web-auth-db/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/003-web-auth-db/plan.md
 - specs/003-web-auth-db/research.md
 - specs/003-web-auth-db/data-model.md
 - specs/003-web-auth-db/contracts/openapi.yaml
 - specs/003-web-auth-db/quickstart.md
 - CLAUDE.md
tests:
 - none
---

## Prompt

```text
You are operating under the rules defined in **/sp.constitution**.
This plan MUST be derived strictly from **/sp.specify (Phase II Improved)**.

---

## 1. Architecture Overview

The system SHALL be split into:

1. Frontend (Next.js + Better Auth)
2. Backend (FastAPI + SQLModel)
3. Database (Neon PostgreSQL)

Communication occurs ONLY via REST APIs secured with JWT.

---

## 2. Frontend Plan

- Use Next.js App Router
- Configure Better Auth with JWT plugin
- Obtain JWT on login
- Store JWT securely (session-based)
- Attach JWT to all API requests
- Build responsive task UI

Frontend contains:
- Auth pages
- Task pages
- API client

---

## 3. Backend Plan

### Layers

1. API Layer
   - FastAPI routes
   - Dependency-based JWT verification

2. Application Layer
   - Task use cases
   - User authorization checks

3. Domain Layer
   - Task entity
   - Ownership rules

4. Infrastructure Layer
   - SQLModel
   - PostgreSQL session management

---

## 4. Authentication Flow

1. Frontend authenticates user via Better Auth
2. JWT issued using shared secret
3. Frontend sends JWT to backend
4. Backend verifies JWT
5. Backend extracts user ID
6. Backend authorizes request

---

## 5. Database Design (Conceptual)

- Users table (external identity reference)
- Tasks table:
  - id
  - title
  - description
  - completed
  - user_id (foreign key)

---

## 6. Error Handling

- 401 → Missing/invalid token
- 403 → User mismatch
- 404 → Task not found
- 400 → Validation errors

---

## 7. Testing Strategy

### Backend
- JWT verification tests
- API authorization tests
- SQLModel persistence tests

### Frontend
- Auth flow tests
- API client tests
- UI behavior tests

---

## 8. Security Guarantees

- Stateless auth
- No shared session DB
- Token expiry enforced
- User isolation guaranteed

---

## 9. Plan Readiness Check

Ensure:
- No in-memory storage
- JWT enforced everywhere
- DB used for all tasks
- Plan maps to spec

Otherwise STOP.
```

## Response snapshot

Executed complete planning workflow for multi-user todo application with authentication and database persistence. Created comprehensive planning artifacts including:

**Phase 0 - Research (research.md):**
- Researched Better Auth JWT integration with shared secret configuration
- Evaluated FastAPI JWT validation patterns using PyJWT and Depends() pattern
- Decided on SQLModel with asyncpg for type-safe PostgreSQL access
- Selected application-level user isolation (vs row-level security)
- Chose bcrypt for password hashing via passlib
- Selected Better Auth session management with httpOnly cookies
- Standardized error responses using RFC 7807 Problem Details format

**Phase 1 - Design Artifacts:**
- Data model (data-model.md): User and Task entities with relationships, constraints, validation rules, state transitions
- API contracts (contracts/openapi.yaml): Authentication endpoints (sign-up, sign-in) + Task CRUD endpoints with JWT auth
- Quickstart guide (quickstart.md): Complete setup instructions for backend (Python/FastAPI), frontend (Next.js), database (Neon PostgreSQL), testing, and troubleshooting
- Agent context updated (CLAUDE.md): Added Neon PostgreSQL technology reference

**Technical Architecture:**
- Backend: Clean Architecture layers (domain → application → infrastructure → api)
- Frontend: Next.js 14 App Router with Better Auth JWT plugin
- Database: PostgreSQL with SQLModel ORM, UUID primary keys, indexed foreign keys
- Security: JWT stateless auth, bcrypt password hashing, application-level user isolation
- Testing: pytest (backend), Vitest (frontend), unit + integration test strategy

**Phase 2 - ADR Suggestions:**
Identified 3 architecturally significant decisions requiring documentation:
1. JWT-Based Stateless Authentication (vs session-based, OAuth)
2. Clean Architecture Layering (vs flat structure, MVC)
3. Application-Level User Isolation (vs row-level security)

## Outcome

- ✅ Impact: Created complete implementation plan with research, data model, API contracts, quickstart guide, and ADR suggestions for multi-user authenticated todo application
- 🧪 Tests: none (planning phase - test strategy documented in plan)
- 📁 Files: plan.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md, CLAUDE.md updated
- 🔁 Next prompts: /sp.tasks to generate implementation tasks, /sp.adr for each significant architectural decision
- 🧠 Reflection: Comprehensive planning with explicit security model, user isolation strategy, and technology stack decisions documented for implementation

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A (planning phase)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A

# ADR-0003: Security and User Isolation Model

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-02-09
- **Feature:** 003-web-auth-db
- **Context:** Multi-user application requires strict data isolation to prevent users from accessing or modifying each other's tasks. The security model must defend against both accidental and malicious attempts to breach user boundaries.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security? YES
     2) Alternatives: Multiple viable options considered with tradeoffs? YES
     3) Scope: Cross-cutting concern (not an isolated detail)? YES
-->

## Decision

Adopt an **application-level user isolation model** with defense-in-depth validation:

**Isolation Strategy:**
- **Application-Level Enforcement**: Validate user ownership in application layer (not database-level RLS)
- **Multi-Layer Validation**: Validate at API layer AND service layer
- **Explicit Authorization**: Every task operation checks user ownership before execution

**Validation Layers:**

1. **API Layer** (`backend/src/api/tasks.py`):
   - Extract user_id from JWT (via `get_current_user` dependency)
   - Validate URL `{user_id}` parameter matches JWT `user_id`
   - Return 403 Forbidden if mismatch (before hitting service layer)

2. **Service Layer** (`backend/src/application/task_service.py`):
   - Filter all queries by user_id from JWT
   - Verify task ownership before update/delete operations
   - Return 403 or 404 if user doesn't own resource

3. **Database Layer** (`backend/src/infrastructure/models.py`):
   - Foreign key constraint: `task.user_id` → `users.id`
   - Indexed `user_id` column for fast filtering
   - Immutable ownership (user_id cannot be changed after creation)

**Security Practices:**

- **Password Security**: bcrypt hashing with cost factor 12 via passlib
- **Token Security**: JWT expiry enforced (24 hours), HTTPS required in production
- **Input Validation**: Pydantic models validate all inputs (title length, email format)
- **Error Responses**: 403 instead of 404 to avoid user enumeration
- **Audit Trail**: created_at and updated_at timestamps on all entities

## Consequences

### Positive

- **Testability**: Can unit test user isolation without database (mock user_id checks)
- **Explicit Security**: Authorization logic visible in code (not hidden in database config)
- **Clear Error Messages**: 403 responses include meaningful error_code (FORBIDDEN_USER_MISMATCH, FORBIDDEN_NOT_OWNER)
- **Framework Agnostic**: Not tied to PostgreSQL-specific features (could migrate to MySQL, etc.)
- **Debuggability**: Easy to trace authorization failures through application logs
- **Performance**: Indexed user_id enables fast filtering without RLS overhead
- **Multiple Validation Points**: API + Service layers provide defense in depth
- **Type Safety**: JWT user_id type-checked throughout call stack

### Negative

- **No Database-Level Safety Net**: Application bugs could leak data (RLS would prevent this)
- **Implementation Responsibility**: Developers must remember to validate ownership (not enforced by DB)
- **Testing Burden**: Must test authorization explicitly (vs automatic with RLS)
- **Repetitive Code**: user_id validation repeated across endpoints (mitigated with helpers)
- **Trust in Application**: Security relies entirely on correct application logic
- **Migration Risk**: If moving to microservices, must replicate checks across services

## Alternatives Considered

### Alternative A: PostgreSQL Row-Level Security (RLS)

**Components:**
- PostgreSQL RLS policies on tasks table
- Database enforces user_id filtering automatically
- Application sets session user_id variable

**Why Rejected:**
- **Testing Complexity**: Requires real PostgreSQL database for tests (no unit testing)
- **Debugging Difficulty**: RLS failures are opaque (just "no rows returned")
- **PostgreSQL Coupling**: Cannot migrate to other databases without rewriting security
- **Configuration Complexity**: RLS policies require PostgreSQL-specific knowledge
- **Learning Curve**: Team must understand PostgreSQL security model
- **Overkill**: RLS better suited for enterprise apps with complex permissions matrix

### Alternative B: Separate Database Schemas per User

**Components:**
- Each user gets own PostgreSQL schema
- Schema name derived from user_id
- Complete data isolation at DB level

**Why Rejected:**
- **Scalability**: Thousands of schemas for thousands of users (management nightmare)
- **Migration Complexity**: Schema changes must run against every user schema
- **Cross-User Queries**: Impossible to run analytics or aggregations
- **Connection Management**: Must manage schema-specific connections
- **Over-Engineering**: Designed for multi-tenant SaaS, not user data separation

### Alternative C: Database-Level Tenant ID with Views

**Components:**
- Tenant_id column on all tables
- Views filter by current session tenant_id
- Application queries views instead of tables

**Why Rejected:**
- **View Performance**: Additional layer can degrade query performance
- **Maintenance Burden**: Must maintain views in sync with tables
- **Limited Benefit**: Still requires application to set session variable correctly
- **Complexity**: More moving parts than direct application validation

### Alternative D: No User Isolation (Trust Frontend)

**Components:**
- Frontend filters tasks by user
- Backend serves all tasks without filtering
- Trust client-side security

**Why Rejected:**
- **Critical Security Flaw**: Users can trivially access other users' data via API
- **Regulatory Risk**: Violates data privacy requirements (GDPR, CCPA)
- **Trust Model**: Never trust client-side security for authorization
- **Spec Violation**: FR-006, FR-017 explicitly require server-side isolation

## References

- Feature Spec: `specs/003-web-auth-db/spec.md` (FR-006, FR-017, SC-002, NFR-004)
- Implementation Plan: `specs/003-web-auth-db/plan.md` (Security Architecture section, Phase 0 Research Item 4)
- Research Documentation: `specs/003-web-auth-db/research.md` (Section 4: User Isolation Strategy)
- Related ADRs: ADR-0001 (Authentication Strategy), ADR-0002 (Backend Architecture - depends on service layer)
- Security Testing: `specs/003-web-auth-db/tasks.md` (Phase 8: End-to-End Verification tasks T122-T132)
- Edge Cases: `specs/003-web-auth-db/spec.md` (User Isolation Breach Attempts scenario)

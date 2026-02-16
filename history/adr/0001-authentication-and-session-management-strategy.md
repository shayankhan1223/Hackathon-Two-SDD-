# ADR-0001: Authentication and Session Management Strategy

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-02-09
- **Feature:** 003-web-auth-db
- **Context:** Multi-user todo application requires secure authentication and session management to enable user isolation and protect task data. The system must support both frontend (Next.js) and backend (FastAPI) with shared authentication state.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security? YES
     2) Alternatives: Multiple viable options considered with tradeoffs? YES
     3) Scope: Cross-cutting concern (not an isolated detail)? YES
-->

## Decision

Adopt a **stateless JWT-based authentication strategy** with the following integrated components:

- **Authentication Method**: JWT (JSON Web Tokens) with HS256 signing algorithm
- **Frontend Library**: Better Auth with `@better-auth/jwt` plugin
- **Backend Validation**: PyJWT library with FastAPI dependency injection pattern
- **Token Storage**: Better Auth session management (httpOnly cookies with SameSite protection)
- **Shared Secret**: JWT_SECRET environment variable synchronized between frontend and backend
- **Token Expiration**: 24 hours
- **Token Payload**: Minimal claims (`sub` for user_id, `exp` for expiration, `iat` for issued-at)
- **Session State**: Stateless (no shared Redis/database for session storage)

## Consequences

### Positive

- **No Shared Infrastructure**: Eliminates need for Redis or session database, reducing operational complexity
- **Horizontal Scalability**: Backend can scale horizontally without session affinity requirements
- **Industry Standard**: JWT is widely understood, documented, and supported by security tools
- **Integrated Tooling**: Better Auth handles token lifecycle (issuance, refresh, expiration) automatically
- **Type Safety**: PyJWT provides clear API for validation with explicit error handling
- **Testability**: JWT validation can be tested independently without external dependencies
- **Cross-Domain**: JWT can work across different domains if needed for future expansion
- **Performance**: No database lookup on every request (validation via signature check only)

### Negative

- **Token Revocation Challenge**: Cannot revoke individual tokens before expiration without additional infrastructure (blacklist)
- **Token Size**: JWT tokens larger than session IDs (though still small at ~200-300 bytes)
- **Secret Management**: Requires secure JWT_SECRET distribution and rotation strategy
- **Stateless Tradeoff**: Cannot easily track active sessions or force logout across devices
- **24-Hour Window**: Compromised token valid for full 24 hours (mitigated by HTTPS requirement)
- **Shared Secret Dependency**: Frontend and backend must stay synchronized on JWT_SECRET
- **Token Theft Risk**: XSS attacks could steal tokens (mitigated by httpOnly cookies where possible)

## Alternatives Considered

### Alternative A: Session-Based Authentication with Shared Redis

**Components:**
- Redis for session storage
- Session IDs in httpOnly cookies
- Backend validates session ID against Redis

**Why Rejected:**
- Adds infrastructure dependency (Redis instance, monitoring, backups)
- Horizontal scaling requires sticky sessions or shared Redis cluster
- Additional operational complexity for multi-user todo app (over-engineered)
- Higher latency (network call to Redis on every request)

### Alternative B: OAuth 2.0 Delegation (Auth0, Clerk)

**Components:**
- Auth0 or Clerk as authentication provider
- Redirect-based OAuth flow
- Provider-issued tokens

**Why Rejected:**
- Spec requires custom authentication implementation (not delegation)
- Adds third-party dependency and potential costs
- Requires internet connectivity for token validation
- Over-engineered for application requirements (user owns their data, no SSO needed)

### Alternative C: Session-Based with Database Storage

**Components:**
- PostgreSQL sessions table
- Session IDs in cookies
- Backend validates against database

**Why Rejected:**
- Database becomes single point of failure for authentication
- Additional database queries on every request (performance impact)
- Complicates database schema with authentication concerns
- Less scalable than stateless JWT approach

## References

- Feature Spec: `specs/003-web-auth-db/spec.md` (FR-002, FR-003, FR-004, FR-005)
- Implementation Plan: `specs/003-web-auth-db/plan.md` (Phase 0, Research Item 1, 2, 6)
- Research Documentation: `specs/003-web-auth-db/research.md` (Sections 1, 2, 6)
- Related ADRs: ADR-0003 (Security & User Isolation Model)
- Security Requirements: NFR-001, NFR-003, NFR-010 in spec.md

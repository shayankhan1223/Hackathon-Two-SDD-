# ADR-0002: Backend Architecture and Data Access Strategy

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-02-09
- **Feature:** 003-web-auth-db
- **Context:** Backend must support authenticated multi-user task management with user isolation, database persistence, and testability. The architecture must be maintainable, scalable, and allow independent testing of business logic.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security? YES
     2) Alternatives: Multiple viable options considered with tradeoffs? YES
     3) Scope: Cross-cutting concern (not an isolated detail)? YES
-->

## Decision

Adopt a **Clean Architecture layered backend** with the following integrated components:

**Architecture Pattern:**
- **Domain Layer** (`backend/src/domain/`): Pure business logic, entities, ownership rules (no framework dependencies)
- **Application Layer** (`backend/src/application/`): Use cases, services, authorization logic (orchestrates domain)
- **Infrastructure Layer** (`backend/src/infrastructure/`): Database models, connections, external services (SQLModel, Neon PostgreSQL)
- **API Layer** (`backend/src/api/`): FastAPI routes, request/response handling, HTTP concerns

**Data Access:**
- **ORM**: SQLModel (Pydantic + SQLAlchemy) for type-safe database operations
- **Database**: Neon PostgreSQL (serverless PostgreSQL)
- **Async Driver**: asyncpg for non-blocking I/O
- **Migrations**: Alembic for schema versioning

**Framework:**
- **FastAPI**: Modern async Python web framework with automatic OpenAPI generation
- **Dependency Injection**: FastAPI `Depends()` for JWT validation, database sessions

**Testing:**
- **Unit Tests**: Domain and application layers (no database)
- **Integration Tests**: API + database with test fixtures

## Consequences

### Positive

- **Testability**: Business logic in domain layer testable without database or framework
- **Type Safety**: SQLModel provides Pydantic validation + SQLAlchemy ORM in single model
- **Separation of Concerns**: Clear boundaries between layers (easier to understand and modify)
- **Independent Evolution**: Can change database, framework, or business logic independently
- **Async Performance**: Non-blocking I/O with asyncpg improves throughput
- **Auto Documentation**: FastAPI generates OpenAPI spec automatically
- **Migration Safety**: Alembic provides version-controlled schema changes with rollback
- **Framework Agnostic Domain**: Business rules not coupled to FastAPI (easier to migrate if needed)
- **Editor Support**: Type hints enable autocomplete and static analysis

### Negative

- **Initial Boilerplate**: More files and layers than flat structure (domain, application, infrastructure, api)
- **Indirection**: Need to navigate through layers to understand full request flow
- **Learning Curve**: Team must understand Clean Architecture principles
- **Duplication Risk**: SQLModel models vs domain entities (though SQLModel reduces this)
- **Async Complexity**: Async/await adds cognitive overhead compared to synchronous code
- **PostgreSQL Coupling**: While domain is framework-agnostic, still tied to relational model
- **Over-Engineering Risk**: May be excessive for simple CRUD operations

## Alternatives Considered

### Alternative A: Flat Structure with Direct Database Access

**Components:**
- Single-layer Flask/FastAPI app
- SQLAlchemy models = business logic
- Controllers directly query database

**Why Rejected:**
- Business logic tightly coupled to database and framework
- Difficult to test without database (slower tests)
- Changes ripple across codebase (modify DB model affects all consumers)
- No clear separation of concerns (HTTP, business, persistence mixed)

### Alternative B: MVC Pattern

**Components:**
- Models: Database entities
- Views: API response formatting
- Controllers: Request handling + business logic

**Why Rejected:**
- Controllers become fat (business logic + HTTP concerns)
- Models are anemic (just data holders, no behavior)
- Business logic not isolated (harder to test independently)
- Traditional MVC better for server-rendered apps, less suited for REST APIs

### Alternative C: Repository Pattern with Service Layer

**Components:**
- Repositories: Data access abstraction
- Services: Business logic
- Controllers: API routes

**Why Rejected:**
- Repository pattern adds abstraction without clear benefit for small app
- SQLModel already provides sufficient abstraction over database
- Additional layer increases boilerplate
- For this scale, Clean Architecture provides enough separation without extra patterns

### Alternative D: Django ORM with Django REST Framework

**Components:**
- Django ORM for database
- Django REST Framework for API
- Django project structure

**Why Rejected:**
- Heavier framework with more conventions and "magic"
- Django ORM less type-safe than SQLModel (no Pydantic integration)
- Synchronous by default (async support more complex)
- FastAPI provides better OpenAPI integration and modern async support

## References

- Feature Spec: `specs/003-web-auth-db/spec.md` (NFR-002 to NFR-007 for architecture requirements)
- Implementation Plan: `specs/003-web-auth-db/plan.md` (Project Structure, Backend Layers section)
- Research Documentation: `specs/003-web-auth-db/research.md` (Section 3: SQLModel with PostgreSQL)
- Data Model: `specs/003-web-auth-db/data-model.md` (Entity definitions, SQLModel examples)
- Related ADRs: ADR-0003 (Security & User Isolation Model - depends on service layer)
- Testing Strategy: `specs/003-web-auth-db/plan.md` (Phase 1, section 4)

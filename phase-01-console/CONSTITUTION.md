<!-- SYNC IMPACT REPORT:
Version change: N/A (initial version) → 1.0.0
Modified principles: N/A (creating from scratch)
Added sections: All sections from user input
Removed sections: Template placeholders
Templates requiring updates: N/A (initial creation)
Follow-up TODOs: None
-->
# Spec-Driven Todo System (Hackathon II) Constitution

## 1. Core Philosophy

This project MUST be developed using **strict Spec-Driven Development (SDD)**.

The AI agent (Claude Code) is NOT a code writer but a **Spec Executor**.

Rules:
- No implementation is allowed without an approved specification.
- Code MUST be generated exclusively from specs using `/sp.specify → /sp.plan → /sp.tasks`.
- Manual coding is strictly forbidden.
- If a requirement is unclear, the spec must be refined BEFORE implementation.

The system must evolve iteratively across 5 phases while preserving architectural integrity.

---

## 2. Phase Isolation & Folder Structure

Each phase MUST live in its own top-level folder and MUST be independently runnable and testable.

/phase-01-console/
/phase-02-web/
/phase-03-chatbot/
/phase-04-kubernetes/
/phase-05-cloud/

Rules:
- No cross-phase code reuse unless explicitly promoted via spec.
- Each phase must be self-contained.
- Each phase must include:
  - `CONSTITUTION.md` (this file)
  - `CLAUDE.md`
  - `/specs/`
  - `/src/`
  - `/tests/`
  - `README.md`

---

## 3. Naming Conventions (All Phases)

### General
- Files: `snake_case` (Python), `kebab-case` (infra), `camelCase` (TypeScript)
- Classes: `PascalCase`
- Functions: `verb_noun` (e.g., `create_task`)
- Tests: `test_<feature>_<behavior>.py|ts`

### Domain-Driven Naming
- Use **Task**, **Conversation**, **Message**, **Event** as canonical domain entities
- Avoid generic names like `data`, `item`, `handler`

---

## 4. Code Quality & Architecture Rules

All generated code MUST be:

- Readable
- Modular
- Scalable
- Testable
- Production-ready

### Mandatory Principles
- Single Responsibility Principle
- Clear separation of:
  - Domain logic
  - Infrastructure
  - Transport (API / CLI / MCP)
- No business logic inside controllers/routes
- No hard-coded configuration values

---

## 5. Testing Constitution (Critical)

Testing is **not optional**.

### Testing Rules
- Every phase MUST have its own `/tests` directory
- Tests MUST be generated alongside implementation
- Tests MUST pass before a phase is considered complete

### Test Types Per Phase

#### Phase I (Console)
- Unit tests for task CRUD logic
- In-memory state tests
- Edge cases (invalid IDs, empty list)

#### Phase II (Web)
- Backend:
  - Unit tests (services)
  - API tests (FastAPI TestClient)
- Frontend:
  - Component tests
  - API integration mocks

#### Phase III (Chatbot)
- MCP tool tests
- Agent behavior tests
- Conversation state persistence tests

#### Phase IV (Kubernetes)
- Helm template validation
- Container health checks
- Deployment smoke tests

#### Phase V (Cloud)
- Event flow tests (Kafka/Dapr)
- Service-to-service integration tests
- Failure and retry tests

---

## 6. Specification Hierarchy (Spec-Kit Law)

Specs MUST be organized and respected in the following order:

1. Constitution (this document)
2. Phase Overview Spec
3. Feature Specs
4. API / MCP Specs
5. Infrastructure Specs

If two specs conflict, **higher-level spec wins**.

---

## 7. Spec Quality Standards

Every spec MUST include:

- Purpose
- Scope
- User stories
- Acceptance criteria
- Non-functional requirements
- Explicit exclusions

Vague language is forbidden.
Words like *“maybe”*, *“should try”*, *“ideally”* are not allowed.

---

## 8. AI Agent Behavior Constraints

The AI agent MUST:

- Read all relevant specs before acting
- Never assume missing requirements
- Ask for spec clarification instead of guessing
- Generate minimal but complete code
- Prefer clarity over cleverness

The agent MUST NOT:
- Over-engineer
- Introduce unused abstractions
- Skip tests
- Skip documentation

---

## 9. Production Readiness Mandate

Every phase must be production-grade **for its scope**.

This includes:
- Proper error handling
- Logging
- Config via environment variables
- Deterministic behavior
- Clear README instructions

---

## 10. Evolution Guarantee

Earlier architectural decisions MUST NOT block later phases.

Specifically:
- Phase I must not prevent persistence
- Phase II must not prevent AI tooling
- Phase III must not prevent Kubernetes
- Phase IV must not prevent cloud scalability
- Phase V must support event-driven expansion

---

## 11. Final Authority Rule

If implementation output violates:
- This Constitution
- The active phase spec
- Spec-Driven Development principles

The implementation MUST be rejected and regenerated after spec correction.

---

**This Constitution is immutable across all phases.**
All evolution happens through `/sp.specify`, not by changing this document.

**Version**: 1.0.0 | **Ratified**: 2026-02-09 | **Last Amended**: 2026-02-09
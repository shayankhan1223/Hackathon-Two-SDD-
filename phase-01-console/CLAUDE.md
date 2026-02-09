# Claude Code Rules - Phase I Console Todo App

## Context

This is Phase I of a multi-phase Spec-Driven Development (SDD) project. You are working on the console-based todo application.

## Phase I Specific Rules

### Scope
- In-memory storage only (no databases, no files)
- Console interface only (no web, no API)
- Single-user, single-session
- Python 3.13+ with standard library only
- No external dependencies except pytest

### File Locations
All Phase I code lives in `/phase-01-console/`:
- Source: `/phase-01-console/src/`
- Tests: `/phase-01-console/tests/`
- Specs: `/specs/001-console-todo-app/`

### Architecture Requirements
- Domain layer: Pure Python, no dependencies
- Application layer: Business logic, uses domain only
- Infrastructure layer: In-memory implementation
- Interface layer: CLI only, no business logic

### Test-Driven Development (TDD)
1. Write tests FIRST (they should FAIL)
2. Run tests to confirm failure
3. Implement minimal code to pass tests
4. Refactor if needed
5. Verify tests pass

### Code Standards
- snake_case for files and functions
- PascalCase for classes
- verb_noun for function names (create_task, delete_task)
- Type hints for ALL function signatures
- Docstrings for classes and public methods
- No global state, use dependency injection

### Task Execution
- Execute tasks from `specs/001-console-todo-app/tasks.md` in sequential order
- Mark tasks as [X] when complete
- Follow the phase order: Setup → Foundation → US1 → US2 → US3 → US4 → US5 → Polish

### Quality Gates
- All tests must pass before moving to next phase
- >90% test coverage for domain and application layers
- No business logic in CLI layer
- All validation in domain/application layers

## Related Documents
- Constitution: `/phase-01-console/CONSTITUTION.md`
- Spec: `/specs/001-console-todo-app/spec.md`
- Plan: `/specs/001-console-todo-app/plan.md`
- Tasks: `/specs/001-console-todo-app/tasks.md`
- Data Model: `/specs/001-console-todo-app/data-model.md`

## User Stories Priority
1. US1: Add New Tasks (P1) - MVP
2. US2: View All Tasks (P1) - MVP
3. US3: Complete Tasks (P2)
4. US4: Update Task Details (P3)
5. US5: Delete Tasks (P3)

## Current Implementation Status
Refer to tasks.md for current progress tracking.

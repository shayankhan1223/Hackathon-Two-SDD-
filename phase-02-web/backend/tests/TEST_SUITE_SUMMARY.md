# Phase II Backend Test Suite - Complete Summary

**Created**: 2026-02-09
**Purpose**: Comprehensive test coverage for Phase II Web Todo Application Backend
**Framework**: pytest + FastAPI TestClient
**Test Strategy**: TDD (Test-Driven Development)

---

## 📊 Test Suite Overview

| Category | Files | Test Classes | Test Methods | Coverage Target |
|----------|-------|--------------|--------------|-----------------|
| **API Endpoints** | 1 | 8 | ~30 | 100% API routes |
| **Error Handling** | 1 | 7 | ~20 | 100% error paths |
| **Pydantic Models** | 1 | 8 | ~40 | 100% validation |
| **Integration** | 1 | 6 | ~25 | 100% full-stack |
| **Phase I Unit Tests** | 3 | ~12 | ~50 | 100% domain/app/infra |
| **TOTAL** | **7** | **41** | **~165** | **>95% backend** |

---

## 📁 Test Structure

```
phase-02-web/backend/tests/
├── api/                              # Phase II API Layer Tests (NEW)
│   ├── __init__.py
│   ├── conftest.py                   # Shared fixtures (TestClient, helpers)
│   ├── test_tasks_api.py             # Main endpoint tests (~30 tests)
│   ├── test_error_handling.py        # Error scenarios (~20 tests)
│   └── test_pydantic_models.py       # Data validation (~40 tests)
│
├── integration/                       # Full-stack integration tests (NEW)
│   ├── __init__.py
│   └── test_full_stack.py            # Complete workflows (~25 tests)
│
├── unit/                             # Phase I tests (REUSED)
│   ├── test_task.py                  # Domain entity tests
│   ├── test_task_service.py          # Application service tests
│   └── test_task_repository.py       # Repository tests
│
├── API_TESTS_README.md               # API test documentation
└── TEST_SUITE_SUMMARY.md             # This file
```

---

## 🎯 Test Coverage by Layer

### 1. API Layer Tests (tests/api/)

#### test_tasks_api.py (Main API Tests)
**Purpose**: Validate all REST API endpoints for task management

| Test Class | Endpoint | Tests | Focus |
|------------|----------|-------|-------|
| `TestCreateTaskEndpoint` | POST /tasks | 8 | Creation, validation, error cases |
| `TestListTasksEndpoint` | GET /tasks | 3 | Listing, empty state, filtering |
| `TestGetSingleTaskEndpoint` | GET /tasks/{id} | 3 | Retrieval, 404, invalid UUID |
| `TestUpdateTaskEndpoint` | PUT /tasks/{id} | 7 | Updates, validation, 404 |
| `TestCompleteTaskEndpoint` | PATCH /tasks/{id}/complete | 3 | Toggle completion |
| `TestDeleteTaskEndpoint` | DELETE /tasks/{id} | 5 | Deletion, verification |
| `TestAPIEndToEndWorkflows` | All endpoints | 3 | Complete CRUD workflows |
| `TestAPIErrorScenarios` | Various | 3 | Edge cases, duplicates |

**Key Tests**:
- ✅ Valid task creation returns 201 with task data
- ✅ Empty title returns 400 with error code
- ✅ Title >200 chars rejected
- ✅ Description >1000 chars rejected
- ✅ Missing title field returns 422
- ✅ Non-existent ID returns 404
- ✅ Invalid UUID format returns 422
- ✅ Complete CRUD lifecycle workflow
- ✅ Multiple tasks workflow
- ✅ State persistence across operations

#### test_error_handling.py (Error Scenarios)
**Purpose**: Ensure proper error responses and HTTP status codes

| Test Class | Focus | Tests |
|------------|-------|-------|
| `TestErrorResponseStructure` | Error format validation | 3 |
| `TestValidationErrors` | Input validation (400) | 4 |
| `TestNotFoundErrors` | Resource not found (404) | 4 |
| `TestInternalServerErrors` | Unexpected errors (500) | 2 |
| `TestCORSConfiguration` | CORS headers | 2 |
| `TestAPIResponseSchemas` | Response schema validation | 3 |
| `TestHTTPStatusCodes` | Status code verification | 3 |

**Key Tests**:
- ✅ 404 error has detail, error_code, status_code
- ✅ 400 error has correct structure
- ✅ Error messages are user-friendly (no stack traces)
- ✅ All validation errors return 400
- ✅ All not-found scenarios return 404
- ✅ Pydantic validation errors return 422
- ✅ CORS headers present for allowed origins
- ✅ TaskResponse schema matches OpenAPI spec
- ✅ ErrorResponse schema consistent

#### test_pydantic_models.py (Data Validation)
**Purpose**: Test Pydantic request/response models

| Test Class | Model | Tests | Focus |
|------------|-------|-------|-------|
| `TestCreateTaskRequest` | CreateTaskRequest | 9 | Title/description validation |
| `TestUpdateTaskRequest` | UpdateTaskRequest | 9 | Partial update validation |
| `TestTaskResponse` | TaskResponse | 4 | Response serialization |
| `TestTaskListResponse` | TaskListResponse | 4 | Array response format |
| `TestErrorResponse` | ErrorResponse | 5 | Error response structure |
| `TestModelValidation` | All models | 2 | Schema generation |

**Key Tests**:
- ✅ CreateTaskRequest validates title (required, 1-200 chars)
- ✅ CreateTaskRequest validates description (optional, max 1000 chars)
- ✅ UpdateTaskRequest allows partial updates
- ✅ TaskResponse serializes UUID correctly
- ✅ TaskListResponse count matches array length
- ✅ ErrorResponse includes all required fields
- ✅ All models generate valid JSON schemas

---

### 2. Integration Tests (tests/integration/)

#### test_full_stack.py (Full-Stack Integration)
**Purpose**: Verify complete flow through all architectural layers

| Test Class | Focus | Tests |
|------------|-------|-------|
| `TestFullStackIntegration` | API → Service → Domain → Repo | 5 |
| `TestDomainValidationEnforcement` | Domain rules via API | 4 |
| `TestRepositoryPersistence` | Data persistence | 3 |
| `TestServiceLayerIntegration` | Service layer logic | 4 |
| `TestConcurrentOperations` | Sequential operations | 2 |

**Key Tests**:
- ✅ Task creation flows through all layers
- ✅ Task update persists correctly
- ✅ Task completion toggles via domain logic
- ✅ Task deletion removes from repository
- ✅ List endpoint reflects repository state
- ✅ Domain validation enforced via API
- ✅ Multiple tasks stored independently
- ✅ Service generates unique UUIDs
- ✅ Domain exceptions → HTTP errors
- ✅ Interleaved operations maintain consistency

---

### 3. Phase I Unit Tests (tests/unit/)

**Reused from Phase I** (already tested in phase-01-console):
- `test_task.py` - Task entity validation, immutability
- `test_task_service.py` - Business logic, error handling
- `test_task_repository.py` - In-memory storage operations

These tests ensure the domain/application/infrastructure layers work correctly when integrated into Phase II.

---

## 🧪 Running Tests

### Quick Start

```bash
cd phase-02-web/backend

# Run all tests
uv run pytest -v

# Run only API tests
uv run pytest tests/api/ -v

# Run only integration tests
uv run pytest tests/integration/ -v

# Run with coverage report
uv run pytest --cov=src --cov-report=html --cov-report=term
```

### Test Execution Order (TDD)

**Phase 1: API Layer Tests**
```bash
# 1. Write API endpoint tests (they will FAIL)
uv run pytest tests/api/test_tasks_api.py -v  # ❌ FAIL (no endpoints yet)

# 2. Implement FastAPI endpoints
# (implement src/api/routes/tasks.py, src/api/models/*, src/api/main.py)

# 3. Run tests again
uv run pytest tests/api/test_tasks_api.py -v  # ✅ PASS
```

**Phase 2: Error Handling Tests**
```bash
# 1. Write error handling tests
uv run pytest tests/api/test_error_handling.py -v  # ❌ FAIL

# 2. Implement exception handlers
# (add exception handlers to src/api/main.py)

# 3. Run tests again
uv run pytest tests/api/test_error_handling.py -v  # ✅ PASS
```

**Phase 3: Pydantic Model Tests**
```bash
# 1. Write model validation tests
uv run pytest tests/api/test_pydantic_models.py -v  # ❌ FAIL

# 2. Implement Pydantic models
# (create src/api/models/*.py with validation)

# 3. Run tests again
uv run pytest tests/api/test_pydantic_models.py -v  # ✅ PASS
```

**Phase 4: Integration Tests**
```bash
# 1. Write integration tests
uv run pytest tests/integration/ -v  # ❌ FAIL

# 2. Wire up all layers (dependencies, DI, app lifecycle)

# 3. Run tests again
uv run pytest tests/integration/ -v  # ✅ PASS
```

**Phase 5: Full Suite**
```bash
# Run everything
uv run pytest -v  # ✅ ALL PASS (~165 tests)
```

---

## 📋 Test Fixtures

### Shared Fixtures (tests/api/conftest.py)

| Fixture | Type | Purpose |
|---------|------|---------|
| `client` | TestClient | FastAPI test client for HTTP requests |
| `sample_task_data` | dict | Valid task data for testing |
| `multiple_tasks_data` | list[dict] | Multiple task data sets |
| `create_task` | function | Factory to create tasks |
| `create_multiple_tasks` | function | Factory to create N tasks |

### Usage Example

```python
def test_example(client, create_task):
    # Use client for HTTP requests
    response = client.post("/tasks", json={"title": "Test"})
    assert response.status_code == 201
    
    # Use factory to create task
    task_id = create_task(title="Factory task")
    
    # Use task_id in test
    get_response = client.get(f"/tasks/{task_id}")
    assert get_response.status_code == 200
```

---

## ✅ Expected Test Results

### When Implementation Complete

```bash
$ uv run pytest -v

======================== test session starts =========================
platform linux -- Python 3.13.x
collected 165 items

tests/api/test_tasks_api.py::TestCreateTaskEndpoint::test_create_task_with_valid_data_returns_201 PASSED [  1%]
tests/api/test_tasks_api.py::TestCreateTaskEndpoint::test_create_task_with_only_title_returns_201 PASSED [  2%]
...
tests/api/test_error_handling.py::TestErrorResponseStructure::test_404_error_has_correct_structure PASSED [ 60%]
...
tests/api/test_pydantic_models.py::TestCreateTaskRequest::test_valid_create_request_with_all_fields PASSED [ 80%]
...
tests/integration/test_full_stack.py::TestFullStackIntegration::test_task_creation_flow_through_all_layers PASSED [ 95%]
...
tests/unit/test_task.py::TestTask::test_create_task_with_valid_data PASSED [100%]

======================== 165 passed in 2.45s =========================

---------- coverage: platform linux, python 3.13.x -----------
Name                                    Stmts   Miss  Cover
-----------------------------------------------------------
src/api/main.py                           45      0   100%
src/api/routes/tasks.py                   78      0   100%
src/api/models/task_request.py            24      0   100%
src/api/models/task_response.py           18      0   100%
src/api/models/error_response.py          10      0   100%
src/api/dependencies.py                   12      0   100%
src/domain/task.py                        52      0   100%
src/application/task_service.py           65      0   100%
src/infrastructure/in_memory_task_repository.py  38  0  100%
-----------------------------------------------------------
TOTAL                                    342      0   100%
```

---

## 🎓 Test Strategy Summary

### Test-Driven Development (TDD)

Per constitution Section 5, follow **Red-Green-Refactor**:

1. **🔴 RED**: Write test first (it fails - endpoint doesn't exist)
2. **🟢 GREEN**: Write minimal code to make test pass
3. **♻️ REFACTOR**: Improve code while keeping tests green

### Test Pyramid

```
        /\
       /  \      E2E Tests (Manual browser testing)
      /----\
     /  IT  \    Integration Tests (~25 tests)
    /--------\
   /   UNIT   \  Unit Tests (~140 tests)
  /____________\
```

- **Unit Tests (140)**: Fast, isolated, test single components
- **Integration Tests (25)**: Test component interactions
- **E2E Tests**: Manual testing via browser + Swagger UI

### Coverage Goals

- **Domain/Application/Infrastructure**: 100% (Phase I tests)
- **API Routes**: 100% (all endpoints, all status codes)
- **Pydantic Models**: 100% (all validation rules)
- **Error Handlers**: 100% (all error paths)
- **Integration**: >90% (critical workflows)

**Overall Backend Coverage Target**: **>95%**

---

## 🔗 Related Documentation

- **API Contract**: `/specs/002-web-todo-app/contracts/openapi.yaml`
- **Architecture Plan**: `/specs/002-web-todo-app/plan.md`
- **Task Breakdown**: `/specs/002-web-todo-app/tasks.md`
- **API Test README**: `./API_TESTS_README.md`
- **Constitution**: `/.specify/memory/constitution.md`

---

## 📝 Notes

1. **Phase I Dependency**: Phase II tests depend on Phase I code being copied correctly to `phase-02-web/backend/src/domain/`, `application/`, `infrastructure/`.

2. **TestClient**: FastAPI TestClient simulates HTTP requests without running a server (in-process testing). Fast and reliable.

3. **Fixtures**: Shared fixtures in `conftest.py` reduce code duplication and setup time.

4. **Error Codes**: All error responses include `error_code` field for programmatic error handling by frontend.

5. **UUID Validation**: Tests verify UUID format for IDs (domain constraint).

6. **TDD Benefits**: Writing tests first ensures:
   - Clear API contract before implementation
   - High test coverage (no "we'll test later")
   - Confidence in refactoring
   - Living documentation

---

**Summary**: Complete test suite with ~165 tests covering 100% of API endpoints, all error scenarios, data validation, and full-stack integration flows. Ready for TDD implementation of Phase II backend.

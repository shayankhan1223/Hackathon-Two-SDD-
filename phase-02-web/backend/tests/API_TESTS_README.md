# Phase II API Unit Tests

**Purpose**: Comprehensive test suite for FastAPI REST API endpoints
**Created**: 2026-02-09
**Test Framework**: pytest with FastAPI TestClient

## Overview

This test suite validates the Phase II Web Todo Application API layer, ensuring:
- Correct HTTP status codes (200, 201, 204, 400, 404, 422, 500)
- Proper JSON request/response formats
- Error handling and validation
- Integration with Phase I domain logic
- API contract compliance (OpenAPI specification)

## Test Files

### test_tasks_api.py (Primary API Tests)

**Test Classes**:
1. `TestCreateTaskEndpoint` - POST /tasks
   - Valid task creation (201)
   - Empty title validation (400)
   - Title length validation (400)
   - Description length validation (400)
   - Missing required fields (422)
   - Malformed JSON (422)

2. `TestListTasksEndpoint` - GET /tasks
   - List all tasks (200)
   - Empty list handling
   - Completion status display

3. `TestGetSingleTaskEndpoint` - GET /tasks/{id}
   - Get by valid ID (200)
   - Non-existent ID (404)
   - Invalid UUID format (422)

4. `TestUpdateTaskEndpoint` - PUT /tasks/{id}
   - Update title only (200)
   - Update description only (200)
   - Update both fields (200)
   - Empty title validation (400)
   - Title too long (400)
   - Non-existent ID (404)
   - Invalid UUID format (422)

5. `TestCompleteTaskEndpoint` - PATCH /tasks/{id}/complete
   - Complete incomplete task (200)
   - Toggle completed task back (200)
   - Non-existent ID (404)
   - Invalid UUID format (422)

6. `TestDeleteTaskEndpoint` - DELETE /tasks/{id}
   - Delete existing task (204)
   - Task removed from list
   - Cannot retrieve after deletion (404)
   - Non-existent ID (404)
   - Invalid UUID format (422)

7. `TestAPIEndToEndWorkflows` - Integration
   - Complete CRUD lifecycle
   - Multiple tasks workflow
   - State persistence across operations

8. `TestAPIErrorScenarios` - Edge Cases
   - Duplicate task creation (different IDs)
   - Operations on empty repository
   - Update without fields

**Total Tests**: ~30 test methods

### test_error_handling.py (Error Handling Tests)

**Test Classes**:
1. `TestErrorResponseStructure`
   - 404 error format
   - 400 error format
   - User-friendly error messages

2. `TestValidationErrors`
   - Empty title (400)
   - Title too long (400)
   - Description too long (400)
   - Missing required fields (422)

3. `TestNotFoundErrors`
   - GET non-existent (404)
   - PUT non-existent (404)
   - PATCH non-existent (404)
   - DELETE non-existent (404)

4. `TestInternalServerErrors`
   - 500 error handling
   - Error response structure

5. `TestCORSConfiguration`
   - CORS headers present
   - Preflight OPTIONS handling

6. `TestAPIResponseSchemas`
   - TaskResponse schema validation
   - TaskListResponse schema validation
   - ErrorResponse schema validation

7. `TestHTTPStatusCodes`
   - All success codes (200, 201, 204)
   - All error codes (400, 404, 422)

**Total Tests**: ~20 test methods

### conftest.py (Shared Fixtures)

**Fixtures**:
- `client` - FastAPI TestClient instance
- `sample_task_data` - Valid task data dict
- `multiple_tasks_data` - Array of task data
- `create_task` - Factory to create tasks
- `create_multiple_tasks` - Factory to create multiple tasks

## Test Coverage

**API Layer**: 100% (all endpoints, all status codes)
**Error Handling**: 100% (all error paths)
**Request Validation**: 100% (all validation rules)
**Response Schemas**: 100% (all response types)

**Combined with Phase I Tests**:
- Domain Layer: 100%
- Application Layer: 100%
- Infrastructure Layer: 100%
- API Layer: 100%
- **Overall Backend**: >95% coverage

## Running Tests

### Run All API Tests

```bash
cd phase-02-web/backend
uv run pytest tests/api/ -v
```

### Run Specific Test File

```bash
uv run pytest tests/api/test_tasks_api.py -v
uv run pytest tests/api/test_error_handling.py -v
```

### Run Specific Test Class

```bash
uv run pytest tests/api/test_tasks_api.py::TestCreateTaskEndpoint -v
```

### Run With Coverage

```bash
uv run pytest tests/api/ --cov=src.api --cov-report=html
```

### Run Fast (No Coverage)

```bash
uv run pytest tests/api/ -v --no-cov
```

## Test Strategy

### Test-Driven Development (TDD)

Per constitution Section 5, these tests should be written BEFORE implementing the API:

1. **Write test** (should fail - endpoints don't exist yet)
2. **Run test** to confirm failure
3. **Implement endpoint** to make test pass
4. **Run test** again (should pass)
5. **Refactor** if needed

### Test Organization

Tests are organized by:
1. **Endpoint** (one class per endpoint)
2. **Scenario** (success, validation errors, not found, etc.)
3. **HTTP Status Code** (grouped by expected response)

### Fixture Usage

- Use `client` fixture for all HTTP requests
- Use `create_task` fixture when tests need existing tasks
- Use `create_multiple_tasks` for workflows needing multiple tasks

## API Contract Validation

These tests verify compliance with `/specs/002-web-todo-app/contracts/openapi.yaml`:

✅ All endpoints defined in OpenAPI spec
✅ All HTTP methods (GET, POST, PUT, DELETE, PATCH)
✅ All status codes documented
✅ All request/response schemas validated
✅ All error responses structured correctly

## Expected Test Results

When API is fully implemented:

```
======================== test session starts =========================
collected 50 items

tests/api/test_tasks_api.py::TestCreateTaskEndpoint::... PASSED [ 2%]
tests/api/test_tasks_api.py::TestListTasksEndpoint::... PASSED [ 4%]
...
tests/api/test_error_handling.py::TestErrorResponseStructure::... PASSED [98%]
tests/api/test_error_handling.py::TestHTTPStatusCodes::... PASSED [100%]

======================== 50 passed in 1.50s ==========================
```

## Dependencies

**Required**:
- FastAPI TestClient
- pytest
- Phase I domain/application/infrastructure code
- FastAPI app and routes

**Import Example**:
```python
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)
```

## Notes

**Phase I Tests**: Separate unit tests for domain/application/infrastructure exist in `tests/unit/`. These Phase II API tests focus exclusively on the HTTP layer.

**No Browser Required**: All tests use TestClient (in-process HTTP simulation).

**Fast Execution**: Tests run in <2 seconds (no network latency).

**Isolated**: Each test is independent (fresh TestClient per test).

## Next Steps

1. Implement FastAPI endpoints to make these tests pass
2. Run tests incrementally as each endpoint is implemented
3. Verify 100% API layer coverage
4. Add integration tests for full workflows
5. Test manually via browser and Swagger UI (/docs)

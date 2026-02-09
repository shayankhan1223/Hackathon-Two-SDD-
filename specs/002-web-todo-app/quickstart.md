# Quickstart: Web Todo Application (Phase II)

**Feature**: Web Todo Application
**Phase**: II (Web)
**Date**: 2026-02-09

## Overview

Phase II provides a web-based interface for managing tasks. The system consists of a FastAPI backend exposing REST API endpoints and a vanilla JavaScript frontend providing a browser-based UI.

## Prerequisites

- Python 3.13+ (or 3.12+)
- `uv` package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Quick Start

### 1. Backend Setup

```bash
# Navigate to Phase II directory
cd phase-02-web/backend

# Install dependencies
uv sync --extra dev

# Start the backend server
uv run uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd phase-02-web/frontend

# Serve frontend (option 1: Python simple server)
python3 -m http.server 3000

# OR (option 2: VS Code Live Server)
# Right-click on index.html and select "Open with Live Server"
```

Frontend will be available at: `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the todo application interface.

## API Documentation

Once the backend is running, access interactive API docs at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Running Tests

### Backend Tests

```bash
cd phase-02-web/backend

# Run all tests
uv run pytest -v

# Run with coverage
uv run pytest --cov=src --cov-report=html

# Run only API tests
uv run pytest tests/api/ -v

# Run only unit tests
uv run pytest tests/unit/ -v
```

### Frontend Tests

```bash
cd phase-02-web/frontend

# Manual testing in browser
# Open index.html and interact with UI

# Automated tests (if implemented)
# npm test (or similar, TBD based on testing approach)
```

## Using the Web Application

### Add a New Task

1. Enter task title in the "Title" field
2. (Optional) Enter description in the "Description" field
3. Click "Add Task" button
4. Task appears in the list below

### View Tasks

- All tasks are displayed automatically on page load
- Each task shows:
  - Title
  - Description (if provided)
  - Completion status (checkbox)
  - Edit and Delete buttons

### Complete a Task

- Click the checkbox next to a task
- Status toggles between complete (checked) and incomplete (unchecked)

### Update a Task

1. Click "Edit" button on a task
2. Modify title and/or description in the form
3. Click "Update" button
4. Changes are saved and displayed

### Delete a Task

1. Click "Delete" button on a task
2. Confirm deletion (if confirmation implemented)
3. Task is removed from the list

## API Usage Examples (curl)

### Create Task

```bash
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread"}'
```

### List All Tasks

```bash
curl http://localhost:8000/tasks
```

### Get Single Task

```bash
curl http://localhost:8000/tasks/{task-id}
```

### Update Task

```bash
curl -X PUT http://localhost:8000/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","description":"Updated description"}'
```

### Complete Task

```bash
curl -X PATCH http://localhost:8000/tasks/{task-id}/complete
```

### Delete Task

```bash
curl -X DELETE http://localhost:8000/tasks/{task-id}
```

## Project Structure

```
phase-02-web/
├── backend/
│   ├── src/
│   │   ├── domain/          # From Phase I (unchanged)
│   │   ├── application/     # From Phase I (unchanged)
│   │   ├── infrastructure/  # From Phase I (unchanged)
│   │   └── api/             # NEW: FastAPI routes and models
│   ├── tests/               # Unit + API tests
│   └── pyproject.toml       # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── index.html       # Main UI page
│   │   ├── css/styles.css   # Styling
│   │   └── js/
│   │       ├── api-client.js     # API communication
│   │       ├── task-manager.js   # UI logic
│   │       └── main.js           # App initialization
│   └── README.md
│
└── README.md                # Phase II overview
```

## Troubleshooting

### Backend won't start

**Issue**: `ModuleNotFoundError` or import errors

**Solution**:
- Ensure you're in the `backend/` directory
- Run `uv sync --extra dev`
- Check Python version: `python3 --version` (should be 3.12+)

### Frontend can't connect to backend

**Issue**: CORS errors in browser console

**Solution**:
- Verify backend is running on port 8000
- Check CORS configuration in `src/api/main.py`
- Ensure frontend URL is in allowed origins list

### Tests fail

**Issue**: Import errors or test failures

**Solution**:
- Run `uv sync --extra dev` to install test dependencies
- Verify you're in the `backend/` directory
- Check that Phase I domain logic was copied correctly

### Port already in use

**Issue**: `Address already in use` error

**Solution**:
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use a different port
uvicorn src.api.main:app --port 8001
```

## Important Notes

### Data Persistence

⚠️ **All data is in-memory only**. When you restart the backend, all tasks are deleted. This is by design for Phase II.

### Browser Compatibility

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance

- API responds in <100ms for most operations
- UI updates appear in <500ms
- No backend connection pooling (single-process)

### Limitations (Phase II)

- No user authentication
- No persistent storage
- No real-time updates (manual refresh required)
- No offline support
- Local development only (not production-ready)

## Next Steps After Quickstart

1. **Explore API**: Use Swagger UI at `http://localhost:8000/docs`
2. **Test All Features**: Create, view, update, complete, delete tasks
3. **Review Code**: Examine backend and frontend implementation
4. **Check Tests**: Run test suite and review coverage
5. **Read Plan**: Review `plan.md` for architecture details

## Development Workflow

### Making Changes

1. Backend changes: Modify files in `backend/src/`
2. Frontend changes: Modify files in `frontend/src/`
3. FastAPI auto-reloads on backend changes (--reload flag)
4. Frontend requires browser refresh

### Running in Development

```bash
# Terminal 1: Backend
cd phase-02-web/backend
uv run uvicorn src.api.main:app --reload

# Terminal 2: Frontend
cd phase-02-web/frontend
python3 -m http.server 3000

# Terminal 3: Tests (optional)
cd phase-02-web/backend
uv run pytest --watch  # If pytest-watch installed
```

## API Response Examples

### Success Response (GET /tasks)

```json
{
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false
    }
  ],
  "count": 1
}
```

### Error Response (404)

```json
{
  "detail": "Task not found with ID: invalid-id",
  "error_code": "TASK_NOT_FOUND",
  "status_code": 404
}
```

### Error Response (400)

```json
{
  "detail": "Task title cannot be empty",
  "error_code": "INVALID_TASK_DATA",
  "status_code": 400
}
```

## Getting Help

- **API Issues**: Check Swagger docs at `/docs`
- **Frontend Issues**: Open browser console (F12) for errors
- **Test Issues**: Run with `-v` flag for verbose output
- **General Issues**: Review README.md and plan.md

## Constitution Compliance

Phase II follows strict SDD principles:
- No manual coding (all generated from specs)
- Domain logic reused from Phase I unchanged
- Clear layer separation maintained
- All tests must pass before completion
- Architecture supports future phases

# Phase 2 Web - Multi-User Todo Application Implementation Guide

## Overview

This is the **Phase 2 upgrade** of the todo application, adding multi-user authentication, JWT-based security, and PostgreSQL database persistence.

**Implementation Date**: 2026-02-09
**Feature Branch**: 003-web-auth-db
**Status**: MVP Backend Complete (User Stories 1, 2, 3)

## What's Implemented

### MVP Scope (User Stories 1-3)

✅ **User Story 1: Authentication**
- User registration (sign-up) with email and password
- User sign-in with credential validation
- JWT token generation and verification
- Password hashing with bcrypt
- Token expiration (24 hours)

✅ **User Story 2: View Tasks**
- List all tasks for authenticated user
- User isolation (users only see their own tasks)
- JWT authentication required
- User ID validation (URL must match JWT)

✅ **User Story 3: Create Tasks**
- Create new tasks for authenticated user
- Automatic user_id assignment from JWT
- Input validation (title required, max lengths)
- Tasks automatically associated with owner

### Infrastructure Complete

✅ **Database Layer**
- SQLModel ORM models (User, Task)
- PostgreSQL connection with Neon
- Alembic migrations configured
- Database session management

✅ **Authentication Layer**
- Password hashing (bcrypt, cost factor 12)
- JWT generation (HS256 algorithm)
- JWT verification and user extraction
- FastAPI security dependencies

✅ **API Layer**
- Authentication endpoints (/api/auth/sign-up, /api/auth/sign-in)
- Task endpoints (/api/{user_id}/tasks)
- User isolation enforcement
- Error handling (401, 403, 404, 409)
- CORS configuration

✅ **Testing Setup**
- Pytest configuration
- Test fixtures with in-memory SQLite
- Unit and integration test structure

✅ **Documentation**
- Comprehensive README.md
- API endpoint documentation
- Setup instructions
- Environment variable configuration
- Troubleshooting guide

## File Structure

```
phase-02-web/backend/
├── src/
│   ├── config.py                   # Environment configuration
│   ├── api/
│   │   ├── main.py                 # FastAPI app initialization
│   │   ├── deps.py                 # JWT dependency
│   │   └── routes/
│   │       ├── auth.py             # Sign-up, sign-in endpoints
│   │       └── tasks.py            # Task CRUD endpoints
│   ├── application/
│   │   ├── auth_service.py         # JWT & password hashing
│   │   └── task_service.py         # Task business logic
│   ├── infrastructure/
│   │   ├── database.py             # Database connection
│   │   └── models.py               # User & Task SQLModel models
│   └── domain/                     # Domain layer (future)
├── tests/
│   ├── conftest.py                 # Pytest fixtures
│   ├── unit/                       # Unit tests
│   └── integration/                # Integration tests
├── alembic/                        # Database migrations
│   ├── env.py                      # Alembic configuration
│   └── versions/                   # Migration scripts
├── requirements.txt                # Python dependencies
├── .env.example                    # Environment template
├── .flake8                         # Linting config
├── pyproject.toml                  # Black & pytest config
└── README.md                       # Setup documentation
```

## Quick Start

### 1. Setup Backend

```bash
cd phase-02-web/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Neon PostgreSQL connection string and JWT secret

# Run migrations
alembic upgrade head

# Start server
uvicorn src.api.main:app --reload
```

API will be available at http://localhost:8000

### 2. Test Authentication Flow

```bash
# Sign up
curl -X POST http://localhost:8000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Response: {"user_id": "...", "token": "..."}

# Sign in
curl -X POST http://localhost:8000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Use token for authenticated requests
export TOKEN="<jwt-token-from-response>"
```

### 3. Test Task Operations

```bash
# Create task
curl -X POST http://localhost:8000/api/{user_id}/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}'

# List tasks
curl http://localhost:8000/api/{user_id}/tasks \
  -H "Authorization: Bearer $TOKEN"
```

## Environment Variables

Required variables in `.env`:

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-32-char-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

**Get DATABASE_URL**: Sign up at [Neon](https://neon.tech) and create a PostgreSQL database
**Generate JWT_SECRET**: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

## API Endpoints

### Public Endpoints

- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Authenticate user

### Protected Endpoints (Require JWT)

- `GET /api/{user_id}/tasks` - List user's tasks
- `POST /api/{user_id}/tasks` - Create task
- `GET /api/{user_id}/tasks/{task_id}` - Get task details
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task

### Health Endpoints

- `GET /` - API info
- `GET /health` - Health check

## Security Features

1. **JWT Authentication**: Stateless authentication with 24-hour expiry
2. **Password Hashing**: bcrypt with cost factor 12
3. **User Isolation**: Multi-layer enforcement
   - API layer: URL user_id must match JWT user_id
   - Service layer: All queries filtered by user_id
   - Database layer: Foreign key constraints
4. **Input Validation**: Pydantic models validate all requests
5. **CORS Protection**: Only allowed origins can access API

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific tests
pytest tests/unit/test_auth_service.py -v
pytest tests/integration/test_auth_api.py -v
```

## Next Steps

### User Story 4: Update & Complete Tasks (P2)
- Implement PUT endpoint for task updates
- Add completion toggle endpoint
- Add edit functionality

### User Story 5: Delete Tasks (P3)
- Already implemented in backend
- Add frontend confirmation modal

### Frontend Implementation
- Next.js frontend with authentication
- JWT storage and management
- Protected routes
- Task management UI

## Completed Tasks

From `specs/003-web-auth-db/tasks.md`:

- [x] T003: Create requirements.txt
- [x] T005: Create .env.example
- [x] T007: Setup linting (flake8, black)
- [x] T010: Initialize Alembic
- [x] T011: Database connection configuration
- [x] T012: Database session management
- [x] T013: User SQLModel
- [x] T014: Task SQLModel
- [x] T017: Password hashing utilities
- [x] T018: JWT generation
- [x] T019: JWT verification
- [x] T020: JWT dependency (get_current_user)
- [x] T021: FastAPI app initialization
- [x] T022: Error response models
- [x] T037: Sign-up endpoint
- [x] T038: Sign-in endpoint
- [x] T039: Auth validation
- [x] T040: Auth error handling
- [x] T041: Register auth routes
- [x] T057: Task domain entity (in service)
- [x] T058: TaskService.get_user_tasks
- [x] T059: GET /api/{user_id}/tasks endpoint
- [x] T060: User ID validation middleware
- [x] T061: Register task routes
- [x] T075: TaskService.create_task
- [x] T076: POST /api/{user_id}/tasks endpoint
- [x] T077: Request validation
- [x] T078: Automatic user_id assignment

## Architecture Principles

1. **Clean Architecture**: Separation of concerns (domain → application → infrastructure → api)
2. **Type Safety**: Full type hints with Pydantic validation
3. **Security by Design**: JWT validation, password hashing, user isolation
4. **Testability**: Dependency injection, fixtures, mocked database
5. **Documentation**: Comprehensive README, inline comments, OpenAPI docs

## References

- **Specification**: `/specs/003-web-auth-db/spec.md`
- **Implementation Plan**: `/specs/003-web-auth-db/plan.md`
- **Data Model**: `/specs/003-web-auth-db/data-model.md`
- **API Contract**: `/specs/003-web-auth-db/contracts/openapi.yaml`
- **Tasks**: `/specs/003-web-auth-db/tasks.md`

## Support

For issues or questions:
1. Check `backend/README.md` troubleshooting section
2. Review API docs at http://localhost:8000/docs
3. Check environment variables in `.env`
4. Verify database connection with Neon dashboard

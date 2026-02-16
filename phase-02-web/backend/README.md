# Multi-User Todo Application - Backend

Production-grade FastAPI backend with JWT authentication, PostgreSQL persistence, and user isolation.

## Features

- **JWT Authentication**: Stateless authentication with 24-hour token expiration
- **User Isolation**: Strict enforcement at API, service, and database layers
- **PostgreSQL Database**: Neon serverless PostgreSQL for persistent storage
- **Clean Architecture**: Layered architecture (domain → application → infrastructure → api)
- **Password Security**: bcrypt hashing with cost factor 12
- **Type Safety**: Full type hints with Pydantic validation
- **API Documentation**: Auto-generated OpenAPI/Swagger docs at `/docs`

## Technology Stack

- **FastAPI 0.109.2** - Modern Python web framework
- **SQLModel 0.0.16** - SQL databases with Python type hints
- **PostgreSQL** - Neon serverless PostgreSQL
- **PyJWT 2.8.0** - JSON Web Token implementation
- **Passlib 1.7.4** - Password hashing with bcrypt
- **Alembic 1.13.1** - Database migration tool
- **Pytest 8.0.0** - Testing framework

## Project Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   └── tasks.py         # Task CRUD endpoints
│   │   ├── deps.py              # FastAPI dependencies (JWT)
│   │   └── main.py              # FastAPI app initialization
│   ├── application/
│   │   ├── auth_service.py      # JWT & password hashing
│   │   └── task_service.py      # Task business logic
│   ├── domain/                  # Domain entities (future)
│   ├── infrastructure/
│   │   ├── database.py          # Database connection
│   │   └── models.py            # SQLModel ORM models
│   └── config.py                # Configuration settings
├── tests/
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── conftest.py              # Pytest fixtures
├── alembic/                     # Database migrations
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## Setup Instructions

### 1. Prerequisites

- Python 3.11 or higher
- PostgreSQL database (Neon account recommended)
- Git

### 2. Clone and Navigate

```bash
cd phase-02-web/backend
```

### 3. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and set your values:

```env
DATABASE_URL=postgresql://user:password@your-neon-host/database?sslmode=require
JWT_SECRET=your-secure-secret-key-min-32-characters
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

**Important**:
- Get `DATABASE_URL` from your Neon PostgreSQL dashboard
- Generate `JWT_SECRET` with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

### 6. Run Database Migrations

```bash
# Generate migration (first time only)
alembic revision --autogenerate -m "Initial migration: users and tasks tables"

# Apply migration
alembic upgrade head
```

### 7. Start Development Server

```bash
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication

#### Sign Up
```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response (201):
{
  "user_id": "uuid",
  "token": "jwt-token"
}
```

#### Sign In
```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response (200):
{
  "user_id": "uuid",
  "token": "jwt-token"
}
```

### Tasks (All require JWT in Authorization header)

#### List Tasks
```http
GET /api/{user_id}/tasks
Authorization: Bearer <jwt-token>

Response (200):
{
  "tasks": [...],
  "count": 10
}
```

#### Create Task
```http
POST /api/{user_id}/tasks
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}

Response (201):
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-02-09T...",
  "updated_at": "2026-02-09T..."
}
```

#### Get Task
```http
GET /api/{user_id}/tasks/{task_id}
Authorization: Bearer <jwt-token>
```

#### Update Task
```http
PUT /api/{user_id}/tasks/{task_id}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

#### Delete Task
```http
DELETE /api/{user_id}/tasks/{task_id}
Authorization: Bearer <jwt-token>

Response: 204 No Content
```

## Security

### Authentication Flow

1. User signs up or signs in → receives JWT token
2. Client stores token (localStorage, cookie, etc.)
3. Client includes token in `Authorization: Bearer <token>` header
4. Backend validates token signature and expiration
5. Backend extracts user_id from token
6. Backend validates user_id matches URL parameter

### User Isolation

- **API Layer**: Validates `{user_id}` in URL matches JWT `user_id`
- **Service Layer**: Filters all queries by `user_id`
- **Database Layer**: Foreign key constraints enforce referential integrity

### Password Security

- Passwords hashed with bcrypt (cost factor 12)
- Never stored in plaintext
- Verified securely during sign-in

### JWT Tokens

- Signed with HS256 algorithm
- 24-hour expiration
- Contains user_id in `sub` claim
- Verified on every request

## Testing

### Run All Tests
```bash
pytest
```

### Run with Coverage
```bash
pytest --cov=src --cov-report=html
```

### Run Specific Test File
```bash
pytest tests/unit/test_auth_service.py -v
```

## Database Migrations

### Create New Migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply Migrations
```bash
alembic upgrade head
```

### Rollback Migration
```bash
alembic downgrade -1
```

### View Migration History
```bash
alembic history
```

## Development

### Code Formatting
```bash
black src/
```

### Linting
```bash
flake8 src/
```

### Type Checking (optional)
```bash
mypy src/
```

## Troubleshooting

### Database Connection Errors

1. Verify `DATABASE_URL` in `.env`
2. Check Neon dashboard for connection string
3. Ensure `sslmode=require` is in connection string
4. Test connection: `psql $DATABASE_URL`

### JWT Token Errors

1. Verify `JWT_SECRET` is set and matches frontend
2. Check token expiration (24 hours default)
3. Ensure `Authorization: Bearer <token>` header format

### Migration Errors

1. Drop database and recreate: `alembic downgrade base && alembic upgrade head`
2. Delete `alembic/versions/*.py` and regenerate
3. Check models in `src/infrastructure/models.py`

## Production Deployment

### Environment Variables

Set all required environment variables:
- `DATABASE_URL`: Production database
- `JWT_SECRET`: Strong random secret (32+ characters)
- `ENVIRONMENT=production`
- `CORS_ORIGINS`: Production frontend URL

### Run with Gunicorn

```bash
pip install gunicorn
gunicorn src.api.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### HTTPS Required

In production, always use HTTPS to protect JWT tokens in transit.

## Architecture Decisions

See `history/adr/` for detailed architectural decision records:

1. **JWT Stateless Authentication** - Why we chose JWT over sessions
2. **Clean Architecture Layering** - Backend code organization
3. **Application-Level User Isolation** - Security model implementation

## API Documentation

Full API specification available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI Schema: http://localhost:8000/openapi.json

## License

MIT

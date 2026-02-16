# Quickstart Guide: Multi-User Todo Application

**Feature**: 003-web-auth-db
**Date**: 2026-02-09
**Prerequisites**: Python 3.11+, Node.js 18+, PostgreSQL database (Neon account)

---

## 1. Environment Setup

### Prerequisites Installation

```bash
# Verify Python version
python --version  # Should be 3.11 or higher

# Verify Node.js version
node --version  # Should be 18 or higher

# Install PostgreSQL client (optional, for debugging)
sudo apt install postgresql-client  # Ubuntu/Debian
brew install postgresql            # macOS
```

### Clone and Navigate

```bash
git clone <repository-url>
cd <repository-name>
git checkout 003-web-auth-db
```

---

## 2. Backend Setup

### 2.1 Create Virtual Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/macOS
# OR
venv\Scripts\activate     # Windows
```

### 2.2 Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Expected `requirements.txt` contents:**
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlmodel==0.0.14
psycopg2-binary==2.9.9
pyjwt==2.8.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
alembic==1.12.1
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
```

### 2.3 Configure Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Copy example file
cp .env.example .env

# Edit .env with your values
nano .env
```

**`.env` file contents:**
```env
# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql+asyncpg://user:password@hostname/dbname

# JWT Configuration
JWT_SECRET=your-secure-random-secret-key-here-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Environment
ENVIRONMENT=development
```

**Generate secure JWT secret:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2.4 Setup Database

**Get Neon PostgreSQL Connection String:**
1. Create account at https://neon.tech
2. Create new project
3. Copy connection string
4. Replace `DATABASE_URL` in `.env`

**Run migrations:**
```bash
# Initialize Alembic (first time only)
alembic init alembic

# Generate initial migration
alembic revision --autogenerate -m "Initial schema: users and tasks"

# Apply migrations
alembic upgrade head
```

**Verify database connection:**
```bash
# Using psql
psql $DATABASE_URL -c "SELECT version();"

# Or using Python
python -c "from src.infrastructure.database import engine; import asyncio; asyncio.run(engine.connect())"
```

### 2.5 Run Backend Server

```bash
# Development mode (auto-reload)
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000

# Or using Python directly
python -m src.api.main
```

**Verify backend is running:**
```bash
curl http://localhost:8000/
# Expected: {"message": "Multi-User Todo Application API", ...}

curl http://localhost:8000/health
# Expected: {"status": "healthy", ...}
```

---

## 3. Frontend Setup

### 3.1 Install Dependencies

```bash
cd frontend

# Install packages
npm install
# OR
pnpm install
# OR
yarn install
```

**Expected `package.json` dependencies:**
```json
{
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "better-auth": "^0.5.0",
    "@better-auth/jwt": "^0.5.0",
    "axios": "^1.6.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.45",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.3.6",
    "vitest": "^1.0.4",
    "@testing-library/react": "^14.1.2"
  }
}
```

### 3.2 Configure Environment Variables

Create `.env.local` file in `frontend/` directory:

```bash
# Copy example file
cp .env.local.example .env.local

# Edit .env.local
nano .env.local
```

**`.env.local` file contents:**
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secure-random-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# JWT Configuration (MUST match backend)
JWT_SECRET=your-secure-random-secret-key-here-min-32-chars
JWT_EXPIRATION=24h

# Environment
NODE_ENV=development
```

**Important:** `JWT_SECRET` must match backend's `JWT_SECRET` in backend/.env

### 3.3 Run Frontend Development Server

```bash
npm run dev
# OR
pnpm dev
# OR
yarn dev
```

**Verify frontend is running:**
- Open browser: http://localhost:3000
- Should see landing page with "Sign Up" and "Sign In" options

---

## 4. Testing the Application

### 4.1 Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/integration/test_auth_api.py

# Run specific test
pytest tests/unit/test_task_domain.py::test_task_ownership
```

**Test Categories:**
- `tests/unit/`: Domain logic, services
- `tests/integration/`: API endpoints, database

### 4.2 Frontend Tests

```bash
cd frontend

# Run all tests
npm test
# OR
npm run test

# Run with watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

---

## 5. End-to-End Workflow

### 5.1 Sign Up New User

**Using curl:**
```bash
curl -X POST http://localhost:8000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123"
  }'

# Expected response:
# {
#   "user_id": "123e4567-e89b-12d3-a456-426614174000",
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }
```

**Using frontend:**
1. Navigate to http://localhost:3000/sign-up
2. Enter email and password (min 8 chars)
3. Click "Sign Up"
4. Verify redirect to task list page

### 5.2 Sign In

**Using curl:**
```bash
curl -X POST http://localhost:8000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123"
  }'

# Save token for next requests
TOKEN="<token-from-response>"
```

### 5.3 Create Task

**Using curl:**
```bash
USER_ID="<user_id-from-auth-response>"

curl -X POST http://localhost:8000/api/$USER_ID/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }'

# Expected: Task created with 201 status
```

**Using frontend:**
1. Navigate to http://localhost:3000/tasks
2. Click "Add Task"
3. Enter title and description
4. Click "Create"
5. Verify task appears in list

### 5.4 List Tasks

**Using curl:**
```bash
curl http://localhost:8000/api/$USER_ID/tasks \
  -H "Authorization: Bearer $TOKEN"

# Expected: Array of tasks
```

### 5.5 Update Task

**Using curl:**
```bash
TASK_ID="<task-id-from-create-response>"

curl -X PATCH http://localhost:8000/api/$USER_ID/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "completed": true
  }'
```

### 5.6 Delete Task

**Using curl:**
```bash
curl -X DELETE http://localhost:8000/api/$USER_ID/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected: 204 No Content
```

---

## 6. Troubleshooting

### Backend Issues

**Issue: Database connection error**
```
Solution:
1. Verify DATABASE_URL in .env is correct
2. Check Neon database is active (not paused)
3. Test connection: psql $DATABASE_URL
4. Check firewall allows outbound PostgreSQL connections (port 5432)
```

**Issue: JWT signature verification failed**
```
Solution:
1. Ensure JWT_SECRET matches between frontend and backend
2. Verify token is not expired (check 'exp' claim)
3. Check CORS_ORIGINS includes frontend URL
```

**Issue: Import errors**
```
Solution:
1. Verify virtual environment is activated
2. Reinstall dependencies: pip install -r requirements.txt
3. Check Python version: python --version
```

### Frontend Issues

**Issue: CORS errors**
```
Solution:
1. Add frontend URL to CORS_ORIGINS in backend .env
2. Restart backend server
3. Clear browser cache
```

**Issue: Better Auth configuration error**
```
Solution:
1. Verify JWT_SECRET matches backend
2. Check NEXT_PUBLIC_API_URL points to backend
3. Restart development server: npm run dev
```

**Issue: Module not found**
```
Solution:
1. Delete node_modules and package-lock.json
2. Reinstall: npm install
3. Restart dev server
```

### Testing Issues

**Issue: Tests failing with database errors**
```
Solution:
1. Create separate test database
2. Use in-memory SQLite for unit tests
3. Set TEST_DATABASE_URL in .env
```

---

## 7. Development Workflow

### Daily Development Cycle

1. **Start Backend:**
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn src.api.main:app --reload
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Run Tests:**
   ```bash
   # Backend tests (in backend/)
   pytest

   # Frontend tests (in frontend/)
   npm test
   ```

4. **Check Linting:**
   ```bash
   # Backend
   flake8 src/ tests/

   # Frontend
   npm run lint
   ```

### Database Migrations

**Create new migration:**
```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
```

**Apply migrations:**
```bash
alembic upgrade head
```

**Rollback migrations:**
```bash
alembic downgrade -1  # Rollback 1 migration
alembic downgrade base  # Rollback all
```

---

## 8. Production Deployment Checklist

- [ ] Change `JWT_SECRET` to strong random value
- [ ] Set `ENVIRONMENT=production` in backend .env
- [ ] Set `NODE_ENV=production` in frontend
- [ ] Configure HTTPS (TLS certificates)
- [ ] Update `CORS_ORIGINS` with production frontend URL
- [ ] Use production PostgreSQL database (not development)
- [ ] Enable database connection pooling
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting (if needed)
- [ ] Run security audit (dependency vulnerabilities)
- [ ] Enable HSTS headers
- [ ] Configure CSP headers
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)

---

## 9. Useful Commands

### Backend

```bash
# Format code
black src/ tests/

# Check types
mypy src/

# Run linter
flake8 src/ tests/

# Generate OpenAPI spec
python -c "from src.api.main import app; import json; print(json.dumps(app.openapi(), indent=2))" > openapi.json
```

### Frontend

```bash
# Format code
npm run format

# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

---

## 10. Next Steps

After completing the quickstart:

1. **Read the Data Model:** `specs/003-web-auth-db/data-model.md`
2. **Review API Contracts:** `specs/003-web-auth-db/contracts/openapi.yaml`
3. **Study Implementation Plan:** `specs/003-web-auth-db/plan.md`
4. **Review Tasks:** `specs/003-web-auth-db/tasks.md` (after `/sp.tasks` is run)
5. **Explore ADRs:** `history/adr/` for architectural decisions

---

## Support

For issues or questions:
- Check troubleshooting section above
- Review spec documentation in `specs/003-web-auth-db/`
- Check existing tests for usage examples
- Review commit history for recent changes

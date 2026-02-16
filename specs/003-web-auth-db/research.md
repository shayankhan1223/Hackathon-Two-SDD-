# Research: Multi-User Todo Application with Authentication & Database

**Feature**: 003-web-auth-db
**Date**: 2026-02-09
**Status**: Complete

---

## 1. Better Auth Integration with JWT

### Question
How to configure Better Auth in Next.js to issue and manage JWT tokens that can be validated by FastAPI backend?

### Research Findings
- Better Auth supports JWT via `@better-auth/jwt` plugin
- JWT tokens can be issued with custom claims (user_id in `sub` field)
- Token secret must be shared between frontend and backend (via environment variable)
- Better Auth handles token storage (session/cookies) automatically

### Decision
Use Better Auth with JWT plugin, configured to issue tokens with user_id in `sub` claim.

### Rationale
- Industry-standard JWT format
- Easy integration with FastAPI PyJWT library
- Better Auth handles token lifecycle (refresh, expiration)
- Stateless authentication (no shared session store)

### Alternatives Considered
- Session-based auth with shared Redis: Rejected (adds infrastructure dependency)
- OAuth delegation (Auth0, Clerk): Rejected (scope includes custom auth implementation)

---

## 2. FastAPI JWT Validation

### Question
What is the best pattern for JWT validation in FastAPI to enforce authentication on protected routes?

### Research Findings
- PyJWT library provides `jwt.decode()` for signature verification
- FastAPI `Depends()` allows dependency injection for auth
- Can create reusable dependency that extracts and validates JWT from Authorization header
- Returns 401 automatically if JWT is missing or invalid

### Decision
Create `get_current_user()` dependency function that:
1. Extracts JWT from `Authorization: Bearer <token>` header
2. Verifies signature using shared secret
3. Decodes and returns user_id from `sub` claim
4. Raises HTTPException(401) if invalid

### Rationale
- DRY principle: reusable across all protected endpoints
- Automatic error handling (no manual 401 responses)
- Type-safe (returns user_id for downstream use)
- Testable in isolation

### Implementation Pattern
```python
from fastapi import Depends, HTTPException, Header
import jwt

def get_current_user(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing or invalid token")

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["sub"]  # user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
```

---

## 3. SQLModel with PostgreSQL

### Question
How to use SQLModel with Neon PostgreSQL for type-safe ORM with async support?

### Research Findings
- SQLModel combines Pydantic and SQLAlchemy
- Supports async operations with `asyncpg` driver
- Type hints provide editor autocomplete and validation
- Neon PostgreSQL connection string format: `postgresql+asyncpg://user:pass@host/db`

### Decision
Use SQLModel with asyncpg for database operations.

### Rationale
- Type safety: Pydantic models = database models
- Async support: Non-blocking I/O for better performance
- Familiar API: SQLAlchemy syntax
- Built-in validation: Pydantic validators on model fields

### Setup
```python
from sqlmodel import SQLModel, create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

engine = create_async_engine(DATABASE_URL, echo=True)

async def get_session():
    async with AsyncSession(engine) as session:
        yield session
```

---

## 4. User Isolation Strategy

### Question
Should user isolation be enforced at the database level (row-level security) or application level (JWT validation)?

### Research Findings
- **Row-Level Security (RLS)**: PostgreSQL feature, enforces at DB level
  - Pros: Defense in depth, works even if app logic has bugs
  - Cons: Complex to test, requires PostgreSQL-specific knowledge, harder to debug
- **Application-Level Enforcement**: Validate user_id in service layer
  - Pros: Explicit, testable, clear error messages, framework-agnostic
  - Cons: Relies on correct implementation (no DB-level safeguard)

### Decision
Use application-level enforcement with JWT user_id validation at multiple layers.

### Rationale
- **Testability**: Can test user isolation with unit tests (no DB required)
- **Clarity**: Explicit validation logic in service layer (no "magic" DB rules)
- **Error Messages**: Return 403 with clear message ("Not authorized to access this task")
- **Simplicity**: No PostgreSQL-specific configuration required
- **Defense in Depth**: Validate at API layer (URL user_id) AND service layer (task ownership)

### Implementation Pattern
```python
# API layer: validate URL user_id matches JWT user_id
@router.get("/api/{user_id}/tasks")
async def get_tasks(user_id: str, current_user: str = Depends(get_current_user)):
    if user_id != current_user:
        raise HTTPException(403, "Forbidden: user_id mismatch")

    # Service layer: filter tasks by user_id
    tasks = await task_service.get_user_tasks(user_id)
    return tasks

# Service layer: always filter by user_id
async def get_user_tasks(user_id: str) -> List[Task]:
    return session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()
```

---

## 5. Password Hashing

### Question
Which password hashing algorithm should be used for secure password storage?

### Research Findings
- **bcrypt**: Industry standard, slow by design (prevents brute force)
- **argon2**: Modern, memory-hard (better GPU resistance)
- **passlib**: Python library supporting multiple algorithms

### Decision
Use bcrypt with passlib wrapper.

### Rationale
- Industry standard (widely used, well-audited)
- FastAPI ecosystem compatibility (many examples)
- Configurable cost factor (default 12 rounds)
- Passlib provides clean API for hashing and verification

### Implementation
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password on sign-up
hashed_password = pwd_context.hash(plain_password)

# Verify password on sign-in
is_valid = pwd_context.verify(plain_password, hashed_password)
```

---

## 6. Frontend State Management

### Question
How should JWT tokens be stored on the client side to balance security and convenience?

### Research Findings
- **localStorage**: Vulnerable to XSS attacks
- **httpOnly cookies**: Secure from XSS, vulnerable to CSRF (mitigated with SameSite)
- **session storage**: Similar to localStorage, cleared on tab close
- **Better Auth default**: Uses cookies for session management

### Decision
Use Better Auth's built-in session management with httpOnly cookies where possible.

### Rationale
- **XSS Protection**: httpOnly cookies not accessible via JavaScript
- **Automatic Management**: Better Auth handles token storage and refresh
- **CSRF Protection**: SameSite=Lax attribute
- **Fallback**: If cookies unavailable, Better Auth uses secure session storage

### Configuration
```typescript
// lib/auth.ts
import { createAuth } from 'better-auth'
import { jwt } from '@better-auth/jwt'

export const auth = createAuth({
  plugins: [
    jwt({
      secret: process.env.JWT_SECRET!,
      expiresIn: '24h',
    }),
  ],
  session: {
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
})
```

---

## 7. Error Handling & HTTP Status Codes

### Question
What is the best pattern for consistent error responses across the API?

### Research Findings
- **RFC 7807 Problem Details**: Standard format for HTTP error responses
- **Fields**: `detail` (human-readable), `error_code` (machine-readable), `status_code` (HTTP status)
- **FastAPI HTTPException**: Supports custom response models

### Decision
Use RFC 7807 Problem Details format for all error responses.

### Rationale
- **Consistency**: Same structure for all errors
- **Client-Friendly**: Easy to parse and display user-friendly messages
- **Debuggability**: error_code allows client-side error categorization

### Error Response Format
```json
{
  "detail": "User not authorized to access this task",
  "error_code": "FORBIDDEN_USER_MISMATCH",
  "status_code": 403
}
```

### HTTP Status Code Mapping
- `400 Bad Request`: Validation errors (missing fields, invalid format)
- `401 Unauthorized`: Missing, expired, or invalid JWT
- `403 Forbidden`: Valid JWT but user_id mismatch or ownership violation
- `404 Not Found`: Resource doesn't exist OR user doesn't own it (intentional ambiguity)
- `409 Conflict`: Email already registered
- `503 Service Unavailable`: Database connection failure

---

## Research Completion Checklist

- [x] Better Auth JWT integration researched and decided
- [x] FastAPI JWT validation pattern defined
- [x] SQLModel with PostgreSQL configuration researched
- [x] User isolation strategy decided (application-level)
- [x] Password hashing algorithm selected (bcrypt)
- [x] Frontend JWT storage strategy decided (Better Auth sessions)
- [x] Error handling format standardized (RFC 7807)

---

## Next Steps

Proceed to Phase 1: Generate design artifacts
1. Create `data-model.md` (User and Task entities)
2. Generate `contracts/openapi.yaml` (API specification)
3. Create `quickstart.md` (setup instructions)
4. Update agent context with technology choices

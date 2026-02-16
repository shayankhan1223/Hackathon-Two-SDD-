# Data Model: Multi-User Todo Application

**Feature**: 003-web-auth-db
**Date**: 2026-02-09
**Version**: 1.0

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ id (PK)            │◄────┐
│ email (UNIQUE)     │     │
│ hashed_password    │     │ One-to-Many
│ created_at         │     │
└─────────────────────┘     │
                            │
                            │
┌─────────────────────┐     │
│       Task          │     │
├─────────────────────┤     │
│ id (PK)            │     │
│ user_id (FK)       │─────┘
│ title              │
│ description        │
│ completed          │
│ created_at         │
│ updated_at         │
└─────────────────────┘
```

---

## User Entity

### Description
Represents an authenticated application user. Users own tasks and are identified by unique email addresses.

### Attributes

| Field            | Type      | Constraints           | Description                           |
|------------------|-----------|-----------------------|---------------------------------------|
| `id`             | UUID      | Primary Key           | Unique identifier for the user        |
| `email`          | String    | Unique, Not Null      | User's email address (login)          |
| `hashed_password`| String    | Not Null              | bcrypt-hashed password                |
| `created_at`     | DateTime  | Not Null, Default Now | Account creation timestamp            |

### Relationships
- **Has Many** Tasks: One user can own zero or more tasks (one-to-many)

### Constraints
- **Email Uniqueness**: Email must be unique across all users (enforced at DB level)
- **Email Format**: Must be valid email format (validated at API level)
- **Password Policy**: Plain password must be minimum 8 characters (validated at API level)
- **Password Storage**: Always store hashed password (never plain text)

### Indexes
- `email` (unique index): Fast lookup for authentication

### Business Rules
1. Users cannot be deleted (out of scope for this phase)
2. Email cannot be changed after registration (out of scope)
3. User creation only via sign-up endpoint (no admin creation)

### SQLModel Definition

```python
from sqlmodel import Field, SQLModel
from datetime import datetime
from uuid import UUID, uuid4

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
```

---

## Task Entity

### Description
Represents a todo item belonging to a specific user. Tasks have ownership (user_id) that is immutable after creation.

### Attributes

| Field        | Type      | Constraints              | Description                           |
|--------------|-----------|--------------------------|---------------------------------------|
| `id`         | UUID      | Primary Key              | Unique identifier for the task        |
| `user_id`    | UUID      | Foreign Key, Not Null    | Owner of the task (references users)  |
| `title`      | String    | Not Null, Max 200 chars  | Task title (required)                 |
| `description`| String    | Nullable, Max 1000 chars | Task description (optional)           |
| `completed`  | Boolean   | Not Null, Default False  | Task completion status                |
| `created_at` | DateTime  | Not Null, Default Now    | Task creation timestamp               |
| `updated_at` | DateTime  | Not Null, Auto Update    | Task last modification timestamp      |

### Relationships
- **Belongs To** User: Each task belongs to exactly one user (many-to-one, required)

### Constraints
- **Title Required**: Title cannot be empty or null
- **Title Length**: Maximum 200 characters
- **Description Length**: Maximum 1000 characters (if provided)
- **User Reference**: user_id must reference valid user
- **Immutable Ownership**: user_id cannot be changed after creation

### Indexes
- `user_id` (index): Fast filtering of tasks by user

### Business Rules
1. Tasks can only be accessed by their owner (enforced at application layer)
2. Task ownership is immutable (user_id set on creation, never updated)
3. Deleting task does not delete user (cascade only in reverse: user deletion cascades to tasks)
4. Task IDs are globally unique (UUID ensures no collisions)

### Validation Rules
- **On Create**:
  - title must be provided and non-empty
  - user_id must match authenticated user (from JWT)
  - description is optional
  - completed defaults to false

- **On Update**:
  - user_id cannot be modified (immutable)
  - title can be updated (if provided and non-empty)
  - description can be updated (nullable)
  - completed can be toggled

- **On Delete**:
  - Only owner can delete task (user_id must match JWT)

### State Transitions

```
        [Create]
           │
           ▼
    ┌──────────────┐
    │  Incomplete  │◄──┐
    │ (completed=  │   │
    │   false)     │   │ [Toggle]
    └──────────────┘   │
           │           │
           │ [Toggle]  │
           │           │
           ▼           │
    ┌──────────────┐   │
    │   Complete   │───┘
    │ (completed=  │
    │    true)     │
    └──────────────┘
           │
           │ [Delete]
           ▼
       [Removed]
```

### SQLModel Definition

```python
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True, nullable=False)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship (optional, for ORM convenience)
    # user: User = Relationship(back_populates="tasks")
```

---

## JWT Token (Transient, Not Stored)

### Description
JWT tokens are issued on authentication and validated on every request. They are **not stored in the database** (stateless authentication).

### Payload Structure

```json
{
  "sub": "user-uuid-here",
  "exp": 1234567890,
  "iat": 1234567890
}
```

### Fields

| Field | Type    | Description                           |
|-------|---------|---------------------------------------|
| `sub` | String  | Subject: user_id (UUID)               |
| `exp` | Integer | Expiration time (Unix timestamp)      |
| `iat` | Integer | Issued at time (Unix timestamp)       |

### Constraints
- Token expires after 24 hours (`exp` - `iat` = 86400 seconds)
- Signed with HS256 algorithm using shared secret
- Secret stored in environment variable (never in code)

### Validation Rules
1. Signature must be valid (verifies authenticity)
2. Token must not be expired (`exp` > current time)
3. `sub` (user_id) must be valid UUID format
4. `sub` (user_id) must match URL parameter in task endpoints (403 if mismatch)

---

## Database Migrations

### Initial Migration (Alembic)

**Version**: `0001_initial`
**Description**: Create users and tasks tables

```sql
-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

### Future Migrations (Out of Scope)
- Add `last_login` to users table
- Add `due_date` to tasks table
- Add `tags` table for task categorization

---

## Data Integrity & Security

### Integrity Guarantees
1. **Referential Integrity**: task.user_id always references valid user (FK constraint)
2. **User Isolation**: Tasks filtered by user_id at application layer (tested)
3. **Immutable Ownership**: task.user_id set on creation, never updated (enforced in service layer)
4. **Unique Identifiers**: UUIDs prevent ID guessing attacks

### Security Measures
1. **Password Security**: Passwords hashed with bcrypt (cost factor 12)
2. **JWT Validation**: Signature verification on every request
3. **User ID Validation**: URL user_id must match JWT user_id (403 if mismatch)
4. **Authorization**: Service layer checks task ownership before CRUD operations
5. **Input Sanitization**: Pydantic validates all inputs (title length, email format)

---

## Performance Considerations

### Indexing Strategy
- `users.email` (unique index): Fast authentication lookups
- `tasks.user_id` (index): Fast task filtering by user

### Query Patterns
- **Most Common**: `SELECT * FROM tasks WHERE user_id = ?` (indexed)
- **Authentication**: `SELECT * FROM users WHERE email = ?` (indexed)
- **Single Task**: `SELECT * FROM tasks WHERE id = ? AND user_id = ?` (PK + filter)

### Scalability
- **100 tasks per user**: <2 seconds retrieval (spec requirement)
- **Pagination**: Not required for Phase 1 (assumed <1000 tasks per user)
- **Future Optimization**: Add pagination with LIMIT/OFFSET or cursor-based

---

## Testing Scenarios

### User Entity Tests
1. Create user with valid email and password → Success
2. Create user with duplicate email → Conflict (409)
3. Create user with invalid email → Validation error (400)
4. Hash password on creation → Verify hashed_password stored (not plain)

### Task Entity Tests
1. Create task with valid title → Success (user_id set from JWT)
2. Create task with empty title → Validation error (400)
3. Create task with title >200 chars → Validation error (400)
4. Update task title → Success (updated_at changes)
5. Toggle task completion → Success (completed flips)
6. Delete task → Success (row removed)

### User Isolation Tests
1. User A creates task → User B cannot view it (403)
2. User A creates task → User B cannot update it (403)
3. User A creates task → User B cannot delete it (403)
4. User A lists tasks → Only sees their own tasks

---

## Open Questions & Future Enhancements

### Resolved in Research
- [x] Should task ownership be immutable? **Yes, set on creation**
- [x] Should users be able to delete accounts? **No, out of scope**
- [x] What happens to tasks when user is deleted? **Cascade delete (discussed, accepted)**

### Future Enhancements (Out of Scope)
- Add task tags/categories (many-to-many relationship)
- Add task due dates and reminders
- Add task priority levels
- Add task sharing between users
- Add soft delete for tasks (deleted flag instead of actual deletion)

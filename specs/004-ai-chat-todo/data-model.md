# Data Model: AI Chat-Driven Todo Application

**Feature Branch**: `004-ai-chat-todo`
**Date**: 2026-02-10
**ORM**: SQLModel (Pydantic + SQLAlchemy)
**Database**: Neon PostgreSQL (serverless)

---

## Entity Relationship Overview

```
User 1──* Task
User 1──* ChatMessage
Task *──* Tag (via TaskTag join table)
```

---

## Entities

### User

Represents a registered individual with authentication credentials.

| Field          | Type         | Constraints                        | Notes                           |
|----------------|--------------|------------------------------------|---------------------------------|
| id             | UUID         | PK, auto-generated                 | Primary identifier              |
| email          | String(255)  | UNIQUE, NOT NULL, indexed          | Login credential                |
| hashed_password| String(255)  | NOT NULL                           | bcrypt hashed                   |
| created_at     | DateTime     | NOT NULL, default=now (UTC)        | Registration date (FR-019)      |
| updated_at     | DateTime     | NOT NULL, default=now, on_update   | Last profile modification       |

**Relationships**: One-to-many with Task, one-to-many with ChatMessage.

**Validation Rules**:
- email: valid email format, case-insensitive uniqueness
- hashed_password: never exposed in API responses

---

### Task

Represents a to-do item owned by a single user.

| Field       | Type                              | Constraints                   | Notes                          |
|-------------|-----------------------------------|-------------------------------|--------------------------------|
| id          | UUID                              | PK, auto-generated            | Primary identifier             |
| user_id     | UUID                              | FK → User.id, NOT NULL, indexed | Ownership enforcement         |
| title       | String(255)                       | NOT NULL                      | Required per FR-002            |
| description | Text                              | NULLABLE                      | Optional per FR-002            |
| due_date    | Date                              | NOT NULL                      | Past, present, future allowed  |
| priority    | Enum(high, medium, low)           | NOT NULL, default=medium      | FR-002                         |
| status      | Enum(pending, completed)          | NOT NULL, default=pending     | FR-002                         |
| created_at  | DateTime                          | NOT NULL, default=now (UTC)   | FR-018                         |
| updated_at  | DateTime                          | NOT NULL, default=now, on_update | Track modifications          |

**Relationships**: Belongs-to User (via user_id), many-to-many with Tag (via TaskTag).

**Indexes**:
- `ix_task_user_id` on user_id (ownership queries)
- `ix_task_user_due_date` on (user_id, due_date) (calendar queries)
- `ix_task_user_status` on (user_id, status) (filter queries)

**Validation Rules**:
- title: 1-255 characters, non-empty after trimming
- due_date: valid date (no restriction on past/future)
- priority: must be one of high, medium, low
- status: must be one of pending, completed

**State Transitions**:
- pending → completed (via complete_task or update_task)
- completed → pending (via update_task, allows uncompleting)

---

### Tag

Represents a label category for organizing tasks.

| Field | Type        | Constraints               | Notes                     |
|-------|-------------|---------------------------|---------------------------|
| id    | UUID        | PK, auto-generated        | Primary identifier        |
| name  | String(50)  | UNIQUE, NOT NULL           | e.g., Work, Home, Study   |

**Seed Data**: Work, Home, Study, Health, Finance, Social

---

### TaskTag (Join Table)

Many-to-many relationship between Task and Tag.

| Field   | Type | Constraints                     | Notes                |
|---------|------|---------------------------------|----------------------|
| task_id | UUID | FK → Task.id, PK (composite)   | Part of composite PK |
| tag_id  | UUID | FK → Tag.id, PK (composite)    | Part of composite PK |

**Cascade**: Deleting a Task deletes associated TaskTag rows.

---

### ChatMessage

Represents a single message in a user's chat conversation.

| Field      | Type                        | Constraints                    | Notes                        |
|------------|-----------------------------|--------------------------------|------------------------------|
| id         | UUID                        | PK, auto-generated             | Primary identifier           |
| user_id    | UUID                        | FK → User.id, NOT NULL, indexed | Message ownership           |
| role       | Enum(user, assistant)       | NOT NULL                       | Who sent the message         |
| content    | Text                        | NOT NULL                       | Message text                 |
| created_at | DateTime                    | NOT NULL, default=now (UTC)    | Chronological ordering       |

**Relationships**: Belongs-to User (via user_id).

**Indexes**:
- `ix_chatmessage_user_created` on (user_id, created_at) (conversation history loading)

**Validation Rules**:
- content: non-empty string
- role: must be one of user, assistant

---

## Migration Strategy

- Use Alembic for schema migrations
- Initial migration creates all tables and seed data (default tags)
- All migrations must be reversible (include downgrade)
- Neon PostgreSQL connection via async driver (`asyncpg`)

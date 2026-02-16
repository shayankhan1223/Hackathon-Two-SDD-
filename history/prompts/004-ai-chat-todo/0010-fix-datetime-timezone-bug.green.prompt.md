---
id: 0010
title: Fix Datetime Timezone Bug
stage: green
date: 2026-02-11
surface: agent
model: claude-sonnet-4-5-20250929
feature: 004-ai-chat-todo
branch: 004-ai-chat-todo
user: shayan
command: /sp.plan (bug fix)
labels: ["bug-fix", "backend", "database", "asyncpg", "datetime"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - phase-03-ai-chat/backend/src/models/user.py
  - phase-03-ai-chat/backend/src/models/task.py
  - phase-03-ai-chat/backend/src/models/chat_message.py
  - specs/004-ai-chat-todo/tasks.md
tests:
  - null
---

## Prompt

/sp.plan (with error log showing): asyncpg.exceptions.DataError: invalid input for query argument $4: datetime.datetime(2026, 2, 11, 4, 18, 7,... (can't subtract offset-naive and offset-aware datetimes)

This error occurs in backend after hitting create account button on /api/auth/register endpoint.

## Response snapshot

**Root Cause Analysis:**
- Python code uses `datetime.now(timezone.utc)` which creates timezone-aware datetimes
- SQLModel/SQLAlchemy defaults to `TIMESTAMP WITHOUT TIME ZONE` columns
- asyncpg (PostgreSQL async driver) strictly enforces timezone consistency
- Mismatch causes: "can't subtract offset-naive and offset-aware datetimes"

**Fix Applied:**
Changed all datetime columns to use timezone-aware timestamps:

```python
# Before
created_at: datetime = Field(
    default_factory=lambda: datetime.now(timezone.utc), nullable=False
)

# After
created_at: datetime = Field(
    default_factory=lambda: datetime.now(timezone.utc),
    sa_column=Column(DateTime(timezone=True), nullable=False),
)
```

**Files Modified:**
1. `phase-03-ai-chat/backend/src/models/user.py` - created_at, updated_at
2. `phase-03-ai-chat/backend/src/models/task.py` - created_at, updated_at
3. `phase-03-ai-chat/backend/src/models/chat_message.py` - created_at

**Next Step Required:**
User must recreate database tables to apply new column types:
```sql
DROP TABLE IF EXISTS users, tasks, chat_messages, tags, task_tags CASCADE;
```
Then restart the backend server.

## Outcome

- ✅ Impact: Critical bug fix enabling user registration
- 🧪 Tests: Manual test - register user should succeed after DB recreation
- 📁 Files: 4 files modified (3 models, tasks.md)
- 🔁 Next prompts: Recreate DB tables, test registration flow
- 🧠 Reflection: asyncpg is strict about timezone consistency unlike psycopg2

## Evaluation notes (flywheel)

- Failure modes observed: Mixing timezone-aware Python datetimes with naive PostgreSQL columns
- Graders run and results (PASS/FAIL): N/A - bug fix
- Prompt variant (if applicable): N/A
- Next experiment: Add model validation to catch datetime timezone mismatches

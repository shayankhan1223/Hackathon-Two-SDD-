---
id: "0008"
title: "Fix Password Reset Timezone Mismatch"
stage: green
date: 2026-02-17
surface: agent
model: claude-sonnet-4-5-20250929
feature: 006-phase3-improvements
branch: 006-phase3-improvements
user: shayan
command: /sp.plan (bug fix)
labels: ["bugfix", "password-reset", "timezone", "asyncpg", "postgresql"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/models/password_reset_token.py
  - backend/src/database/session.py
tests:
  - "Manual: forgot-password flow should complete without 500 error"
---

## Prompt

Fix forgot-password 500 error: `asyncpg.exceptions.DataError: can't subtract offset-naive and offset-aware datetimes` when inserting into `password_reset_tokens` table. The `expires_at` column is `TIMESTAMP WITHOUT TIME ZONE` but receives timezone-aware datetime values.

## Response snapshot

**Root Cause**: `PasswordResetToken.expires_at` field was missing `sa_column=Column(DateTime(timezone=True))`, causing SQLAlchemy to create the DB column as `TIMESTAMP WITHOUT TIME ZONE`. The `default_factory` produces `datetime.now(timezone.utc)` (timezone-aware), which asyncpg rejects when targeting a naive timestamp column.

**Fix**:
1. Added `sa_column=Column(DateTime(timezone=True), nullable=False)` to `expires_at` field in the model
2. Added `ALTER TABLE` statements in `create_all_tables()` to fix existing DB column types from naive to timezone-aware for both `expires_at` and `created_at`

## Outcome

- Impact: Fixes forgot-password flow — users can now request password resets without 500 errors
- Tests: Manual test required — restart backend, try forgot-password flow
- Files: 2 files modified (model + session)
- Next prompts: Verify fix by testing forgot-password flow end-to-end
- Reflection: This is a recurring pattern — when using `default_factory` with timezone-aware datetimes, always pair with `sa_column=Column(DateTime(timezone=True))`

## Evaluation notes (flywheel)

- Failure modes observed: SQLAlchemy `create_all` doesn't alter existing column types — required manual ALTER TABLE
- Graders run and results (PASS/FAIL): Pending manual verification
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A

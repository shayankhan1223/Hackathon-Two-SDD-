# Quickstart: Phase III Improvements

**Feature**: 006-phase3-improvements
**Date**: 2026-02-16

## Prerequisites

- Existing Phase III application running (backend on :8000, frontend on :3000)
- Neon PostgreSQL database accessible
- Python 3.12+ with venv activated
- Node.js 18+ with npm

## Implementation Order

### Phase III-A: AI Date Intelligence Fix (Backend)

1. Modify `backend/src/agent/instructions.py` — convert static `SYSTEM_PROMPT` to a function that injects `datetime.utcnow()`
2. Update `backend/src/agent/server.py` — use callable instructions
3. Remove hardcoded example dates from tool docstrings in `backend/src/agent/tools.py`
4. Test: Send "Add a task for tomorrow" via chat, verify correct date

### Phase III-B: Broken UI Interactions (Frontend)

1. **Calendar Add Event**: Wire onClick handler on Add Event button, create `AddEventModal` component, connect to `api.tasks.create()`
2. **Dark Mode**: Wire existing `useTheme` hook into Sidebar and Settings page, remove inline DOM manipulation
3. **Notification Bell**: Create `NotificationDropdown` component, derive notifications from task data (overdue, recently completed)
4. **Header Search**: Wire `SearchBar` component into Header, add task fetching and dropdown results
5. **Settings Save**: Replace `alert()` with `Toast`/`Banner` component, connect to `PATCH /api/user/preferences`
6. **Security Buttons**: Wire "Change Password" to modal, remove "Payment Methods" and "Billing Information" buttons

### Phase III-C: Missing Pages (Frontend)

1. Create `frontend/src/app/(dashboard)/dashboard/profile/page.tsx`
2. Create `frontend/src/app/terms/page.tsx`
3. Create `frontend/src/app/privacy/page.tsx`
4. Update all `href="#"` links to point to actual routes

### Phase III-D: Auth & Settings Backend

1. Create `password_reset_tokens` table via Alembic migration
2. Create `user_preferences` table via Alembic migration
3. Add `POST /api/auth/forgot-password` endpoint
4. Add `POST /api/auth/reset-password` endpoint
5. Add `POST /api/auth/change-password` endpoint
6. Add `GET /api/user/preferences` endpoint
7. Add `PATCH /api/user/preferences` endpoint
8. Create frontend pages: `/forgot-password`, `/reset-password`
9. Wire settings page to preferences API
10. Wire timezone dropdown with IANA data

## Database Migrations

```bash
cd phase-03-ai-chat/backend
source .venv/bin/activate
alembic revision --autogenerate -m "add user_preferences and password_reset_tokens"
alembic upgrade head
```

## Verification

```bash
# Backend health check
curl http://localhost:8000/api/health

# Test date injection (after Phase III-A)
curl -X POST http://localhost:8000/api/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"message": "What is today'\''s date?"}'

# Test preferences endpoints (after Phase III-D)
curl http://localhost:8000/api/user/preferences \
  -H "Authorization: Bearer <token>"
```

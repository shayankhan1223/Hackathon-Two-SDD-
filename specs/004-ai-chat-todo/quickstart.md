# Quickstart: AI Chat-Driven Todo Application (Phase 3)

**Feature Branch**: `004-ai-chat-todo`
**Date**: 2026-02-10

## Prerequisites

- Python 3.12+
- Node.js 20+
- npm 10+
- PostgreSQL (Neon account or local Postgres)
- OpenAI API key

## Project Structure

```
phase-03-ai-chat/
├── backend/
│   ├── src/
│   │   ├── __init__.py
│   │   ├── config.py              # Environment config (Pydantic Settings)
│   │   ├── main.py                # FastAPI app + ChatKit endpoint
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   └── jwt.py             # JWT verification middleware
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py            # User SQLModel
│   │   │   ├── task.py            # Task, Tag, TaskTag SQLModels
│   │   │   └── chat_message.py    # ChatMessage SQLModel
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   └── session.py         # Async engine + session factory
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py            # Dependency injection (get_user, get_db)
│   │   │   └── routes/
│   │   │       ├── __init__.py
│   │   │       ├── tasks.py       # Task CRUD REST endpoints
│   │   │       ├── tags.py        # Tag listing endpoint
│   │   │       ├── calendar.py    # Calendar data endpoints
│   │   │       └── health.py      # Health check
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── task_service.py    # Business logic for tasks
│   │   ├── agent/
│   │   │   ├── __init__.py
│   │   │   ├── tools.py           # @function_tool definitions (MCP tools)
│   │   │   ├── client_tools.py    # Client tool definitions (UI control)
│   │   │   ├── instructions.py    # Agent system prompt
│   │   │   └── server.py          # ChatKitServer subclass
│   │   └── alembic/
│   │       ├── env.py
│   │       └── versions/
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py            # Fixtures (test DB, client, auth)
│   │   ├── unit/
│   │   │   ├── __init__.py
│   │   │   ├── test_tools.py      # MCP tool unit tests (TR-001)
│   │   │   └── test_task_service.py
│   │   ├── integration/
│   │   │   ├── __init__.py
│   │   │   ├── test_chat.py       # Chat endpoint tests (TR-002)
│   │   │   ├── test_tasks_api.py  # REST API tests
│   │   │   └── test_auth.py       # Auth protection tests (TR-003)
│   │   └── ai/
│   │       ├── __init__.py
│   │       ├── test_intent.py     # Intent parsing tests (TR-004)
│   │       ├── test_tool_select.py # Tool selection tests (TR-005)
│   │       └── test_refusal.py    # Refusal behavior tests (TR-006)
│   ├── alembic.ini
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Landing / redirect
│   │   │   ├── (auth)/
│   │   │   │   ├── sign-in/page.tsx
│   │   │   │   └── sign-up/page.tsx
│   │   │   └── (protected)/
│   │   │       ├── layout.tsx     # Auth guard layout
│   │   │       └── dashboard/
│   │   │           └── page.tsx   # Main dashboard
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   └── ChatPanel.tsx  # ChatKit wrapper
│   │   │   ├── tasks/
│   │   │   │   ├── TaskList.tsx
│   │   │   │   ├── TaskItem.tsx
│   │   │   │   ├── TaskForm.tsx
│   │   │   │   └── TaskFilters.tsx
│   │   │   ├── calendar/
│   │   │   │   ├── MonthView.tsx
│   │   │   │   ├── WeekView.tsx
│   │   │   │   └── DayView.tsx
│   │   │   └── ui/               # Shared UI primitives
│   │   ├── lib/
│   │   │   ├── auth.ts           # Better Auth client config
│   │   │   ├── auth-server.ts    # Better Auth server config
│   │   │   ├── api.ts            # API client (fetch + JWT)
│   │   │   └── types.ts          # Shared TypeScript types
│   │   ├── hooks/
│   │   │   ├── useTasks.ts       # Task data fetching
│   │   │   ├── useCalendar.ts    # Calendar state
│   │   │   └── useFilters.ts     # Filter/sort state
│   │   └── stores/
│   │       └── ui-store.ts       # UI state (calendar view, filters, highlights)
│   ├── tests/
│   │   ├── components/
│   │   │   ├── chat.test.tsx      # Chat UI tests (TR-007)
│   │   │   ├── calendar.test.tsx  # Calendar tests (TR-008)
│   │   │   └── filters.test.tsx   # Filter tests (TR-009)
│   │   └── setup.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.mjs
│   └── .env.local.example
│
└── README.md

```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
OPENAI_API_KEY=sk-proj-...
JWT_SECRET=<shared-secret-with-frontend>
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=<auth-secret>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

## Setup Steps

### 1. Backend
```bash
cd phase-03-ai-chat/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Fill in values
alembic upgrade head  # Run migrations
uvicorn src.main:app --reload --port 8000
```

### 2. Frontend
```bash
cd phase-03-ai-chat/frontend
npm install
cp .env.local.example .env.local  # Fill in values
npm run dev
```

### 3. Run Tests
```bash
# Backend
cd phase-03-ai-chat/backend
pytest

# Frontend
cd phase-03-ai-chat/frontend
npm test
```

## Key Dependencies

### Backend (Python)
- fastapi
- uvicorn[standard]
- sqlmodel
- asyncpg
- alembic
- openai-agents
- chatkit
- pyjwt
- bcrypt
- pydantic-settings
- pytest, pytest-asyncio, httpx (dev)

### Frontend (Node.js)
- next
- react, react-dom
- typescript
- @openai/chatkit-react
- better-auth
- tailwindcss
- vitest, @testing-library/react (dev)

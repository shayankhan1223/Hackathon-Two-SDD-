# Phase 3: AI Chat-Driven Todo Application

An AI-powered, chat-driven Todo application where a chatbot can perform all task operations via MCP-style tools, with calendar views, search/filter/sort, and strict Todo-domain-only chatbot behavior.

## Architecture

- **Backend**: FastAPI + SQLModel + OpenAI Agents SDK (Python 3.12+)
- **Frontend**: Next.js 15 + React 19 + Tailwind CSS (TypeScript)
- **Database**: Neon PostgreSQL (serverless) via asyncpg
- **AI**: OpenAI Agents SDK with @function_tool decorators

## Quick Start

### Backend

```bash
cd phase-03-ai-chat/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Fill in values
alembic upgrade head  # Run migrations
uvicorn src.main:app --reload --port 8000
```

### Frontend

```bash
cd phase-03-ai-chat/frontend
npm install
cp .env.local.example .env.local  # Fill in values
npm run dev
```

## API Endpoints

- `GET /api/health` — Health check
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user profile
- `POST /api/tasks` — Create task
- `GET /api/tasks` — List tasks (with filters)
- `GET /api/tasks/{id}` — Get task
- `PATCH /api/tasks/{id}` — Update task
- `DELETE /api/tasks/{id}` — Delete task
- `POST /api/tasks/{id}/complete` — Complete task
- `GET /api/tags` — List tags
- `GET /api/calendar/month` — Calendar month data
- `GET /api/calendar/day` — Calendar day data
- `POST /api/chat` — Chat with AI agent
- `GET /api/chat/history` — Chat history

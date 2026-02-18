# Hackathon II - Cloud-Native AI Todo Chatbot

A progressive, multi-phase software project built entirely through **Spec-Driven Development (SDD)** with AI governance. Each phase builds upon the previous, culminating in a fully cloud-native, AI-powered Todo application deployed on Kubernetes.

## Project Phases

| Phase | Directory | Description | Stack |
|-------|-----------|-------------|-------|
| **I - Foundation** | `phase-01-console/` | Console-based Todo app with TDD | Python 3.13, pytest |
| **II - Web App** | `phase-02-web/` | Full-stack web Todo with auth | FastAPI, Next.js, Neon PostgreSQL, JWT |
| **III - AI Chat** | `phase-03-ai-chat/` | AI-powered chat Todo with OpenAI Agents | FastAPI, Next.js, OpenAI Agents SDK |
| **IV - Kubernetes** | `phase-04-k8s/` | Local K8s deployment via Minikube & Helm | Docker, Minikube, Helm 3 |

## Quick Start

### Phase I - Console App

```bash
cd phase-01-console
uv sync
uv run python -m src.interface.cli
```

### Phase II - Web Application

**Backend:**

```bash
cd phase-02-web/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `phase-02-web/backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://user:password@your-neon-host.neon.tech/dbname?sslmode=require
JWT_SECRET=your-jwt-secret
CORS_ORIGINS=http://localhost:3000
```

```bash
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend:**

```bash
cd phase-02-web/frontend
npm install
```

Create `phase-02-web/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev
```

Open http://localhost:3000

### Phase III - AI Chat Todo

**Backend:**

```bash
cd phase-03-ai-chat/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `phase-03-ai-chat/backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://user:password@your-neon-host.neon.tech/dbname?sslmode=require
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-api-key
CORS_ORIGINS=http://localhost:3000
```

```bash
uvicorn src.main:app --host 0.0.0.0 --port 7860 --reload
```

**Frontend:**

```bash
cd phase-03-ai-chat/frontend
npm install
```

Create `phase-03-ai-chat/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:7860
```

```bash
npm run dev
```

Open http://localhost:3000

### Phase IV - Kubernetes Deployment

Deploys Phase III application to a local Kubernetes cluster.

**Prerequisites:**

| Tool | Version |
|------|---------|
| Docker | 24.x+ |
| Minikube | v1.32+ |
| Helm 3 | v3.x |
| kubectl | v1.28+ |

**Deploy (3 steps):**

```bash
# 1. Build Docker images
./phase-04-k8s/scripts/build-images.sh

# 2. Setup Minikube cluster and load images
./phase-04-k8s/scripts/setup-cluster.sh

# 3. Deploy via Helm (set your DATABASE_URL first)
export DATABASE_URL="postgresql+asyncpg://user:password@your-neon-host.neon.tech/dbname?sslmode=require"
./phase-04-k8s/scripts/deploy.sh
```

**Access the application:**

```bash
# Backend API
kubectl port-forward svc/todo-backend 7860:7860 -n hackathon-dev &
curl http://localhost:7860/api/health

# Frontend
kubectl port-forward svc/todo-frontend 3000:3000 -n hackathon-dev &
open http://localhost:3000
```

**Validate deployment:**

```bash
./phase-04-k8s/scripts/validate.sh
```

See [Phase IV Deployment Guide](phase-04-k8s/docs/deployment-guide.md) for detailed instructions.

## Architecture

```
Phase I (Console)
    |
    v
Phase II (Web: FastAPI + Next.js + Neon PostgreSQL)
    |
    v
Phase III (AI Chat: + OpenAI Agents SDK)
    |
    v
Phase IV (K8s: Docker + Minikube + Helm)
    |
    +-- hackathon-todo-backend (2 replicas, HPA, health probes)
    +-- hackathon-todo-frontend (2 replicas, HPA, health probes)
    +-- Neon PostgreSQL (external, serverless)
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, SQLModel, OpenAI Agents SDK |
| Frontend | TypeScript, Next.js 16, React 19, Tailwind CSS |
| Database | Neon PostgreSQL (serverless) via asyncpg |
| Auth | JWT-based authentication |
| Container | Docker (multi-stage builds) |
| Orchestration | Kubernetes via Minikube |
| Package Mgmt | Helm 3 |

## Environment Variables

Each phase requires its own `.env` file. See `.env.example` files in each phase directory:

- `phase-02-web/backend/.env` - Database URL, JWT secret
- `phase-03-ai-chat/backend/.env` - Database URL, JWT secret, OpenAI API key
- `phase-04-k8s/.env.example` - K8s deployment configuration

## Development Workflow

This project follows a strict **Spec-Driven Development** lifecycle:

```
/sp.specify  ->  /sp.plan  ->  /sp.tasks  ->  /sp.implement
```

All specifications, plans, and tasks live under `specs/<feature>/`.

## License

This project was created for Hackathon II.

---
id: "0002"
title: "Generate Phase 3 Implementation Plan"
stage: plan
date: 2026-02-10
surface: agent
model: claude-sonnet-4-5-20250929
feature: 004-ai-chat-todo
branch: 004-ai-chat-todo
user: shayan
command: /sp.plan
labels: ["planning", "architecture", "phase-3", "ai-chat-todo"]
links:
  spec: specs/004-ai-chat-todo/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-ai-chat-todo/plan.md
  - specs/004-ai-chat-todo/research.md
  - specs/004-ai-chat-todo/data-model.md
  - specs/004-ai-chat-todo/quickstart.md
  - specs/004-ai-chat-todo/contracts/openapi.yaml
  - specs/004-ai-chat-todo/contracts/mcp-tools.md
  - CLAUDE.md
tests:
  - null
---

## Prompt

/sp.plan

Based on the completed Phase 3 specifications:

Create a detailed, step-by-step execution plan for Phase 3.

The plan must:
- Follow Spec-Driven Development
- Respect Phase 3 architecture and constraints
- Assume Phase 3 lives in its own folder
- Include authentication as part of Phase 3
- Be ordered logically from foundation → features → polish

For each step, include:
1. Goal of the step
2. What will be implemented
3. Dependencies on previous steps
4. Which layer it belongs to:
   - Frontend
   - Backend
   - AI / MCP
   - Database
   - Auth
5. What must be tested before moving forward

Do NOT write code.
Do NOT merge steps together.
Do NOT skip testing considerations.

The output should read like a professional engineering execution roadmap.

## Response snapshot

Generated a comprehensive 15-step execution plan with 6 supporting artifacts:

**Research (Phase 0)**: 7 research decisions covering ChatKit+FastAPI integration pattern, Agent architecture (function_tool vs separate MCP server), Better Auth JWT flow, SQLModel schema design, conversation history management, UI-chatbot bridge via onClientTool, and testing strategy.

**Data Model (Phase 1)**: 5 entities (User, Task, Tag, TaskTag, ChatMessage) with full field definitions, indexes, validation rules, and state transitions.

**API Contracts (Phase 1)**: OpenAPI 3.1 spec with 12 endpoints (health, me, tags, task CRUD, calendar month/day, chatkit). MCP tools contract with 9 agent tools + 3 client tools.

**Execution Roadmap (15 Steps)**:
1. Project scaffolding (Infrastructure)
2. Database & SQLModel schema (Database)
3. JWT auth middleware (Auth/Backend)
4. Task CRUD REST API (Backend)
5. Agent function tools (AI/MCP)
6. Agent definition & system prompt (AI)
7. ChatKit server integration (AI/Backend)
8. Frontend auth with Better Auth (Frontend/Auth)
9. Dashboard & task list UI (Frontend)
10. Chat panel with ChatKit (Frontend/AI)
11. Calendar component (Frontend)
12. Search/filter/sort UI (Frontend)
13. Bulk operations & confirmation (AI/Frontend)
14. Analytics queries (AI/Backend)
15. E2E testing & polish (All)

Each step maps to specific TR-XXX test requirements from the spec.

## Outcome

- ✅ Impact: Complete architectural plan with all technology decisions resolved, contracts defined, and 15-step roadmap ready for task generation
- 🧪 Tests: No code tests — planning phase. Test requirements mapped to steps (TR-001 through TR-012)
- 📁 Files: Created 6 artifacts (plan.md, research.md, data-model.md, quickstart.md, openapi.yaml, mcp-tools.md). Updated CLAUDE.md with new technologies.
- 🔁 Next prompts: /sp.tasks to generate detailed task breakdown, then /sp.implement to begin coding
- 🧠 Reflection: Key architectural decision was using @function_tool (not a separate MCP server process) since both agent and tools run in the same FastAPI process. ChatKit integration simplifies the chat UI significantly vs building custom WebSocket streaming.

## Evaluation notes (flywheel)

- Failure modes observed: Web search was unavailable during research; relied on Context7 MCP and existing knowledge for ChatKit patterns
- Graders run and results (PASS/FAIL): All research questions resolved (PASS), data model covers all spec entities (PASS), contracts match spec requirements (PASS)
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

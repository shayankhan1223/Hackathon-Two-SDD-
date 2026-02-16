---
id: "0005"
title: "Update Plan for Spec v1.2 Home Auth"
stage: plan
date: 2026-02-11
surface: agent
model: claude-sonnet-4-5-20250929
feature: 004-ai-chat-todo
branch: 004-ai-chat-todo
user: shayan
command: /sp.plan
labels: ["home-page", "authentication", "api-contract", "spec-v1.2"]
links:
  spec: specs/004-ai-chat-todo/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-ai-chat-todo/plan.md
  - specs/004-ai-chat-todo/research.md
  - specs/004-ai-chat-todo/contracts/openapi.yaml
tests:
  - null
---

## Prompt

Update implementation plan according to specification v1.2.
Focus only on:
- Home Page navigation updates
- Authentication API contract alignment
Do not modify unrelated architectural sections.

## Response snapshot

Updated the implementation plan (`plan.md`) to focus on specification v1.2 requirements:

1. **Home Page Navigation Updates**:
   - Current: Redirects all users (auth to `/tasks`, unauth to `/sign-in`)
   - Required: Show "Sign In" and "Sign Up" buttons for unauthenticated users, redirect authenticated to `/dashboard`
   - Added requirements for button styling (primary/secondary), accessibility (44x44px touch targets, screen reader labels), and visual feedback

2. **Authentication API Contract Alignment**:
   - Endpoint changes: `/api/auth/sign-up` → `/api/auth/register`, `/api/auth/sign-in` → `/api/auth/login`
   - Response schema: Changed from `{user_id, token}` to `{token, user: {id, email, created_at}}`
   - Added `/api/auth/me` endpoint specification

3. **Updated Artifacts**:
   - `plan.md`: Complete implementation details with file-by-file changes
   - `research.md`: Added R-008 (Home Page) and R-009 (Auth API) research findings
   - `contracts/openapi.yaml`: Added auth endpoints with proper schemas

## Outcome

- ✅ Impact: Plan updated with focused scope on Home Page and Auth API alignment
- 🧪 Tests: Test requirements defined (backend auth tests, frontend button/redirect tests)
- 📁 Files: 3 files modified (plan.md, research.md, openapi.yaml)
- 🔁 Next prompts: /sp.tasks to generate implementation tasks
- 🧠 Reflection: Successfully scoped plan to only the requested changes without modifying unrelated sections

## Evaluation notes (flywheel)

- Failure modes observed: None - plan generation completed successfully
- Graders run and results (PASS/FAIL): N/A - planning phase
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Generate tasks with /sp.tasks

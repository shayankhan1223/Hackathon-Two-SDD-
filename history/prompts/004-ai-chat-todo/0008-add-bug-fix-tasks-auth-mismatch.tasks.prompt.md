---
id: 0008
title: Add Bug Fix Tasks Auth Mismatch
stage: tasks
date: 2026-02-11
surface: agent
model: claude-sonnet-4-5-20250929
feature: 004-ai-chat-todo
branch: 004-ai-chat-todo
user: shayan
command: /sp.tasks
labels: ["bug-fix", "authentication", "api-mismatch"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-ai-chat-todo/tasks.md
  - phase-02-web/frontend/src/app/(auth)/sign-up/page.tsx
  - phase-02-web/frontend/src/app/(auth)/sign-in/page.tsx
tests:
  - null
---

## Prompt

Add task with tag Bug Fix: There are two bugs 1st) It's home page is not a professional Home Page because it don't have Login and Sign Up button for User, so user cannot Login, Sign Up with Home page. 2nd) After hitting URL with /sign-up, Sign Up page appears and when we type email and password it says: Failed to fetch.

## Response snapshot

**Bug Analysis:**
1. **Bug 1 (Not a bug)**: Home page already has Sign In and Sign Up buttons (added in previous PHR 0007)
2. **Bug 2 (Real bug)**: Auth API method name mismatch:
   - sign-up page called `authAPI.signUp()` but api-client has `authAPI.register()`
   - sign-in page called `authAPI.signIn()` but api-client has `authAPI.login()`

**Tasks Added:**
- T000a [Bug Fix] - Update sign-up page to call `authAPI.register`
- T000b [Bug Fix] - Update sign-in page to call `authAPI.login`

**Bugs Fixed:**
- Changed `authAPI.signUp` → `authAPI.register` in sign-up/page.tsx:48
- Changed `authAPI.signIn` → `authAPI.login` in sign-in/page.tsx:48

## Outcome

- ✅ Impact: Critical bug fix enabling user registration and login
- 🧪 Tests: Manual testing required - register/login should work without "Failed to fetch"
- 📁 Files: 3 files modified (tasks.md, sign-up/page.tsx, sign-in/page.tsx)
- 🔁 Next prompts: Test the authentication flow end-to-end
- 🧠 Reflection: API client was updated in earlier task but auth pages weren't updated in sync

## Evaluation notes (flywheel)

- Failure modes observed: API method rename in one file but not updating consumers
- Graders run and results (PASS/FAIL): N/A - bug fix
- Prompt variant (if applicable): N/A
- Next experiment: Add linting rule to detect undefined method calls

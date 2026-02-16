---
id: 0005
title: Phase III Round 2 Implementation Plan
stage: plan
date: 2026-02-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: 006-phase3-improvements
branch: 006-phase3-improvements
user: shayan
command: /sp.plan
labels: ["plan", "auth-routing", "theme-fix", "calendar-sync", "round2"]
links:
  spec: specs/006-phase3-improvements/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/006-phase3-improvements/plan.md
  - specs/006-phase3-improvements/research.md
tests:
  - null
---

## Prompt

Generate structured architectural plan for Phase III Improvement Round 2.

IMPORTANT:
Plan must execute strictly Phase-by-Phase.
Each phase must include validation checkpoint before next phase begins.

Include:
- Files to update
- Components affected
- Endpoints affected
- Database changes (if any)
- Testing strategy per phase
- Rollback considerations
- Risk analysis

Do not mix phases.

## Response snapshot

Generated comprehensive implementation plan at `specs/006-phase3-improvements/plan.md` with three strictly sequential phases:

1. **Phase III-E (Auth Routing)**: 10 broken links across 5 files — string replacements only. Root cause: `/auth/` prefix used for Next.js `(auth)` route group pages. Complete change manifest with exact file:line mappings.

2. **Phase III-F (Theme System)**: React Context-based ThemeProvider replaces independent `useTheme` hook instances. Dark mode text fixes for Settings notifications labels and auth pages. 8 files affected.

3. **Phase III-G (Calendar Sync)**: Replace hardcoded `getTasksForDay()` mock data and static "Upcoming Events" with `api.tasks.list()` API fetch. Wire `handleTaskCreated()` callback. 1 file major modification.

Each phase includes: validation checkpoint, rollback plan, risk analysis, testing strategy. Research appended with 3 new research areas (R2-1, R2-2, R2-3).

## Outcome

- Impact: Structured plan for 3 sequential phases, ~10 files, 0 backend changes, 0 DB changes, 1 new component
- Tests: 16 test requirements defined (TR-011 through TR-026), manual validation per phase
- Files: 2 files updated (plan.md, research.md), agent context updated
- Next prompts: /sp.tasks to generate atomic implementation tasks
- Reflection: Deeper codebase scan revealed 10 broken links (not 4 as initially spec'd) — research phase caught additional `/auth/sign-in` references in settings, profile, and reset-password pages

## Evaluation notes (flywheel)

- Failure modes observed: Initial spec documented 4 broken links; thorough grep found 10 total
- Graders run and results (PASS/FAIL): Constitution check PASS, all invariants maintained
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Phase III-E is 10 string replacements — fastest phase to implement and validate

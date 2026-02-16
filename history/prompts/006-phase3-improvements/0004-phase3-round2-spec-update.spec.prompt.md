---
id: 0004
title: Phase III Round 2 Spec Update
stage: spec
date: 2026-02-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: 006-phase3-improvements
branch: 006-phase3-improvements
user: shayan
command: /sp.specify
labels: ["spec-update", "auth-routing", "theme-fix", "calendar-sync", "round2"]
links:
  spec: specs/006-phase3-improvements/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/006-phase3-improvements/spec.md
  - specs/006-phase3-improvements/checklists/requirements-round2.md
tests:
  - null
---

## Prompt

We are performing Phase III Improvement Update – Round 2.

Context:
- Phase I, II, III are completed.
- Specifications already exist inside /specs.
- Some earlier issues were resolved.
- The following issues remain unresolved.
- We are updating existing specs only.
- We are NOT rewriting the project.

Goal:
Refine and extend specifications to resolve remaining routing, theme, and calendar synchronization issues.

IMPORTANT EXECUTION RULE:
The improvement must be divided into structured sub-phases.
Each phase must:
1. Be fully specified.
2. Include acceptance criteria.
3. Include test requirements.
4. Be completed and validated before moving to the next phase.

No overlapping execution.
No parallel fixes.
Strict sequential improvement.

========================================================
PHASE III-E — Authentication Routing & Password Flow Fix
========================================================

Issues:
1. Forgot Password link → PageNotFound.
2. Change Password button in Settings → PageNotFound.

[Full prompt continues — see user input for complete text including Phase III-F (Theme System) and Phase III-G (Calendar Sync)]

## Response snapshot

Updated `specs/006-phase3-improvements/spec.md` with three new sub-phases:

1. **Phase III-E (User Story 10)**: Authentication routing fix — root cause identified as incorrect `/auth/` prefix in internal links for Next.js route group `(auth)`. Documented 4 broken links with correct paths. 8 acceptance scenarios, 5 functional requirements (FR-028–032), 5 tests (TR-011–015).

2. **Phase III-F (User Story 11)**: Global theme system fix — root cause identified as independent `useTheme` hook instances and missing `dark:text-*` classes on Settings notifications labels (lines 222, 232). Design token table defined. 6 acceptance scenarios, 4 functional requirements (FR-033–036), 5 tests (TR-016–020).

3. **Phase III-G (User Story 12)**: Calendar sync fix — root cause identified as hardcoded mock data in `getTasksForDay()` and "Upcoming Events" section, plus empty `handleTaskCreated()` callback. Task-to-calendar mapping rules defined. 7 acceptance scenarios, 5 functional requirements (FR-037–041), 6 tests (TR-021–026).

Created quality checklist at `specs/006-phase3-improvements/checklists/requirements-round2.md` — all items pass.

## Outcome

- Impact: Specification extended with 3 sub-phases covering 14 new functional requirements, 7 new success criteria, 16 new test requirements
- Tests: No code tests — specification only. 16 test requirements defined for implementation phase.
- Files: 2 files modified/created (spec.md updated, requirements-round2.md created)
- Next prompts: /sp.plan to generate implementation plan for Phase III-E, III-F, III-G
- Reflection: Root cause analysis from codebase exploration was critical — the auth routing issue was a Next.js route group naming convention problem, not missing pages

## Evaluation notes (flywheel)

- Failure modes observed: None — all pages and endpoints exist, issues are routing/data-binding only
- Graders run and results (PASS/FAIL): Specification quality checklist — PASS (all items)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Implement Phase III-E first (4 link URL corrections) as smallest viable fix

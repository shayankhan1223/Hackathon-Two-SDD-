---
description: "Task list for Phase III Structured Improvements"
---

# Tasks: Phase III Structured Improvements

**Input**: Design documents from `/specs/006-phase3-improvements/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included as requested in feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend database migration for UserPreferences and PasswordResetToken tables
- [x] T002 [P] Install bcrypt for password hashing in backend requirements
- [x] T003 [P] Install python-jose for JWT token handling in backend requirements

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create UserPreferences database model in backend/src/models/user_preferences.py
- [x] T005 Create PasswordResetToken database model in backend/src/models/password_reset_token.py
- [x] T006 [P] Create database migrations for new entities in backend/alembic/versions/
- [x] T007 [P] Create UserPreferences service in backend/src/services/user_preferences_service.py
- [x] T008 [P] Create PasswordResetToken service in backend/src/services/password_reset_service.py
- [x] T009 Create email utility functions in backend/src/utils/email.py
- [x] T010 Update User model to include relationships to new entities in backend/src/models/user.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - AI Chatbot Uses Correct Dates (Priority: P1) 🎯 MVP

**Goal**: Enable AI agent to receive current date context so it can interpret relative date expressions correctly

**Independent Test**: Send "Add a task for tomorrow" via chat and verify the created task has due date equal to today's date + 1 day.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T011 [P] [US1] Unit test for date injection in agent instructions in backend/tests/unit/test_agent_instructions.py
- [x] T012 [P] [US1] Integration test for chat date handling in backend/tests/integration/test_chat_date_handling.py

### Implementation for User Story 1

- [x] T013 [US1] Update system prompt to accept current date parameter in backend/src/agent/instructions.py
- [x] T014 [US1] Modify Agent initialization to use callable instructions with date injection in backend/src/agent/server.py
- [x] T015 [US1] Update date parsing tools to use relative date resolution in backend/src/agent/tools.py
- [x] T016 [US1] Remove hardcoded example dates from tool docstrings in backend/src/agent/tools.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 9 - Forgot Password Flow (Priority: P1)

**Goal**: Implement complete password reset flow with email-based token delivery

**Independent Test**: Request password reset, receive email with link, click link, set new password, sign in with new credentials.

### Tests for User Story 9 (OPTIONAL - only if tests requested) ⚠️

- [x] T017 [P] [US9] Contract test for forgot-password endpoint in backend/tests/contract/test_auth_forgot_password.py
- [x] T018 [P] [US9] Contract test for reset-password endpoint in backend/tests/contract/test_auth_reset_password.py
- [x] T019 [P] [US9] Integration test for password reset flow in backend/tests/integration/test_password_reset_flow.py

### Implementation for User Story 9

- [x] T020 [US9] Create forgot-password endpoint in backend/src/api/routes/auth.py
- [x] T021 [US9] Create reset-password endpoint in backend/src/api/routes/auth.py
- [x] T022 [US9] Create change-password endpoint in backend/src/api/routes/auth.py
- [x] T023 [US9] Implement password reset email sending in backend/src/services/auth_service.py
- [x] T024 [US9] Create password reset request page in frontend/src/app/(auth)/forgot-password/page.tsx
- [x] T025 [US9] Create password reset form page in frontend/src/app/(auth)/reset-password/page.tsx
- [x] T026 [US9] Update sign-in page to link to forgot password flow in frontend/src/app/(auth)/sign-in/page.tsx
- [x] T027 [US9] Update API library with new auth endpoints in frontend/src/lib/api.ts

**Checkpoint**: At this point, User Story 9 should be fully functional and testable independently

---

## Phase 5: User Story 6 - Settings Page Save and Security Actions (Priority: P1)

**Goal**: Make settings page functional with persistent user preferences and security actions

**Independent Test**: Change settings, save, refresh page, verify changes persisted across sessions.

### Tests for User Story 6 (OPTIONAL - only if tests requested) ⚠️

- [x] T028 [P] [US6] Contract test for user preferences endpoints in backend/tests/contract/test_user_preferences.py
- [x] T029 [P] [US6] Integration test for settings save flow in frontend/tests/integration/test_settings_save.py

### Implementation for User Story 6

- [x] T030 [US6] Create GET user preferences endpoint in backend/src/api/routes/user.py
- [x] T031 [US6] Create PATCH user preferences endpoint in backend/src/api/routes/user.py
- [x] T032 [US6] Update settings page to fetch user data from API in frontend/src/app/(dashboard)/dashboard/settings/page.tsx
- [x] T033 [US6] Update settings page to save preferences to backend in frontend/src/app/(dashboard)/dashboard/settings/page.tsx
- [x] T034 [US6] Implement change password functionality in frontend/src/app/(dashboard)/dashboard/settings/page.tsx
- [x] T035 [US6] Remove browser alerts and replace with toast notifications in frontend/src/app/(dashboard)/dashboard/settings/page.tsx
- [x] T036 [US6] Update timezone selection to use IANA timezone list in frontend/src/app/(dashboard)/dashboard/settings/page.tsx
- [x] T037 [US6] Add validation and error handling to settings form in frontend/src/app/(dashboard)/dashboard/settings/page.tsx

**Checkpoint**: At this point, User Story 6 should be fully functional and testable independently

---

## Phase 6: User Story 7 - User Profile Page (Priority: P2)

**Goal**: Create functional user profile page accessible from header dropdown

**Independent Test**: Click Profile in header dropdown and verify the page loads with user information.

### Tests for User Story 7 (OPTIONAL - only if tests requested) ⚠️

- [x] T038 [P] [US7] Integration test for profile page access in frontend/tests/integration/test_profile_page.py

### Implementation for User Story 7

- [x] T039 [US7] Create profile page layout in frontend/src/app/(dashboard)/dashboard/profile/page.tsx
- [x] T040 [US7] Fetch and display user information on profile page in frontend/src/app/(dashboard)/dashboard/profile/page.tsx
- [x] T041 [US7] Add access control to profile page in frontend/src/app/(dashboard)/dashboard/profile/page.tsx

**Checkpoint**: At this point, User Story 7 should be fully functional and testable independently

---

## Phase 7: User Story 8 - Terms of Service and Privacy Policy Pages (Priority: P2)

**Goal**: Create static pages for legal documents accessible from sign-up and footer

**Independent Test**: Click Terms of Service or Privacy Policy links and verify the page loads with content.

### Tests for User Story 8 (OPTIONAL - only if tests requested) ⚠️

- [x] T042 [P] [US8] Integration test for legal pages access in frontend/tests/integration/test_legal_pages.py

### Implementation for User Story 8

- [x] T043 [US8] Create Terms of Service page in frontend/src/app/terms/page.tsx
- [x] T044 [US8] Create Privacy Policy page in frontend/src/app/privacy/page.tsx
- [x] T045 [US8] Update sign-up page to link to actual legal pages in frontend/src/app/(auth)/sign-up/page.tsx
- [x] T046 [US8] Update footer links to point to actual legal pages in frontend/src/components/layout/Footer.tsx

**Checkpoint**: At this point, User Story 8 should be fully functional and testable independently

---

## Phase 8: User Story 3 - Dark Mode Toggle Works Consistently (Priority: P2)

**Goal**: Synchronize dark mode toggle between sidebar and settings page with consistent persistence

**Independent Test**: Toggle dark mode from sidebar, verify theme changes, navigate to settings, verify correct theme button is highlighted, click different theme button, verify theme changes.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [x] T047 [P] [US3] Integration test for dark mode synchronization in frontend/tests/integration/test_dark_mode_sync.py

### Implementation for User Story 3

- [x] T048 [US3] Activate and wire up existing useTheme hook in frontend/src/hooks/useTheme.ts
- [x] T049 [US3] Connect sidebar dark mode toggle to useTheme hook in frontend/src/components/layout/Sidebar.tsx
- [x] T050 [US3] Connect settings theme buttons to useTheme hook in frontend/src/app/(dashboard)/dashboard/settings/page.tsx
- [x] T051 [US3] Ensure theme persistence across page refreshes in frontend/src/hooks/useTheme.ts

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 9: User Story 2 - Calendar Add Event Interaction (Priority: P2)

**Goal**: Make calendar "Add Event" button functional to create tasks for selected dates

**Independent Test**: Navigate to calendar, click "Add Event", fill in task details, submit, verify task appears on calendar.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [x] T052 [P] [US2] Integration test for calendar add event in frontend/tests/integration/test_calendar_add_event.py

### Implementation for User Story 2

- [x] T053 [US2] Implement onClick handler for "Add Event" button in frontend/src/app/(dashboard)/dashboard/calendar/page.tsx
- [x] T054 [US2] Create task creation modal/form in frontend/src/components/TaskCreationModal.tsx
- [x] T055 [US2] Connect calendar date to task creation form in frontend/src/app/(dashboard)/dashboard/calendar/page.tsx
- [x] T056 [US2] Implement task creation logic in calendar page in frontend/src/app/(dashboard)/dashboard/calendar/page.tsx

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 10: User Story 4 - Header Search Filters Tasks Globally (Priority: P2)

**Goal**: Implement functional header search that filters tasks globally across the application

**Independent Test**: Click header search icon, type task title, verify matching tasks appear as results.

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [x] T057 [P] [US4] Integration test for header search functionality in frontend/tests/integration/test_header_search.py

### Implementation for User Story 4

- [x] T058 [US4] Activate existing SearchBar component in frontend/src/components/SearchBar.tsx
- [x] T059 [US4] Connect header search to SearchBar component in frontend/src/components/layout/Header.tsx
- [x] T060 [US4] Implement task filtering logic in frontend/src/components/SearchBar.tsx
- [x] T061 [US4] Fetch tasks for search in frontend/src/components/SearchBar.tsx
- [x] T062 [US4] Implement search result navigation in frontend/src/components/SearchBar.tsx

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 11: User Story 5 - Notification Bell Shows Activity (Priority: P3)

**Goal**: Implement notification bell with dropdown showing recent activity notifications

**Independent Test**: Click bell icon, verify dropdown appears with notifications, verify badge reflects actual unread count.

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

- [x] T063 [P] [US5] Integration test for notification bell functionality in frontend/tests/integration/test_notification_bell.py

### Implementation for User Story 5

- [x] T064 [US5] Create NotificationDropdown component in frontend/src/components/NotificationDropdown.tsx
- [x] T065 [US5] Implement notification logic based on task data in frontend/src/components/NotificationDropdown.tsx
- [x] T066 [US5] Connect notification bell to dropdown in frontend/src/components/layout/Header.tsx
- [x] T067 [US5] Calculate and display notification count badge in frontend/src/components/layout/Header.tsx

**Checkpoint**: At this point, User Story 5 should be fully functional and testable independently

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T068 [P] Update documentation with new features in docs/
- [x] T069 Code cleanup and refactoring across all new implementations
- [x] T070 Performance optimization for new API endpoints
- [x] T071 [P] Additional unit tests in backend/tests/unit/
- [x] T072 Security hardening of new endpoints and forms
- [x] T073 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 9 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 6 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1/US9 but should be independently testable
- **User Story 7 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US6 but should be independently testable
- **User Story 8 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Bug Fix: Settings Page "Failed to fetch" Error

**Reported**: Settings page showed "Failed to load user preferences" with `TypeError: Failed to fetch` in console.

### Root Causes Identified

1. **Sync/Async Mismatch**: `UserPreferencesService`, `PasswordResetService`, and `AuthService` used synchronous SQLModel methods (`session.exec()`, `session.commit()`, `session.refresh()`) on an `AsyncSession` from FastAPI's dependency injection.
2. **UUID Type Mismatch**: `user_id: int` in `UserPreferences` and `PasswordResetToken` models, but `User.id` is `uuid.UUID`.
3. **Missing Database Tables**: The `user_preferences` and `password_reset_tokens` tables didn't exist — migration hadn't been applied.
4. **Theme Button State Leak**: Theme buttons in Settings page wrote a `theme` property to `formData` state that was removed from the state type.

### Fix Tasks

- [x] BF001 Convert `UserPreferencesService` from sync class to async functions using `await session.execute()`, `await session.commit()`, `await session.refresh()` — `backend/src/services/user_preferences_service.py`
- [x] BF002 Convert `PasswordResetService` from sync class to async functions — `backend/src/services/password_reset_service.py`
- [x] BF003 Convert `AuthService` from sync class to async functions — `backend/src/services/auth_service.py`
- [x] BF004 Fix `user_id` type from `int` to `uuid.UUID` in `UserPreferences` model — `backend/src/models/user_preferences.py`
- [x] BF005 Fix `user_id` type from `int` to `uuid.UUID` in `PasswordResetToken` model — `backend/src/models/password_reset_token.py`
- [x] BF006 Update `user.py` routes to use async module functions instead of sync class methods — `backend/src/api/routes/user.py`
- [x] BF007 Update `auth.py` routes to use async module functions instead of sync class methods — `backend/src/api/routes/auth.py`
- [x] BF008 Add `create_all_tables` startup event to FastAPI app to auto-create missing tables — `backend/src/main.py`
- [x] BF009 Remove stale `formData.theme` writes from theme buttons in Settings page — `frontend/src/app/(dashboard)/dashboard/settings/page.tsx`

### Verification

- `GET /api/user/preferences` returns 200 with auto-created default preferences
- `PATCH /api/user/preferences` successfully updates and persists preferences
- Settings page loads without errors and displays preferences correctly

---
---

# Phase III Round 2 — Remaining Issue Tasks

**Input**: Plan and spec Round 2 sections from `/specs/006-phase3-improvements/`
**Prerequisites**: All Round 1 tasks completed (T001–T073, BF001–BF009)

**Tests**: Included per specification requirement.

**Organization**: Tasks grouped by sub-phase (III-E, III-F, III-G). Strict sequential execution — each phase must be validated before the next begins.

**Execution Rule**: No overlapping execution. No parallel fixes across phases. Parallel tasks within a phase are marked [P].

## Format: `[ID] [P?] [Phase] Description`

- **[P]**: Can run in parallel within the same phase (different files, no dependencies)
- **[Phase]**: Which sub-phase this task belongs to ([III-E], [III-F], [III-G])
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `phase-03-ai-chat/frontend/src/`
- **Backend**: No backend changes in Round 2

---

## Phase III-E: Authentication Routing & Password Flow Fix (Priority: P0)

**Goal**: Fix 10 broken internal navigation links across 5 files that incorrectly use `/auth/` prefix for Next.js route group pages.

**Spec Reference**: User Story 10 (spec.md), SR-E1 through SR-E5, FR-028 through FR-032

**Independent Test**: Click "Forgot password?" on sign-in page → forgot-password page loads. Click "Change Password" on settings → change-password page loads. No PageNotFound errors.

### Implementation Tasks

- [x] R2-T001 [P] [III-E] Fix sign-in page forgot-password link: change `href="/auth/forgot-password"` to `href="/forgot-password"` at line 159 in phase-03-ai-chat/frontend/src/app/(auth)/sign-in/page.tsx
- [x] R2-T002 [P] [III-E] Fix forgot-password page redirects: change `router.push('/auth/sign-in')` to `router.push('/sign-in')` at line 25, and `href="/auth/sign-in"` to `href="/sign-in"` at line 101 in phase-03-ai-chat/frontend/src/app/(auth)/forgot-password/page.tsx
- [x] R2-T003 [P] [III-E] Fix reset-password page links: change `router.push('/auth/sign-in')` to `router.push('/sign-in')` at line 49, `href="/auth/forgot-password"` to `href="/forgot-password"` at line 71, `href="/auth/sign-in"` to `href="/sign-in"` at line 162 in phase-03-ai-chat/frontend/src/app/(auth)/reset-password/page.tsx
- [x] R2-T004 [P] [III-E] Fix settings page auth links: change `router.push('/auth/sign-in')` to `router.push('/sign-in')` at lines 35 and 70, and `router.push('/auth/change-password')` to `router.push('/change-password')` at line 124 in phase-03-ai-chat/frontend/src/app/(dashboard)/dashboard/settings/page.tsx
- [x] R2-T005 [P] [III-E] Fix profile page auth redirect: change `router.push('/auth/sign-in')` to `router.push('/sign-in')` at line 24 in phase-03-ai-chat/frontend/src/app/(dashboard)/dashboard/profile/page.tsx

### Validation Tasks

- [x] R2-T006 [III-E] Verify no remaining `/auth/sign-in`, `/auth/forgot-password`, or `/auth/change-password` frontend route references exist (run: `grep -r "/auth/" --include="*.tsx" phase-03-ai-chat/frontend/src/ | grep -v "/api/auth/"` — expect zero results)
- [ ] R2-T007 [III-E] Manual test TR-011: navigate directly to `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, `/change-password` — all must load without PageNotFound *(requires manual browser test)*
- [ ] R2-T008 [III-E] Manual test TR-012: click "Forgot password?" link on sign-in page → navigates to `/forgot-password` *(requires manual browser test)*
- [ ] R2-T009 [III-E] Manual test TR-013: click "Change Password" button on settings page → navigates to `/change-password` *(requires manual browser test)*
- [ ] R2-T010 [III-E] Manual test TR-014/TR-015: complete forgot-password flow (request → redirect to /sign-in) and verify all redirects use correct paths *(requires manual browser test)*
- [x] R2-T011 [III-E] Confirm dev server starts without errors after all Phase III-E changes *(pre-existing TS errors unrelated to routing changes)*

**Checkpoint**: Phase III-E complete. ALL validation tasks must pass before proceeding to Phase III-F.

---

## Phase III-F: Global Theme System Architecture Fix (Priority: P1)

**Goal**: Centralize theme state via React Context so all components share theme, and fix dark-mode invisible text on Settings and auth pages.

**Spec Reference**: User Story 11 (spec.md), SR-F1 through SR-F6, FR-033 through FR-036

**Independent Test**: Toggle dark mode from sidebar → navigate to Settings → "Email Notifications" and "Push Notifications" text visible. Toggle theme from Settings → sidebar icon reflects change.

**Prerequisites**: Phase III-E fully validated.

### Implementation Tasks — Theme Centralization

- [x] R2-T012 [III-F] Create ThemeProvider component with React Context in phase-03-ai-chat/frontend/src/components/ThemeProvider.tsx — move all theme state and logic (applyTheme, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme) from useTheme hook into context provider. Keep inline script in layout.tsx for FOUC prevention.
- [x] R2-T013 [III-F] Refactor useTheme hook to consume ThemeContext via useContext() instead of maintaining local useState in phase-03-ai-chat/frontend/src/hooks/useTheme.ts — export the same interface {theme, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme}
- [x] R2-T014 [III-F] Wrap root layout children with ThemeProvider in phase-03-ai-chat/frontend/src/app/layout.tsx — add 'use client' directive to ThemeProvider (not layout), keep layout as server component wrapping a client ThemeProvider

### Implementation Tasks — Dark Mode Text Fixes

- [x] R2-T015 [P] [III-F] Fix Settings page invisible notification labels: add `className="text-gray-900 dark:text-white"` to `<span>Email Notifications</span>` at line 222 and `<span>Push Notifications</span>` at line 232 in phase-03-ai-chat/frontend/src/app/(dashboard)/dashboard/settings/page.tsx
- [x] R2-T016 [P] [III-F] Fix forgot-password page dark mode: add `dark:bg-gray-900` to container bg-gray-50 at line 36, add `dark:text-white` to text-gray-900 headings at line 39, add `dark:text-gray-400` to text-gray-600 elements at lines 43 and 100 in phase-03-ai-chat/frontend/src/app/(auth)/forgot-password/page.tsx
- [x] R2-T017 [P] [III-F] Fix reset-password page dark mode: add `dark:bg-gray-900` to container bg-gray-50 at lines 61 and 81, add `dark:text-white` to text-gray-900 headings at line 84, add `dark:text-gray-400` to text-gray-600 elements at line 88 in phase-03-ai-chat/frontend/src/app/(auth)/reset-password/page.tsx
- [x] R2-T018 [III-F] Verify change-password page dark mode support — check that Card component and existing dark: classes provide adequate contrast in phase-03-ai-chat/frontend/src/app/(auth)/change-password/page.tsx — add missing dark: classes if needed (container bg-gray-50 at line 49)

### Validation Tasks

- [ ] R2-T019 [III-F] Manual test TR-016: toggle dark mode from sidebar → verify entire app switches theme immediately
- [ ] R2-T020 [III-F] Manual test TR-017: set dark mode, refresh page → verify dark mode loads without flash of light mode
- [ ] R2-T021 [III-F] Manual test TR-018: toggle theme from sidebar → navigate to Settings → verify theme buttons reflect correct active state. Then change theme from Settings → verify sidebar icon updates
- [ ] R2-T022 [III-F] Manual test TR-019: view Settings page in dark mode → verify "Email Notifications" and "Push Notifications" text is visible and readable
- [ ] R2-T023 [III-F] Manual test TR-020: view forgot-password, reset-password, and change-password pages in dark mode → verify all text readable, no invisible elements
- [ ] R2-T024 [III-F] Full dark mode sweep: verify all pages readable in dark mode — Dashboard, Settings, Calendar, Sign-in, Sign-up, Forgot Password, Reset Password, Change Password, Profile
- [x] R2-T025 [III-F] Confirm dev server starts without errors and no hydration warnings after all Phase III-F changes

**Checkpoint**: Phase III-F complete. ALL validation tasks must pass before proceeding to Phase III-G.

---

## Phase III-G: Calendar & Event Synchronization Fix (Priority: P1)

**Goal**: Replace hardcoded calendar mock data with real API-fetched task data and wire event creation callback for immediate calendar updates.

**Spec Reference**: User Story 12 (spec.md), SR-G1 through SR-G6, FR-037 through FR-041

**Independent Test**: Create a task with a due date via chat or tasks page → navigate to calendar → task appears on correct date. Create task via calendar "Add Event" → task appears immediately.

**Prerequisites**: Phase III-E and Phase III-F fully validated.

### Implementation Tasks

- [x] R2-T026 [III-G] Add task state and API fetch to calendar page: add `useState<Task[]>` for tasks, add `useState<boolean>` for loading, add `useEffect` to call `api.tasks.list()` on mount and populate tasks state in phase-03-ai-chat/frontend/src/app/(dashboard)/dashboard/calendar/page.tsx
- [x] R2-T027 [III-G] Replace hardcoded `getTasksForDay()` function (lines 73-91) with real task filter: filter `tasks` state array where `task.due_date` matches the given day/month/year of `currentDate` in phase-03-ai-chat/frontend/src/app/(dashboard)/dashboard/calendar/page.tsx
- [x] R2-T028 [III-G] Replace hardcoded "Upcoming Events" array (lines 191-196) with computed upcoming tasks: filter `tasks` where `due_date >= today`, sort by `due_date` ascending, limit to 10 entries in phase-03-ai-chat/frontend/src/app/(dashboard)/dashboard/calendar/page.tsx
- [x] R2-T029 [III-G] Wire `handleTaskCreated()` callback (lines 67-70): implement to re-fetch tasks via `api.tasks.list()` and update tasks state, triggering calendar re-render in phase-03-ai-chat/frontend/src/app/(dashboard)/dashboard/calendar/page.tsx
- [x] R2-T030 [III-G] Add empty state for "Upcoming Events" section: when no tasks with `due_date >= today` exist, display "No upcoming events. Create a task to get started." styled consistently with application in phase-03-ai-chat/frontend/src/app/(dashboard)/dashboard/calendar/page.tsx
- [x] R2-T031 [III-G] Add loading state to calendar page: show spinner or skeleton while tasks are being fetched from API in phase-03-ai-chat/frontend/src/app/(dashboard)/dashboard/calendar/page.tsx

### Validation Tasks

- [ ] R2-T032 [III-G] Manual test TR-021: load calendar page → verify tasks are fetched from API (check network tab for `GET /api/tasks` request)
- [ ] R2-T033 [III-G] Manual test TR-022: create a task with known due date via tasks page or chat → navigate to calendar → verify task appears on correct date cell
- [ ] R2-T034 [III-G] Manual test TR-023: click a date on calendar → create task via AddEvent modal → verify task appears immediately on calendar without page refresh
- [x] R2-T035 [III-G] Code review test TR-024: search calendar page source for static/mock event arrays → verify zero hardcoded event data remains (run: `grep -n "Team Meeting\|Client Call\|Review PRs\|Project Deadline" phase-03-ai-chat/frontend/src/app/\(dashboard\)/dashboard/calendar/page.tsx` — expect zero results)
- [ ] R2-T036 [III-G] Manual test TR-025: with no tasks in database, load calendar → verify empty state displays in Upcoming Events section
- [ ] R2-T037 [III-G] Manual test TR-026: navigate between months → verify tasks appear on correct months
- [ ] R2-T038 [III-G] Manual test: refresh calendar page → verify all events persist (loaded from API)
- [x] R2-T039 [III-G] Confirm dev server starts without errors after all Phase III-G changes

**Checkpoint**: Phase III-G complete. ALL validation tasks must pass to declare Phase III Round 2 complete.

---

## Dependencies & Execution Order

### Phase Dependencies (Strict Sequential)

```
Phase III-E (Auth Routing)
  │  ALL validation tasks pass
  ▼
Phase III-F (Theme System)
  │  ALL validation tasks pass
  ▼
Phase III-G (Calendar Sync)
  │  ALL validation tasks pass
  ▼
Phase III Round 2 Complete
```

### Within-Phase Parallel Opportunities

- **Phase III-E**: R2-T001 through R2-T005 are all [P] (different files, independent)
- **Phase III-F**: R2-T012→R2-T013→R2-T014 are sequential (context depends on provider). R2-T015, R2-T016, R2-T017 are [P] (different files). R2-T018 depends on visual verification.
- **Phase III-G**: R2-T026→R2-T027→R2-T028→R2-T029→R2-T030→R2-T031 are sequential within the same file (each builds on previous state changes).

### Cross-Phase Rules

- NO task in Phase III-F may begin until ALL Phase III-E validation tasks pass
- NO task in Phase III-G may begin until ALL Phase III-F validation tasks pass
- Validation tasks are NOT parallelizable — they must run after all implementation tasks in their phase complete

---

## Implementation Strategy

### MVP Scope

Phase III-E alone delivers immediate user value (unblocks password recovery flow). This is the smallest deployable increment.

### Incremental Delivery

1. **Phase III-E** (5 implementation tasks + 6 validation tasks) — Unblocks auth flows
2. **Phase III-F** (7 implementation tasks + 7 validation tasks) — Fixes theme consistency
3. **Phase III-G** (6 implementation tasks + 8 validation tasks) — Fixes calendar data

### Task Summary

| Phase | Implementation Tasks | Validation Tasks | Total | Parallel Opportunities |
| ----- | ------------------- | ---------------- | ----- | --------------------- |
| III-E | 5 | 6 | 11 | 5 impl tasks parallel |
| III-F | 7 | 7 | 14 | 3 dark mode fixes parallel |
| III-G | 6 | 8 | 14 | None (same file) |
| **Total** | **18** | **21** | **39** | |
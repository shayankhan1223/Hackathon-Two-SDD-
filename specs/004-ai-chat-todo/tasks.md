# Task List: Home Page Navigation & Authentication API Alignment (v1.2)

**Feature Branch**: `004-ai-chat-todo`
**Date**: 2026-02-11
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Scope**: This task list covers ONLY the Home Page UI and Authentication API modules per specification v1.2. Other modules remain unchanged.

## Overview

Tasks implement the specification v1.2 updates:
1. **User Story 1** - Home Page navigation buttons for unauthenticated users
2. **User Story 2** - Authentication API contract alignment (`/register`, `/login`, `/me`)

## Dependencies

- **Phase 1** (Backend Auth API): No dependencies on other phases
- **Phase 2** (Frontend Types/Client): Depends on backend API being defined
- **Phase 3** (Home Page UI): Depends on frontend types being updated
- **Phase 4** (Auth Pages): Depends on frontend client being updated
- **Parallel Opportunities**: Backend and frontend type updates can start together

## Parallel Execution Examples

```bash
# Backend auth endpoints can be updated in parallel:
Task: "Update register endpoint" [P]
Task: "Update login endpoint" [P]
Task: "Add /api/auth/me endpoint" [P]

# Frontend auth pages can be updated in parallel:
Task: "Update sign-up page" [P]
Task: "Update sign-in page" [P]
```

---

## Phase 0: Bug Fixes (Priority: Critical) 🐛

*Goal: Fix critical bugs blocking user authentication flow*

### Bug Fix: Auth API Method Mismatch

**Bug Description**: Sign-up and sign-in pages call deprecated method names (`authAPI.signUp`, `authAPI.signIn`) but api-client.ts was already updated to use new names (`authAPI.register`, `authAPI.login`). This causes "Failed to fetch" errors.

- [x] T000a [Bug Fix] Update sign-up page to call `authAPI.register` instead of `authAPI.signUp` in phase-02-web/frontend/src/app/(auth)/sign-up/page.tsx
- [x] T000b [Bug Fix] Update sign-in page to call `authAPI.login` instead of `authAPI.signIn` in phase-02-web/frontend/src/app/(auth)/sign-in/page.tsx

**Checkpoint**: Users can successfully register and login without "Failed to fetch" error

### Bug Fix: Datetime Timezone Mismatch (asyncpg + PostgreSQL)

**Bug Description**: Python passes timezone-aware datetimes (`datetime.now(timezone.utc)`) but database column is `TIMESTAMP WITHOUT TIME ZONE`. asyncpg rejects the mismatch with: "can't subtract offset-naive and offset-aware datetimes"

- [x] T000o [Bug Fix] Add `sa_column=Column(DateTime(timezone=True))` to User model `created_at` and `updated_at` in phase-03-ai-chat/backend/src/models/user.py
- [x] T000p [Bug Fix] Add `sa_column=Column(DateTime(timezone=True))` to Task model `created_at` and `updated_at` in phase-03-ai-chat/backend/src/models/task.py
- [x] T000q [Bug Fix] Add `sa_column=Column(DateTime(timezone=True))` to ChatMessage model `created_at` in phase-03-ai-chat/backend/src/models/chat_message.py
- [ ] T000r [Bug Fix] Drop and recreate database tables to apply new column types (run: `DROP TABLE IF EXISTS users, tasks, chat_messages, tags, task_tags CASCADE;` then restart server)

**Checkpoint**: User registration works without datetime mismatch error

### UI Enhancement: Professional Home & Dashboard Pages

**Goal**: Create professional, polished UI for Home page (landing) and Dashboard page with modern design patterns.

#### Home Page (Landing Page for Unauthenticated Users)

- [x] T000c [UI] Verify Home page displays at http://localhost:3000/ with navigation bar containing Sign In and Get Started buttons in phase-02-web/frontend/src/app/page.tsx
- [ ] T000d [UI] Add animated hero illustration or product screenshot mockup to home page in phase-02-web/frontend/src/app/page.tsx
- [ ] T000e [UI] Add testimonials or social proof section to home page in phase-02-web/frontend/src/app/page.tsx
- [ ] T000f [UI] Add FAQ section to home page in phase-02-web/frontend/src/app/page.tsx
- [x] T000g [UI] Ensure home page is fully responsive on mobile devices in phase-02-web/frontend/src/app/page.tsx

#### Dashboard Page (For Authenticated Users)

- [x] T000h [UI] Create professional dashboard page at phase-02-web/frontend/src/app/dashboard/page.tsx
- [x] T000i [UI] Add welcome header with user greeting and current date in dashboard
- [x] T000j [UI] Add task summary cards (total tasks, completed, pending) in dashboard
- [x] T000k [UI] Add quick actions section (Create Task, View All Tasks) in dashboard
- [x] T000l [UI] Add recent activity or recent tasks list in dashboard
- [x] T000m [UI] Add sidebar navigation component for dashboard layout
- [x] T000n [UI] Ensure dashboard redirects unauthenticated users to /sign-in

**Checkpoint**: Home page shows professional landing UI with auth buttons; Dashboard shows user-friendly task overview

---

## Phase 1: Backend Authentication API Alignment

*Goal: Update backend auth endpoints to match specification v1.2 contract (`/register`, `/login`, `/me` with new response schema)*

### Response Model Updates

- [ ] T001 [P] [US2] Create `UserProfile` response model with `id`, `email`, `created_at` in phase-02-web/backend/src/api/routes/auth.py
- [ ] T002 [P] [US2] Create `AuthSuccessResponse` model with `token` and nested `user` object in phase-02-web/backend/src/api/routes/auth.py

### Endpoint Updates

- [ ] T003 [P] [US2] Rename `sign_up` endpoint to `register` at `/api/auth/register` in phase-02-web/backend/src/api/routes/auth.py
- [ ] T004 [P] [US2] Rename `sign_in` endpoint to `login` at `/api/auth/login` in phase-02-web/backend/src/api/routes/auth.py
- [ ] T005 [US2] Implement `GET /api/auth/me` endpoint returning authenticated user profile in phase-02-web/backend/src/api/routes/auth.py
- [ ] T006 [US2] Update both endpoints to return new `AuthSuccessResponse` schema with nested user object

### Backend Validation

- [ ] T007 [US2] Verify 409 Conflict response for duplicate email on `/api/auth/register`
- [ ] T008 [US2] Verify 401 Unauthorized response for invalid credentials on `/api/auth/login`
- [ ] T009 [US2] Verify 401 Unauthorized response for missing/invalid token on `/api/auth/me`
- [ ] T010 [US2] Manual test: Register new user, login, call /me endpoint to verify flow

**Checkpoint**: Backend auth API is updated and returns correct response schema

---

## Phase 2: Frontend Types and API Client Updates

*Goal: Update frontend TypeScript types and API client to match new backend contract*

### Type Definitions

- [ ] T011 [P] [US2] Update `AuthResponse` interface to `{ token: string; user: { id: string; email: string; created_at: string; } }` in phase-02-web/frontend/src/lib/types.ts
- [ ] T012 [P] [US2] Add `UserProfile` interface with `id`, `email`, `created_at` in phase-02-web/frontend/src/lib/types.ts

### API Client Updates

- [x] T013 [P] [US2] Rename `authAPI.signUp` to `authAPI.register` calling `/api/auth/register` in phase-02-web/frontend/src/lib/api-client.ts
- [x] T014 [P] [US2] Rename `authAPI.signIn` to `authAPI.login` calling `/api/auth/login` in phase-02-web/frontend/src/lib/api-client.ts
- [x] T015 [US2] Add `authAPI.me` method calling `GET /api/auth/me` in phase-02-web/frontend/src/lib/api-client.ts

### Auth Utilities

- [x] T016 [US2] Update `setAuthToken` in phase-02-web/frontend/src/lib/auth.ts to store user email from new response
- [x] T017 [US2] Add `getUserEmail` function in phase-02-web/frontend/src/lib/auth.ts to retrieve stored email

**Checkpoint**: Frontend types and API client are aligned with new backend contract

---

## Phase 3: User Story 1 - Home Page Navigation (Priority: P1) 🎯

*Goal: Display "Sign In" and "Sign Up" navigation buttons for unauthenticated visitors; redirect authenticated users to `/dashboard`*

**Independent Test**: Load home page as visitor → both buttons visible above fold → click each to verify navigation → login and revisit to verify redirect to dashboard

### Home Page Implementation

- [x] T018 [US1] Remove redirect-on-load behavior for unauthenticated users in phase-02-web/frontend/src/app/page.tsx
- [x] T019 [US1] Add hero section with app title/description visible above the fold in phase-02-web/frontend/src/app/page.tsx
- [x] T020 [US1] Add "Sign Up" button (primary/filled style) linking to `/sign-up` in phase-02-web/frontend/src/app/page.tsx
- [x] T021 [US1] Add "Sign In" button (secondary/outlined style) linking to `/sign-in` in phase-02-web/frontend/src/app/page.tsx
- [x] T022 [US1] Update redirect target for authenticated users from `/tasks` to `/dashboard` in phase-02-web/frontend/src/app/page.tsx

### Button Styling & Accessibility

- [x] T023 [P] [US1] Ensure buttons have minimum 44x44px touch target size (FR-006) in phase-02-web/frontend/src/app/page.tsx
- [x] T024 [P] [US1] Add `aria-label` attributes for screen readers (FR-007) in phase-02-web/frontend/src/app/page.tsx
- [x] T025 [P] [US1] Add hover, active, and focus states for visual feedback (FR-009) via Tailwind classes

### Validation

- [x] T026 [US1] Manual test: Load home page as unauthenticated → both buttons visible without scrolling
- [x] T027 [US1] Manual test: Click "Sign In" → navigates to `/sign-in`
- [x] T028 [US1] Manual test: Click "Sign Up" → navigates to `/sign-up`
- [x] T029 [US1] Manual test: Login and navigate to `/` → redirects to `/dashboard`
- [x] T030 [US1] Manual test: View on mobile viewport → buttons tappable with adequate size

**Checkpoint**: Home page displays navigation buttons meeting all FR-001 through FR-009 requirements

---

## Phase 4: User Story 2 - Auth Pages Update (Priority: P1)

*Goal: Update sign-up and sign-in pages to use new API endpoints and handle new response schema*

**Independent Test**: Register new user → verify redirect to dashboard → sign out → sign in with same credentials → verify redirect to dashboard

### Sign-Up Page Updates

- [x] T031 [P] [US2] Update API call from `authAPI.signUp` to `authAPI.register` in phase-02-web/frontend/src/app/(auth)/sign-up/page.tsx
- [x] T032 [P] [US2] Update response handling to extract `response.user.id` instead of `response.user_id` in phase-02-web/frontend/src/app/(auth)/sign-up/page.tsx
- [x] T033 [US2] Update `setAuthToken` call to pass `response.user.id` in phase-02-web/frontend/src/app/(auth)/sign-up/page.tsx
- [x] T034 [US2] Update redirect target from `/tasks` to `/dashboard` in phase-02-web/frontend/src/app/(auth)/sign-up/page.tsx

### Sign-In Page Updates

- [x] T035 [P] [US2] Update API call from `authAPI.signIn` to `authAPI.login` in phase-02-web/frontend/src/app/(auth)/sign-in/page.tsx
- [x] T036 [P] [US2] Update response handling to extract `response.user.id` instead of `response.user_id` in phase-02-web/frontend/src/app/(auth)/sign-in/page.tsx
- [x] T037 [US2] Update `setAuthToken` call to pass `response.user.id` in phase-02-web/frontend/src/app/(auth)/sign-in/page.tsx
- [x] T038 [US2] Update redirect target from `/tasks` to `/dashboard` in phase-02-web/frontend/src/app/(auth)/sign-in/page.tsx

### Validation

- [ ] T039 [US2] Manual test: Register new account → verify account created and redirected to `/dashboard`
- [ ] T040 [US2] Manual test: Sign in with existing account → verify authenticated and redirected to `/dashboard`
- [ ] T041 [US2] Manual test: Register with existing email → verify 409 error message displayed
- [ ] T042 [US2] Manual test: Sign in with wrong password → verify 401 error message displayed

**Checkpoint**: Auth pages use new endpoints and handle responses correctly

---

## Phase 5: Dashboard Placeholder (Blocking)

*Goal: Create minimal dashboard route to prevent 404 errors when auth redirects to `/dashboard`*

- [x] T043 [US1] Create placeholder dashboard page at phase-02-web/frontend/src/app/dashboard/page.tsx
- [x] T044 [US1] Add authentication check to redirect unauthenticated users to `/sign-in`
- [x] T045 [US1] Add basic "Dashboard coming soon" content with link back to tasks
- [x] T046 [US1] Manual test: Navigate to `/dashboard` when authenticated → page loads without error

**Checkpoint**: Dashboard route exists and redirects work correctly

---

## Phase 6: Polish & Validation

*Goal: Final validation of all changes against spec v1.2 acceptance criteria*

### End-to-End Validation

- [ ] T047 Full flow test: Visit `/` → click Sign Up → register → verify dashboard redirect
- [ ] T048 Full flow test: Visit `/` → click Sign In → login → verify dashboard redirect
- [ ] T049 Full flow test: As authenticated user, visit `/` → verify automatic redirect to `/dashboard`
- [ ] T050 API contract test: Verify `/api/auth/register` returns correct schema
- [ ] T051 API contract test: Verify `/api/auth/login` returns correct schema
- [ ] T052 API contract test: Verify `/api/auth/me` returns user profile

### Accessibility Verification

- [ ] T053 Verify home page buttons have aria-labels and are keyboard navigable
- [ ] T054 Verify home page buttons meet 44x44px touch target requirement on mobile

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Backend Auth API) ─────┐
                                ├──► Phase 2 (Frontend Types) ──► Phase 3 (Home Page) ──┐
                                │                                                         ├──► Phase 6 (Polish)
                                └──────────────────────────────────► Phase 4 (Auth Pages) ┘
                                                                     ▲
Phase 5 (Dashboard Placeholder) ─────────────────────────────────────┘
```

### Parallel Opportunities

| Phase | Parallel Tasks |
|-------|----------------|
| Phase 1 | T001-T002 (models), T003-T004 (endpoints) |
| Phase 2 | T011-T012 (types), T013-T015 (client) |
| Phase 3 | T023-T025 (styling/a11y) |
| Phase 4 | T031-T032 (sign-up), T035-T036 (sign-in) |

---

## Implementation Strategy

### Order of Execution

1. **Start with Phase 1** - Backend auth API updates (no dependencies)
2. **Then Phase 2** - Frontend types and client (depends on backend being defined)
3. **Then Phase 5** - Dashboard placeholder (can run parallel with Phase 2)
4. **Then Phase 3** - Home page UI (depends on types)
5. **Then Phase 4** - Auth pages (depends on client updates)
6. **Finally Phase 6** - Polish and validation

### MVP Scope

For quick validation, implement in this order:
1. T001-T006 (backend endpoints)
2. T011-T015 (frontend types/client)
3. T043-T045 (dashboard placeholder)
4. T018-T025 (home page)
5. T031-T038 (auth pages)

---

## Summary

| Phase | Task Count | Parallel Tasks | Story Coverage |
|-------|------------|----------------|----------------|
| Phase 1: Backend Auth | 10 | 4 | US2 |
| Phase 2: Frontend Types | 7 | 4 | US2 |
| Phase 3: Home Page | 13 | 3 | US1 |
| Phase 4: Auth Pages | 12 | 4 | US2 |
| Phase 5: Dashboard | 4 | 0 | US1 |
| Phase 6: Polish | 8 | 0 | US1, US2 |
| **Total** | **54** | **15** | **US1, US2** |

### Files Modified

| Module | Files |
|--------|-------|
| Backend Auth | `phase-02-web/backend/src/api/routes/auth.py` |
| Frontend Types | `phase-02-web/frontend/src/lib/types.ts` |
| Frontend Client | `phase-02-web/frontend/src/lib/api-client.ts` |
| Frontend Auth Utils | `phase-02-web/frontend/src/lib/auth.ts` |
| Home Page | `phase-02-web/frontend/src/app/page.tsx` |
| Sign-Up Page | `phase-02-web/frontend/src/app/(auth)/sign-up/page.tsx` |
| Sign-In Page | `phase-02-web/frontend/src/app/(auth)/sign-in/page.tsx` |
| Dashboard | `phase-02-web/frontend/src/app/dashboard/page.tsx` (new) |

---

# UI Upgradation — Phase 3 Enterprise UI Redesign

**Scope**: Complete frontend UI overhaul for Phase 3 AI Chat-Driven Todo Application
**Target Directory**: `phase-03-ai-chat/frontend/`
**Dependencies**: Consumes existing Phase 2 backend APIs

This section contains all tasks for creating a professional, enterprise-level UI with modern components.

---

## Phase 7: UI Setup (Project Foundation)

**Purpose**: Initialize Phase 3 frontend project with modern tooling

- [X] T101 Create `phase-03-ai-chat/frontend/` directory structure per plan.md
- [X] T102 Initialize Next.js 14 project with TypeScript, Tailwind CSS in `phase-03-ai-chat/frontend/`
- [X] T103 [P] Install dependencies: lucide-react, clsx, zod in package.json
- [X] T104 [P] Configure ESLint and Prettier in `.eslintrc.json` and `.prettierrc`
- [X] T105 [P] Setup Vitest and React Testing Library in `vitest.config.ts`
- [X] T106 Configure path aliases in `tsconfig.json` (@/components, @/lib, @/hooks)

**Checkpoint**: Empty Next.js project with tooling ready

---

## Phase 8: Design System Foundation

**Purpose**: Establish design tokens and atomic components that ALL pages depend on

**⚠️ CRITICAL**: No page implementation can begin until atomic components are complete

### Design Tokens

- [X] T107 Extend Tailwind config with design tokens (colors, spacing, typography) in `tailwind.config.ts`
- [X] T108 Add CSS custom properties for light/dark mode in `src/app/globals.css`
- [X] T109 [P] Create utility class extensions (@layer components) in `src/app/globals.css`

### Atomic Components (ui/)

- [X] T110 [P] Create Button component with variants (primary, secondary, ghost, danger, outline) in `src/components/ui/Button.tsx`
- [X] T111 [P] Create Input component with states (default, focus, error, disabled) in `src/components/ui/Input.tsx`
- [X] T112 [P] Create Badge component with variants (default, primary, success, warning, error) in `src/components/ui/Badge.tsx`
- [X] T113 [P] Create Card component with shadow and border variants in `src/components/ui/Card.tsx`
- [X] T114 [P] Create Avatar component with image and initials fallback in `src/components/ui/Avatar.tsx`
- [X] T115 [P] Create Tooltip component with positioning in `src/components/ui/Tooltip.tsx`
- [X] T116 [P] Create LoadingSpinner component in `src/components/ui/LoadingSpinner.tsx`
- [X] T117 Create ui/index.ts barrel export for all atomic components

### Utility Hooks

- [X] T118 [P] Create useAuth hook for authentication state in `src/hooks/useAuth.ts`
- [X] T119 [P] Create useSidebar hook with localStorage persistence in `src/hooks/useSidebar.ts`
- [X] T120 [P] Create useTheme hook for dark mode toggle in `src/hooks/useTheme.ts`

### Utility Functions

- [X] T121 [P] Create cn() utility for className merging in `src/lib/utils.ts`
- [X] T122 [P] Copy and adapt api-client.ts from Phase 2 in `src/lib/api-client.ts`
- [X] T123 [P] Copy and adapt auth.ts from Phase 2 in `src/lib/auth.ts`
- [X] T124 [P] Extend types.ts with UI-specific types in `src/lib/types.ts`

**Checkpoint**: Design system foundation ready — layout and page work can now begin

---

## Phase 9: Landing Page UI (User Story 1) 🎯 MVP

**Goal**: Professional landing page with Navbar, Hero, Features, Footer for unauthenticated visitors

**Independent Test**: Load home page → verify all sections render → click Sign Up/In → verify navigation

**Satisfies**: FR-001 through FR-009

### Layout Components

- [X] T125 [P] [US1] Create Navbar component with logo, nav links, auth buttons in `src/components/layout/Navbar.tsx`
- [X] T126 [P] [US1] Create Footer component with link columns and social icons in `src/components/layout/Footer.tsx`

### Landing Page Sections

- [X] T127 [P] [US1] Create Hero section with headline, CTA buttons, gradient background in `src/components/landing/Hero.tsx`
- [X] T128 [P] [US1] Create Features section with 4-column feature cards in `src/components/landing/Features.tsx`
- [X] T129 [P] [US1] Create HowItWorks section with numbered steps in `src/components/landing/HowItWorks.tsx`
- [X] T130 [P] [US1] Create CTA section with final conversion push in `src/components/landing/CTA.tsx`

### Home Page Assembly

- [X] T131 [US1] Create root layout with Inter font, metadata in `src/app/layout.tsx`
- [X] T132 [US1] Assemble home page with Navbar, Hero, Features, HowItWorks, CTA, Footer in `src/app/page.tsx`
- [X] T133 [US1] Implement authenticated user redirect to /dashboard in `src/app/page.tsx`
- [X] T134 [US1] Add mobile responsive styles for home page sections
- [X] T135 [US1] Add scroll-triggered navbar background change effect

**Checkpoint**: Landing page with Sign In/Sign Up buttons working, auth redirect functional

---

## Phase 10: Authentication Pages UI (User Story 2)

**Goal**: Redesigned auth pages with centered card layout and gradient background

**Independent Test**: Complete registration form → verify redirect to dashboard → sign in works

**Satisfies**: FR-010, SC-001

### Auth Layout

- [X] T136 [US2] Create auth layout with centered card, gradient background in `src/app/(auth)/layout.tsx`

### Auth Pages

- [X] T137 [P] [US2] Create sign-up page with email/password form in `src/app/(auth)/sign-up/page.tsx`
- [X] T138 [P] [US2] Create sign-in page with email/password form in `src/app/(auth)/sign-in/page.tsx`
- [X] T139 [US2] Add Zod validation schemas for auth forms in `src/lib/validation.ts`
- [X] T140 [US2] Implement API integration for register/login in auth pages
- [X] T141 [US2] Add error handling and field-level error display
- [X] T142 [US2] Add loading states during form submission

**Checkpoint**: Users can register, sign in, and reach dashboard

---

## Phase 11: Dashboard Layout Shell

**Goal**: Professional dashboard layout with collapsible sidebar and persistent header

**Independent Test**: Navigate to /dashboard → sidebar visible → collapse/expand works

### Dashboard Layout Components

- [X] T143 [P] Create Sidebar component with nav items, collapse toggle, user section in `src/components/layout/Sidebar.tsx`
- [X] T144 [P] Create Header component with page title, search, user dropdown in `src/components/layout/Header.tsx`
- [X] T145 Create DashboardLayout wrapper combining Sidebar + Header in `src/app/(dashboard)/layout.tsx`
- [X] T146 Implement mobile sidebar overlay with backdrop
- [X] T147 Add keyboard navigation support (Escape to close sidebar on mobile)

**Checkpoint**: Dashboard shell ready for page content

---

## Phase 12: Task Management UI (User Story 3)

**Goal**: Full task CRUD via professional UI components

**Independent Test**: Create task → edit it → mark complete → delete it

**Satisfies**: FR-011, FR-012, FR-025, TR-007

### Dashboard Home Components

- [X] T148 [P] [US3] Create StatCard component with metric, trend, icon in `src/components/dashboard/StatCard.tsx`
- [X] T149 [P] [US3] Create QuickActions component with action buttons in `src/components/dashboard/QuickActions.tsx`
- [X] T150 [P] [US3] Create RecentTasks component showing latest tasks in `src/components/dashboard/RecentTasks.tsx`
- [X] T151 [P] [US3] Create WelcomeBanner component for first-time users in `src/components/dashboard/WelcomeBanner.tsx`

### Task Components

- [X] T152 [P] [US3] Create TaskCard component with checkbox, details, actions in `src/components/tasks/TaskCard.tsx`
- [X] T153 [P] [US3] Create TaskList component with empty state in `src/components/tasks/TaskList.tsx`
- [X] T154 [P] [US3] Create TaskForm component with all fields (title, desc, date, priority, tags) in `src/components/tasks/TaskForm.tsx`
- [X] T155 [P] [US3] Create TaskFilters component with status, priority, tags filters in `src/components/tasks/TaskFilters.tsx`

### Task Pages

- [X] T156 [US3] Create dashboard home page with stats and recent tasks in `src/app/(dashboard)/page.tsx`
- [X] T157 [US3] Create tasks list page with TaskList and TaskFilters in `src/app/(dashboard)/tasks/page.tsx`
- [X] T158 [US3] Create useTasks hook for task CRUD operations in `src/hooks/useTasks.ts`
- [X] T159 [US3] Implement task create/edit modal or inline form
- [X] T160 [US3] Add optimistic UI updates for task operations
- [X] T161 [US3] Add delete confirmation modal

**Checkpoint**: Full task CRUD via UI working

---

## Phase 13: Chat Interface UI (User Story 4)

**Goal**: Professional chat panel with streaming message support

**Independent Test**: Open chat → send message → receive response → verify UI updates

**Satisfies**: FR-014, FR-023, SC-002, SC-010

### Chat Components

- [X] T162 [P] [US4] Create ChatMessage component with avatar, content, timestamp in `src/components/chat/ChatMessage.tsx`
- [X] T163 [P] [US4] Create ChatInput component with textarea, send button in `src/components/chat/ChatInput.tsx`
- [X] T164 [US4] Create ChatPanel component combining messages list and input in `src/components/chat/ChatPanel.tsx`
- [X] T165 [US4] Add streaming message display support
- [X] T166 [US4] Add typing indicator during AI response

### Chat Page

- [X] T167 [US4] Create chat page with full ChatPanel in `src/app/(dashboard)/chat/page.tsx`
- [X] T168 [US4] Create useChat hook for message handling in `src/hooks/useChat.ts`
- [X] T169 [US4] Integrate chat panel as optional sidebar in dashboard layout
- [X] T170 [US4] Add message persistence (load history on mount)

**Checkpoint**: Chat interface working with AI responses

---

## Phase 14: Calendar View UI (User Story 6)

**Goal**: Calendar with month/week/day navigation and task indicators

**Independent Test**: View month → click date → verify day view shows tasks

**Satisfies**: FR-020, FR-025, SC-006, TR-008

### Calendar Components

- [X] T171 [P] [US6] Create CalendarHeader component with navigation and view toggles in `src/components/calendar/CalendarHeader.tsx`
- [X] T172 [P] [US6] Create MonthView component with date grid and task indicators in `src/components/calendar/MonthView.tsx`
- [X] T173 [P] [US6] Create WeekView component with 7-day horizontal layout in `src/components/calendar/WeekView.tsx`
- [X] T174 [P] [US6] Create DayView component with task list for selected date in `src/components/calendar/DayView.tsx`
- [X] T175 [US6] Create Calendar component combining views in `src/components/calendar/Calendar.tsx`

### Calendar Page

- [X] T176 [US6] Create calendar page with full Calendar component in `src/app/(dashboard)/calendar/page.tsx`
- [X] T177 [US6] Create useCalendar hook for date navigation in `src/hooks/useCalendar.ts`
- [X] T178 [US6] Implement empty state messages ("No tasks on this date")
- [X] T179 [US6] Add task creation from day view

**Checkpoint**: Calendar navigation with month/week/day views working

---

## Phase 15: Search & Filter UI (User Story 7)

**Goal**: Full search, filter, and sort capabilities

**Independent Test**: Apply multiple filters → verify results narrow correctly → clear filters

**Satisfies**: FR-021, FR-022, SC-007, SC-008, TR-009

### Search & Filter Components

- [X] T180 [P] [US7] Create SearchBar component with icon and clear button in `src/components/ui/SearchBar.tsx`
- [X] T181 [P] [US7] Create FilterDropdown component for multi-select filters in `src/components/ui/FilterDropdown.tsx`
- [X] T182 [P] [US7] Create SortDropdown component for sort options in `src/components/ui/SortDropdown.tsx`
- [X] T183 [US7] Create ActiveFilters component showing applied filters in `src/components/tasks/ActiveFilters.tsx`
- [X] T184 [US7] Integrate search/filter/sort into TaskFilters component
- [X] T185 [US7] Create useFilters hook for filter state management in `src/hooks/useFilters.ts`
- [X] T186 [US7] Add keyboard shortcuts for search (Cmd/Ctrl+K)

**Checkpoint**: Search, filter, and sort fully functional

---

## Phase 16: UI Polish & Cross-Cutting Concerns

**Purpose**: Final polish, accessibility, dark mode, animations

### Accessibility

- [X] T187 [P] Add ARIA labels to all interactive components
- [X] T188 [P] Implement focus management and keyboard navigation
- [X] T189 [P] Verify color contrast meets WCAG 2.1 AA (4.5:1)
- [X] T190 Add skip-to-content link for keyboard users

### Dark Mode

- [X] T191 [P] Implement dark mode toggle in Header
- [X] T192 [P] Add dark mode styles to all components
- [X] T193 Persist theme preference in localStorage

### Animations

- [X] T194 [P] Add page transition animations
- [X] T195 [P] Add micro-interactions (hover, focus states)
- [X] T196 [P] Add loading skeleton components
- [X] T197 Implement reduced-motion preference support

### Performance

- [X] T198 [P] Add lazy loading for non-critical components
- [X] T199 [P] Optimize images with next/image
- [X] T200 Add error boundaries for graceful error handling

### Final Validation

- [X] T201 Run Lighthouse accessibility audit
- [X] T202 Test all pages on mobile devices (iOS Safari, Android Chrome)
- [X] T203 Verify all acceptance scenarios from spec.md

---

## UI Upgradation Dependencies

```
Phase 7: Setup ──────────────────────────────────────────────────────────────►
                                                                              │
Phase 8: Design System ◄─────────────────────────────────────────────────────┘
                      │
                      ├──► Phase 9: Landing Page (US1) 🎯 MVP
                      │
                      ├──► Phase 10: Auth Pages (US2)
                      │
                      └──► Phase 11: Dashboard Shell
                                          │
                                          ├──► Phase 12: Task Management (US3)
                                          │
                                          ├──► Phase 13: Chat Interface (US4)
                                          │
                                          ├──► Phase 14: Calendar View (US6)
                                          │
                                          └──► Phase 15: Search/Filter (US7)
                                                              │
                                                              └──► Phase 16: Polish
```

---

## UI Upgradation Summary

| Phase | Task Count | Parallel | Description |
|-------|------------|----------|-------------|
| Phase 7: Setup | 6 | 3 | Project initialization |
| Phase 8: Design System | 18 | 14 | Design tokens + atomic components |
| Phase 9: Landing Page | 11 | 6 | Home page with Navbar/Footer |
| Phase 10: Auth Pages | 7 | 2 | Sign-in/Sign-up redesign |
| Phase 11: Dashboard Shell | 5 | 2 | Sidebar + Header layout |
| Phase 12: Task Management | 14 | 8 | Task CRUD components |
| Phase 13: Chat Interface | 9 | 2 | Chat panel components |
| Phase 14: Calendar View | 9 | 4 | Month/Week/Day views |
| Phase 15: Search/Filter | 7 | 3 | Search + filter components |
| Phase 16: Polish | 17 | 10 | A11y, dark mode, animations |
| **Total UI Tasks** | **103** | **54** | **52% parallelizable** |

---

## All Paths Reference (phase-03-ai-chat/frontend/)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── calendar/page.tsx
│   │   └── chat/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   ├── Tooltip.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterDropdown.tsx
│   │   ├── SortDropdown.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   └── CTA.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── QuickActions.tsx
│   │   ├── RecentTasks.tsx
│   │   └── WelcomeBanner.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskFilters.tsx
│   │   └── ActiveFilters.tsx
│   ├── chat/
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   └── ChatPanel.tsx
│   └── calendar/
│       ├── CalendarHeader.tsx
│       ├── MonthView.tsx
│       ├── WeekView.tsx
│       ├── DayView.tsx
│       └── Calendar.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useSidebar.ts
│   ├── useTheme.ts
│   ├── useTasks.ts
│   ├── useChat.ts
│   ├── useCalendar.ts
│   └── useFilters.ts
└── lib/
    ├── api-client.ts
    ├── auth.ts
    ├── types.ts
    ├── utils.ts
    └── validation.ts
```

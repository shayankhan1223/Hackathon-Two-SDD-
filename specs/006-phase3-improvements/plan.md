# Implementation Plan: Phase III Round 2 Structured Improvements

**Branch**: `006-phase3-improvements` | **Date**: 2026-02-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification Phase III Round 2 sections (User Stories 10, 11, 12) from `/specs/006-phase3-improvements/spec.md`

## Summary

Phase III Round 2 addresses three remaining unresolved issues: (E) Fix 10 broken authentication navigation links that use incorrect `/auth/` URL prefix for Next.js route group pages, (F) Fix global theme system by centralizing state via React Context and adding missing dark-mode text classes to Settings and auth pages, (G) Replace hardcoded calendar mock data with real API-fetched task data and wire up the event creation callback.

**Execution Rule**: Strict sequential improvement. Each phase completed and validated before the next begins. No overlapping execution.

## Technical Context

**Language/Version**: Python 3.12 (backend — no changes in Round 2), TypeScript 5.9.3 (frontend)
**Primary Dependencies**: Next.js 16, React 19, Tailwind CSS 4.x, Lucide React (frontend only — backend unchanged)
**Storage**: Neon PostgreSQL via asyncpg (no schema changes in Round 2)
**Testing**: Manual validation per phase + automated route/render tests
**Target Platform**: Web (modern browsers)
**Project Type**: Web application (separate backend + frontend under `phase-03-ai-chat/`)
**Performance Goals**: Page transitions <300ms, calendar data load <1s
**Constraints**: No backend changes required for Phase III-E or III-F. Phase III-G uses existing `GET /api/tasks` endpoint. No new API endpoints needed.
**Scale/Scope**: 5 files modified (Phase III-E), ~8 files modified (Phase III-F), 1 file modified (Phase III-G)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is an unfilled template — no specific gates are defined. The following project conventions are enforced:

- **Smallest viable diff**: Each sub-phase is independently deployable and touches minimal files ✅
- **No hardcoded secrets**: No secrets involved in Round 2 changes ✅
- **Stateless backend**: No backend state changes ✅
- **Existing API compatibility**: No breaking changes — uses existing endpoints only ✅
- **No unrelated refactoring**: Changes are scoped strictly to the three identified issues ✅

**Post-Design Re-check**: All design artifacts maintain these invariants. ✅

## Project Structure

### Documentation (this feature)

```text
specs/006-phase3-improvements/
├── plan.md                              # This file (Round 2)
├── spec.md                              # Feature specification (updated with Round 2)
├── research.md                          # Phase 0: Research findings (Round 2 appended)
├── data-model.md                        # Phase 1: Entity definitions (unchanged)
├── quickstart.md                        # Phase 1: Setup guide (unchanged)
├── contracts/
│   └── openapi.yaml                     # Phase 1: API contracts (unchanged)
├── checklists/
│   └── requirements-round2.md           # Spec quality checklist
└── tasks.md                             # Phase 2: Implementation tasks (via /sp.tasks)
```

### Source Code (repository root)

```text
phase-03-ai-chat/frontend/src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.tsx             # MODIFY: Fix /auth/forgot-password → /forgot-password
│   │   ├── forgot-password/page.tsx     # MODIFY: Fix /auth/sign-in → /sign-in + dark mode classes
│   │   ├── reset-password/page.tsx      # MODIFY: Fix 3 broken links + dark mode classes
│   │   └── change-password/page.tsx     # MODIFY: Dark mode classes (routing already correct)
│   ├── (dashboard)/dashboard/
│   │   ├── calendar/page.tsx            # MODIFY: Replace mock data with API fetch
│   │   ├── settings/page.tsx            # MODIFY: Fix 3 broken links + dark text classes
│   │   └── profile/page.tsx             # MODIFY: Fix /auth/sign-in → /sign-in
│   └── layout.tsx                       # MODIFY: Wrap children in ThemeProvider (if context approach)
├── components/
│   └── ThemeProvider.tsx                # NEW: React Context provider for theme (if context approach)
├── hooks/
│   └── useTheme.ts                      # MODIFY: Convert to context-based or add storage listener
└── lib/
    └── api.ts                           # NO CHANGE (API paths are backend routes, not frontend routes)
```

**Structure Decision**: Follows existing web application pattern. All changes are modifications to existing files except potentially one new `ThemeProvider.tsx` component for theme context.

---

## Phase III-E: Authentication Routing Fix

### Objective

Fix 10 broken internal navigation links across 5 files that incorrectly use `/auth/` prefix for Next.js route group pages.

### Database Changes

None.

### Endpoints Affected

None — backend endpoints are unchanged. This is a frontend-only routing fix.

### Files to Update

| File | Lines | Change | Type |
| ---- | ----- | ------ | ---- |
| `frontend/src/app/(auth)/sign-in/page.tsx` | 159 | `/auth/forgot-password` → `/forgot-password` | Link href |
| `frontend/src/app/(auth)/forgot-password/page.tsx` | 25, 101 | `/auth/sign-in` → `/sign-in` (2 occurrences) | router.push, Link href |
| `frontend/src/app/(auth)/reset-password/page.tsx` | 49, 71, 162 | `/auth/sign-in` → `/sign-in` (2), `/auth/forgot-password` → `/forgot-password` (1) | router.push, Link href |
| `frontend/src/app/(dashboard)/dashboard/settings/page.tsx` | 35, 70, 124 | `/auth/sign-in` → `/sign-in` (2), `/auth/change-password` → `/change-password` (1) | router.push |
| `frontend/src/app/(dashboard)/dashboard/profile/page.tsx` | 24 | `/auth/sign-in` → `/sign-in` | router.push |

### Complete Change Manifest

```
sign-in/page.tsx:159        href="/auth/forgot-password"     → href="/forgot-password"
forgot-password/page.tsx:25 router.push('/auth/sign-in')     → router.push('/sign-in')
forgot-password/page.tsx:101 href="/auth/sign-in"            → href="/sign-in"
reset-password/page.tsx:49  router.push('/auth/sign-in')     → router.push('/sign-in')
reset-password/page.tsx:71  href="/auth/forgot-password"     → href="/forgot-password"
reset-password/page.tsx:162 href="/auth/sign-in"             → href="/sign-in"
settings/page.tsx:35        router.push('/auth/sign-in')     → router.push('/sign-in')
settings/page.tsx:70        router.push('/auth/sign-in')     → router.push('/sign-in')
settings/page.tsx:124       router.push('/auth/change-password') → router.push('/change-password')
profile/page.tsx:24         router.push('/auth/sign-in')     → router.push('/sign-in')
```

### Component Architecture

```
No architectural changes. String replacements only.

Sign-In Page ──"Forgot password?"──→ /forgot-password (was /auth/forgot-password)
Forgot Password ──"Back to sign-in"──→ /sign-in (was /auth/sign-in)
Reset Password ──"Sign in"──→ /sign-in (was /auth/sign-in)
Settings ──"Change Password"──→ /change-password (was /auth/change-password)
Settings ──"Auth redirect"──→ /sign-in (was /auth/sign-in)
Profile ──"Auth redirect"──→ /sign-in (was /auth/sign-in)
```

### Testing Strategy (Phase III-E)

| Test ID | Type | Description | Pass Criteria |
| ------- | ---- | ----------- | ------------- |
| TR-011 | Manual | Navigate to each auth page URL directly | All 5 pages load: `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, `/change-password` |
| TR-012 | Manual | Click "Forgot password?" on sign-in page | Navigates to `/forgot-password`, page renders |
| TR-013 | Manual | Click "Change Password" on settings page | Navigates to `/change-password`, page renders |
| TR-014 | Manual | Complete forgot-password flow | Redirects correctly at each step: `/forgot-password` → `/sign-in` |
| TR-015 | Manual | Complete reset-password flow with token | Redirects: `/reset-password?token=x` → (submit) → `/sign-in` |

### Validation Checkpoint

**Before proceeding to Phase III-F, ALL of the following must be verified:**

- [ ] All 10 link replacements confirmed in source code
- [ ] No remaining `/auth/sign-in`, `/auth/forgot-password`, or `/auth/change-password` frontend route references (verified via `grep -r "/auth/" --include="*.tsx" src/ | grep -v "/api/auth/"`)
- [ ] Sign-in → Forgot password link works
- [ ] Settings → Change Password button works
- [ ] Forgot password → Back to sign-in link works
- [ ] Reset password → Sign-in link works
- [ ] Profile page auth redirect works
- [ ] Dev server starts without errors

### Rollback

Revert the 5 modified files to their previous state. No database or API changes to roll back.

### Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Additional broken `/auth/` links missed | Low | Low | Grep scan catches all occurrences |
| Auth layout styling breaks on route change | Very Low | Medium | Auth layout is independent of URL prefix |

---

## Phase III-F: Global Theme System Fix

### Objective

Fix two theme issues: (1) centralize theme state so changes in one component reflect in all others, (2) add missing dark-mode text classes to Settings and auth pages.

### Prerequisites

Phase III-E must be completed and validated. Auth page routing must work correctly before adding theme fixes to those pages.

### Database Changes

None.

### Endpoints Affected

None — frontend-only changes.

### Design Decision: Theme Centralization Approach

**Chosen Approach**: React Context Provider + `useTheme` hook refactor

**Rationale**: The current `useTheme` hook uses `useState` which creates independent state per component instance. A React Context wrapping the root layout ensures all consumers share the same state.

**Alternative Rejected**: `localStorage` + `storage` event listener — rejected because `storage` events only fire in other tabs/windows, not in the same tab. This wouldn't solve the Sidebar ↔ Settings synchronization issue.

### Component Architecture

```
RootLayout (layout.tsx)
  └── ThemeProvider (new — wraps children)
        ├── provides: { theme, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme }
        ├── reads from: localStorage on mount
        ├── writes to: localStorage + document.documentElement.classList
        └── consumers:
              ├── Sidebar.tsx (toggleTheme)
              └── Settings/page.tsx (setLightTheme, setDarkTheme, setSystemTheme, theme)
```

### Files to Update

| File | Change | Type |
| ---- | ------ | ---- |
| `frontend/src/components/ThemeProvider.tsx` | Create React Context provider wrapping theme logic from `useTheme` | NEW |
| `frontend/src/hooks/useTheme.ts` | Refactor to consume from ThemeContext instead of local useState | MODIFY |
| `frontend/src/app/layout.tsx` | Wrap `{children}` with `<ThemeProvider>` | MODIFY |
| `frontend/src/app/(dashboard)/dashboard/settings/page.tsx` | Add `dark:text-white` to notification labels (lines 222, 232) | MODIFY |
| `frontend/src/app/(auth)/forgot-password/page.tsx` | Add dark mode classes to container, headings, text | MODIFY |
| `frontend/src/app/(auth)/reset-password/page.tsx` | Add dark mode classes to container, headings, text | MODIFY |
| `frontend/src/app/(auth)/change-password/page.tsx` | Verify dark mode classes (already has some via Card component) | VERIFY |
| `frontend/src/components/layout/Sidebar.tsx` | No change needed — already uses `useTheme` hook | VERIFY |

### Dark Mode Fix Manifest

**Settings page (`settings/page.tsx`)**:
```
Line 222: <span>Email Notifications</span>
  → <span className="text-gray-900 dark:text-white">Email Notifications</span>

Line 232: <span>Push Notifications</span>
  → <span className="text-gray-900 dark:text-white">Push Notifications</span>
```

**Auth pages — add dark variants to container and text elements**:
```
forgot-password/page.tsx:
  Line 36: bg-gray-50 → bg-gray-50 dark:bg-gray-900
  Line 39: text-gray-900 → text-gray-900 dark:text-white
  Line 43: text-gray-600 → text-gray-600 dark:text-gray-400
  Line 100: text-gray-600 → text-gray-600 dark:text-gray-400

reset-password/page.tsx:
  Line 61: bg-gray-50 → bg-gray-50 dark:bg-gray-900
  Line 81: bg-gray-50 → bg-gray-50 dark:bg-gray-900
  Line 84: text-gray-900 → text-gray-900 dark:text-white
  Line 88: text-gray-600 → text-gray-600 dark:text-gray-400
```

### ThemeProvider Design

```typescript
// ThemeProvider.tsx — pseudocode structure
ThemeContext = createContext(defaultValue)

ThemeProvider({ children }):
  state: theme = read from localStorage or 'system'

  applyTheme(themeValue):
    compute effectiveTheme (light/dark based on system if 'system')
    update document.documentElement.classList
    save to localStorage
    update state

  provide: { theme, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme }
  render: <ThemeContext.Provider>{children}</ThemeContext.Provider>

useTheme():
  return useContext(ThemeContext)
```

### Testing Strategy (Phase III-F)

| Test ID | Type | Description | Pass Criteria |
| ------- | ---- | ----------- | ------------- |
| TR-016 | Manual | Toggle dark mode from sidebar | Entire app switches theme |
| TR-017 | Manual | Refresh page in dark mode | Page loads dark, no flash |
| TR-018 | Manual | Toggle from sidebar, check settings page | Theme buttons reflect correct state |
| TR-019 | Manual | View Settings in dark mode | "Email Notifications" and "Push Notifications" visible |
| TR-020 | Manual | View forgot-password and reset-password in dark mode | All text readable, no invisible elements |

**Full verification sweep** — after all changes, verify these pages in dark mode:
- [ ] Dashboard
- [ ] Settings (all sections)
- [ ] Calendar
- [ ] Sign-in / Sign-up
- [ ] Forgot password
- [ ] Reset password
- [ ] Change password
- [ ] Profile

### Validation Checkpoint

**Before proceeding to Phase III-G, ALL of the following must be verified:**

- [ ] ThemeProvider created and wrapping root layout
- [ ] useTheme hook refactored to use context
- [ ] Sidebar toggle and Settings buttons synchronized (change one, other reflects immediately)
- [ ] "Email Notifications" text visible in dark mode
- [ ] "Push Notifications" text visible in dark mode
- [ ] Forgot-password page readable in dark mode
- [ ] Reset-password page readable in dark mode
- [ ] No flash of wrong theme on page refresh
- [ ] Dev server starts without errors
- [ ] No remaining bare `<span>` text elements without dark-mode classes in settings page

### Rollback

1. Remove `ThemeProvider.tsx`
2. Revert `useTheme.ts` to standalone hook
3. Revert `layout.tsx` to remove provider wrapper
4. Revert text class additions in settings/auth pages

### Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| ThemeProvider causes hydration mismatch | Medium | Medium | Keep inline `<script>` for initial class; ThemeProvider syncs after mount |
| Additional elements without dark classes missed | Medium | Low | Systematic page-by-page sweep in validation |
| Context re-renders cascade | Low | Low | Context value is small (single string + 4 functions); memoize if needed |

---

## Phase III-G: Calendar & Event Synchronization Fix

### Objective

Replace hardcoded calendar mock data with real API-fetched task data and wire the `handleTaskCreated()` callback to refresh the calendar after event creation.

### Prerequisites

Phase III-E and Phase III-F must be completed and validated. The calendar page must have working dark mode before modifying its data layer.

### Database Changes

None — uses existing `tasks` table and `GET /api/tasks` endpoint.

### Endpoints Used (existing, no changes)

| Method | Path | Auth | Purpose |
| ------ | ---- | ---- | ------- |
| GET | `/api/tasks` | JWT | Fetch all user tasks (calendar data source) |
| POST | `/api/tasks` | JWT | Create task (used by TaskCreationModal) |

### Files to Update

| File | Change | Type |
| ---- | ------ | ---- |
| `frontend/src/app/(dashboard)/dashboard/calendar/page.tsx` | Remove mock data, add useEffect for API fetch, wire handleTaskCreated, update Upcoming Events | MODIFY (major) |

### Component Architecture

```
CalendarPage
  ├── State: tasks[] (fetched from API)
  ├── useEffect: fetchTasks() on mount
  │     └── api.tasks.list() → setTasks(response.tasks)
  ├── getTasksForDay(day): filter tasks[] by due_date matching day
  ├── upcomingEvents: filter tasks[] by due_date >= today, sort, limit 10
  ├── handleTaskCreated(): re-fetch tasks from API → setTasks
  │     └── Called by TaskCreationModal.onTaskCreated prop
  └── Render:
        ├── Calendar grid (uses getTasksForDay for each cell)
        ├── Upcoming Events section (uses upcomingEvents)
        └── TaskCreationModal (passes handleTaskCreated)
```

### Data Flow

```
Page Mount
  └── useEffect → api.tasks.list() → tasks state → render calendar + upcoming

User clicks date → Modal opens
  └── User fills form → api.tasks.create() → success
       └── onTaskCreated() → api.tasks.list() → tasks state → re-render
```

### Change Details

1. **Add state and fetch**:
   - `const [tasks, setTasks] = useState<Task[]>([])`
   - `const [loading, setLoading] = useState(true)`
   - `useEffect` to call `api.tasks.list()` on mount

2. **Replace `getTasksForDay()`**:
   - From: hardcoded mock data for days 15, 20, 25
   - To: filter `tasks` array where `task.due_date` matches the given day/month/year

3. **Replace "Upcoming Events" section**:
   - From: hardcoded array of 4 events
   - To: filter `tasks` where `due_date >= today`, sort by `due_date`, limit to 10

4. **Wire `handleTaskCreated()`**:
   - From: empty function with comment
   - To: re-fetch tasks via `api.tasks.list()` and update state

5. **Add empty state**:
   - Upcoming Events: "No upcoming events. Create a task to get started."

### Task-to-Calendar Mapping

```typescript
// Mapping from API task to calendar display
interface CalendarEvent {
  id: string;
  title: string;
  date: string;        // from task.due_date (YYYY-MM-DD)
  priority: string;    // from task.priority (high/medium/low)
}
```

### Testing Strategy (Phase III-G)

| Test ID | Type | Description | Pass Criteria |
| ------- | ---- | ----------- | ------------- |
| TR-021 | Manual | Load calendar page | Tasks fetched from API, no mock data |
| TR-022 | Manual | Create task with known due date, check calendar | Task appears on correct date cell |
| TR-023 | Manual | Create task via AddEvent modal | Task appears immediately without refresh |
| TR-024 | Code review | Search calendar source for static arrays | Zero hardcoded event data |
| TR-025 | Manual | View calendar with no tasks | Empty state shown in Upcoming Events |
| TR-026 | Manual | Navigate between months | Tasks appear on correct months |

### Validation Checkpoint

**Before marking Phase III Round 2 complete, ALL of the following must be verified:**

- [ ] No hardcoded mock data in calendar page source
- [ ] Calendar fetches from `GET /api/tasks` on page load
- [ ] Tasks appear on correct calendar dates
- [ ] "Add Event" creates task and calendar updates immediately
- [ ] "Upcoming Events" shows real tasks sorted by date
- [ ] Empty state displays when no tasks exist
- [ ] Month navigation shows correct tasks per month
- [ ] Page refresh preserves all events
- [ ] Dev server starts without errors

### Rollback

Revert `calendar/page.tsx` to previous state. No database or API changes to roll back.

### Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| API returns tasks without due_date field | Low | Medium | Filter out tasks without due_date; show only dated tasks on calendar |
| Large task count slows calendar rendering | Low | Low | Calendar only renders tasks for current month; Upcoming Events capped at 10 |
| TaskCreationModal callback interface changes | Very Low | Low | Interface already has `onTaskCreated` prop — just need to call a real function |

---

## Implementation Order Summary

```
Phase III-E (Auth Routing)     → Validate → ✅
  │
  ▼
Phase III-F (Theme System)     → Validate → ✅
  │
  ▼
Phase III-G (Calendar Sync)    → Validate → ✅
  │
  ▼
Phase III Round 2 Complete
```

**Total files modified**: ~10 frontend files
**New files**: 1 (`ThemeProvider.tsx`)
**Backend changes**: 0
**Database changes**: 0
**New API endpoints**: 0

## Complexity Tracking

No constitution violations identified. All changes follow smallest-viable-diff principle. No new abstractions beyond the ThemeProvider context (which replaces duplicated hook state, reducing complexity).

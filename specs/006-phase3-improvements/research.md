# Research: Phase III Improvements

**Feature**: 006-phase3-improvements
**Date**: 2026-02-16

## Research Area 1: AI Agent Date Context Injection

### Decision
Inject current UTC date/time into the AI agent's system prompt at runtime, on every chat request. The system prompt is currently a static string in `src/agent/instructions.py`. It must be converted to a dynamic template that includes the current date.

### Rationale
The OpenAI Agents SDK `Agent` class accepts an `instructions` parameter that can be a string or a callable. By making it a function that returns a string with the current date interpolated, the agent receives accurate temporal context on every request without architectural changes.

### Alternatives Considered
1. **Pass date as a tool parameter**: Rejected — the agent needs date context for interpreting user messages *before* calling tools, not just when executing them.
2. **Add a `get_current_date` tool**: Rejected — adds unnecessary round-trip; the agent would need to call this tool before every date-related operation.
3. **Use AgentContext to pass date**: Rejected — the context object is for tool execution, not for the LLM's system prompt.

### Current Codebase Findings
- `src/agent/instructions.py`: Static `SYSTEM_PROMPT` string with no date reference.
- `src/agent/server.py` line 36-40: `Agent` initialized with `instructions=SYSTEM_PROMPT`.
- `src/agent/tools.py`: `AgentContext` only has `user_id` and `session`.
- `src/agent/tools.py` line 270: `bulk_add_tasks` docstring has hardcoded example dates (2026-02-11, 2026-02-12).

### Resolution
- Modify system prompt to include: `"The current date and time is: {datetime.utcnow().isoformat()} UTC."`
- Change `instructions=SYSTEM_PROMPT` to `instructions=lambda ctx: build_system_prompt()` where `build_system_prompt` generates the prompt with the current date.
- Update hardcoded example dates in tool docstrings to use relative language or remove specific dates.

---

## Research Area 2: Password Reset Flow Architecture

### Decision
Implement a token-based password reset flow using cryptographically secure random tokens stored in the database with expiration and single-use enforcement.

### Rationale
This is the industry-standard approach for email-based password resets. It doesn't require additional infrastructure beyond SMTP access and fits the existing stateless JWT architecture.

### Flow
1. User requests reset → `POST /api/auth/forgot-password` with email
2. Backend generates a random token, hashes it (SHA-256), stores `password_reset_tokens` row with user_id, hashed_token, expires_at (now + 1 hour), used=false
3. Backend sends email with link containing the raw token: `{FRONTEND_URL}/reset-password?token={raw_token}`
4. User clicks link → frontend renders password reset form
5. User submits new password → `POST /api/auth/reset-password` with token + new_password
6. Backend hashes the submitted token, looks up matching row, validates not expired and not used, updates user password, marks token as used

### Email Delivery (MVP)
For MVP, use Python's `logging` to output the reset link to the server console. This allows full flow testing without SMTP configuration. A `send_email` function interface will be defined for future SMTP/provider integration.

### Security Considerations
- Tokens are hashed before storage (attacker with DB access cannot generate reset links)
- Same response for registered and unregistered emails (prevents enumeration)
- 1-hour expiration limits attack window
- Single-use tokens prevent replay

---

## Research Area 3: User Preferences Persistence

### Decision
Create a `user_preferences` database table with one-to-one relationship to users. Expose via `GET /api/user/preferences` and `PATCH /api/user/preferences` endpoints.

### Rationale
User preferences (theme, timezone, notifications, display name) need to persist across sessions and devices. A single preferences row per user is the simplest model.

### Schema
- `user_id` (FK to users, unique)
- `display_name` (varchar, nullable)
- `timezone` (varchar, default "UTC")
- `theme` (varchar, default "system" — values: light/dark/system)
- `email_notifications` (boolean, default true)
- `push_notifications` (boolean, default true)
- `created_at`, `updated_at`

### Alternatives Considered
1. **JSON blob in users table**: Rejected — harder to query, validate, and migrate.
2. **Key-value preferences store**: Rejected — over-engineering for known, fixed set of preferences.

---

## Research Area 4: Notification Architecture

### Decision
For MVP, implement client-side notifications derived from task data. Notifications are computed on the frontend from the existing tasks API (overdue tasks, recently completed tasks). A `NotificationDropdown` component displays them in the bell dropdown.

### Rationale
Server-side notification generation requires background job infrastructure (cron, message queue) that is out of scope. Client-side computation from existing task data provides immediate value with zero backend changes.

### Notification Types (MVP)
- **Overdue reminders**: Tasks with `due_date < today` and `status = pending`
- **Recently completed**: Tasks completed in the last 24 hours
- **Welcome message**: First-time user sees "Welcome! Create your first task to get started."

### Future Enhancement
Add a `notifications` table and server-side generation via scheduled jobs. This would support push notifications, email notifications, and cross-device sync.

---

## Research Area 5: Theme Synchronization

### Decision
Create a centralized `useTheme` hook that all components use. Replace the inline sidebar DOM manipulation and disconnected settings state with calls to this single hook. Persist preference in `localStorage` (immediate) and in user_preferences (on save).

### Rationale
Three disconnected implementations exist today (sidebar inline, settings local state, unused `useTheme` hook). Centralizing eliminates the synchronization problem.

### Resolution
- Wire the existing `useTheme` hook (currently unused dead code at `src/hooks/useTheme.ts`)
- Sidebar toggle calls `useTheme.toggleTheme()`
- Settings theme buttons call `useTheme.setLightTheme()` / `useTheme.setDarkTheme()` / `useTheme.setSystemTheme()`
- Root layout FOUC prevention script remains unchanged

---

## Research Area 6: Global Search Implementation

### Decision
Implement header search as a client-side filter over the user's task list. Use the existing `api.tasks.list()` endpoint to fetch tasks, then filter locally by title, description, and tags.

### Rationale
The tasks API already exists and returns all user tasks. Client-side filtering for up to 500 tasks is instant and requires no new backend endpoint. The existing `SearchBar` component (dead code) can be utilized.

### Resolution
- Wire the `SearchBar` component (exists but unused) into the Header
- On input change (debounced 200ms), filter loaded tasks
- Display results in a dropdown overlay
- Click result → navigate to `/dashboard/tasks?highlight={taskId}`

---

## Phase III Round 2 Research

**Date**: 2026-02-16

### Research Area R2-1: Next.js Route Group URL Resolution

**Decision**: Internal navigation links must omit parenthesized route group names from URLs.

**Rationale**: Next.js App Router route groups use `(name)` folder convention to organize routes without affecting the URL path. The folder `src/app/(auth)/forgot-password/page.tsx` maps to URL `/forgot-password`, NOT `/auth/forgot-password`. This is a core Next.js convention documented in the App Router routing docs.

**Current Codebase Findings**:
- 10 broken links across 5 files use `/auth/` prefix in frontend navigation
- `/api/auth/` paths in `api.ts` are correct — those are backend API routes, not frontend page routes
- Pages at correct filesystem locations: `(auth)/forgot-password/`, `(auth)/reset-password/`, `(auth)/change-password/`
- Other pages correctly use `/sign-in` and `/sign-up` (no `/auth/` prefix) — inconsistency introduced during Phase III-D implementation

**Resolution**: Replace all 10 broken `/auth/` prefixed frontend navigation links with correct paths. No structural changes needed.

---

### Research Area R2-2: React Theme State Synchronization

**Decision**: Use React Context for global theme state instead of independent `useState` in each `useTheme()` consumer.

**Rationale**: The current `useTheme` hook uses `useState` internally. Each component calling `useTheme()` gets its own independent state copy. While `localStorage` provides persistence across page loads, there is no reactivity mechanism between component instances during the same session.

**Alternatives Considered**:
1. **`localStorage` + `storage` event listener**: Rejected — the `storage` event only fires in *other* tabs/windows, not within the same tab. This means Sidebar and Settings on the same page would still be out of sync.
2. **Custom event bus (`CustomEvent`)**: Rejected — adds complexity; React Context is the idiomatic solution and already well-understood in the codebase.
3. **Zustand or other state management library**: Rejected — overkill for a single boolean-ish value; unnecessary dependency.

**Current Codebase Findings**:
- `useTheme.ts`: Hook with `useState<'light' | 'dark' | 'system'>` + `useEffect` for initial load + `applyTheme()` function
- `layout.tsx:37-50`: Inline `<script>` for FOUC prevention — reads `localStorage('theme')` and sets `dark` class before React hydrates
- `Sidebar.tsx:57`: Uses `useTheme()` hook for toggleTheme
- `settings/page.tsx:15`: Uses `useTheme()` hook for setLightTheme/setDarkTheme/setSystemTheme
- Both create independent state instances

**Resolution**: Create `ThemeProvider.tsx` with React Context. Move all theme state and logic into the provider. Refactor `useTheme()` to consume context via `useContext()`. Wrap `layout.tsx` children with `<ThemeProvider>`. Keep inline `<script>` for FOUC prevention.

---

### Research Area R2-3: Calendar Data Source Architecture

**Decision**: Fetch tasks via existing `GET /api/tasks` endpoint and filter client-side for calendar display.

**Rationale**: The tasks API already exists and returns all user tasks with `due_date` fields. The calendar needs to display tasks on their due dates and show upcoming events. Client-side filtering for a reasonable number of tasks (<500) is efficient and avoids new backend endpoints.

**Alternatives Considered**:
1. **New calendar-specific endpoint**: Rejected — adds backend complexity for no benefit; existing task API provides all needed data.
2. **Server-side date filtering**: Rejected — would require new query parameters; client-side filtering is adequate for expected scale.

**Current Codebase Findings**:
- `calendar/page.tsx:73-91`: `getTasksForDay()` returns hardcoded mock data for days 15, 20, 25
- `calendar/page.tsx:191-196`: Hardcoded "Upcoming Events" with 4 static entries
- `calendar/page.tsx:67-70`: `handleTaskCreated()` is empty (comment only)
- `calendar/page.tsx:9`: `TaskCreationModal` imported and rendered with `onTaskCreated={handleTaskCreated}`
- `api.ts:89-93`: `api.tasks.list()` exists and works
- `TaskCreationModal.tsx:54`: Calls `onTaskCreated()` after successful API create
- Task model has `due_date` field (YYYY-MM-DD format)

**Resolution**: Add `useEffect` to fetch tasks on mount. Replace `getTasksForDay()` with real filter on fetched tasks. Replace hardcoded Upcoming Events with filtered/sorted task data. Wire `handleTaskCreated()` to re-fetch tasks.

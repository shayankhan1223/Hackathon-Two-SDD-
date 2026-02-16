# Feature Specification: Phase III Structured Improvements

**Feature Branch**: `006-phase3-improvements`
**Created**: 2026-02-16
**Status**: Draft
**Input**: User description: "Structured improvement update for Phase III (AI-Powered Todo Chatbot) covering AI date intelligence fix, broken UI interactions, missing pages/routing, and authentication/settings upgrades."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - AI Chatbot Uses Correct Dates (Priority: P1)

A user opens the chat panel and types a natural language command referencing relative dates such as "Add a task for tomorrow" or "Create a meeting next Monday." The AI chatbot interprets the relative date using the current system date, creates the task with the correct absolute due date, and confirms the date in its response. The user verifies the created task shows the expected due date in the task list and calendar.

**Why this priority**: The chatbot currently assigns incorrect dates (hardcoded 2024-06-04) to all tasks created via natural language. This is a data integrity bug that undermines the core AI feature and makes the chatbot unreliable for date-based task management.

**Independent Test**: Can be fully tested by sending "Add a task for tomorrow" via chat and verifying the created task's due date equals today's date + 1 day.

**Acceptance Scenarios**:

1. **Given** a user in the chat panel on 2026-02-16, **When** they type "Add a task for tomorrow", **Then** the chatbot creates a task with due date 2026-02-17.
2. **Given** a user in the chat panel, **When** they type "Create a meeting next Monday", **Then** the chatbot calculates the correct next Monday date relative to today and assigns it.
3. **Given** a user in the chat panel, **When** they type "Add a task due February 28", **Then** the chatbot assigns the explicit date 2026-02-28 without modification.
4. **Given** a user creating a task via chat, **When** the task is created, **Then** the chatbot response includes the assigned due date for user confirmation.
5. **Given** a user creating a bulk task via chat with "Add 2 tasks for this Friday", **Then** both tasks receive the correct Friday date relative to today.

---

### User Story 2 - Calendar Add Event Interaction (Priority: P1)

A user on the calendar page clicks the "Add Event" button to create a new task for a selected date. A form or modal appears allowing them to enter task details (title, priority, description). Upon submission, the task is created and appears on the calendar for that date.

**Why this priority**: The "Add Event" button is visible but non-functional, creating a broken user experience on a core page.

**Independent Test**: Can be fully tested by navigating to the calendar, clicking "Add Event", filling in task details, submitting, and verifying the task appears on the calendar.

**Acceptance Scenarios**:

1. **Given** a user on the calendar page, **When** they click "Add Event", **Then** a task creation form/modal opens with the currently selected date pre-filled.
2. **Given** a user filling the add event form, **When** they submit with valid title and date, **Then** the task is created and immediately appears on the calendar.
3. **Given** a user fills the form, **When** they submit without a title, **Then** a validation error appears and no task is created.
4. **Given** a user with the form open, **When** they press Escape or click outside, **Then** the form closes without creating a task.

---

### User Story 3 - Dark Mode Toggle Works Consistently (Priority: P2)

A user toggles dark mode from the sidebar or the settings page and the entire application switches themes consistently. The preference persists across page refreshes and sessions. Both the sidebar toggle and settings theme buttons produce the same result.

**Why this priority**: Dark mode toggle exists in the sidebar but the settings page theme buttons are disconnected. Users expect consistency between UI controls that affect the same setting.

**Independent Test**: Can be fully tested by toggling dark mode from sidebar, verifying theme changes, navigating to settings, verifying the correct theme button is highlighted, clicking a different theme button, and verifying the theme changes.

**Acceptance Scenarios**:

1. **Given** a user in light mode, **When** they click the dark mode toggle in the sidebar, **Then** the entire application switches to dark mode immediately.
2. **Given** a user in dark mode, **When** they navigate to Settings and view the Preferences section, **Then** the "Dark" theme button is visually selected.
3. **Given** a user on the Settings page, **When** they click the "Light" theme button, **Then** the application switches to light mode and the sidebar toggle icon updates accordingly.
4. **Given** a user who selects dark mode, **When** they refresh the page, **Then** the application loads in dark mode without a flash of light mode.
5. **Given** a user selects "System" theme, **When** their OS switches between light/dark, **Then** the application follows the OS preference.

---

### User Story 4 - Header Search Filters Tasks Globally (Priority: P2)

A user clicks the search icon in the header and types a query. As they type, search results appear showing matching tasks from across the application. Clicking a result navigates to the relevant task or page.

**Why this priority**: The header search bar opens but captures no input and filters nothing. Users expect a global search that works across pages.

**Independent Test**: Can be fully tested by clicking the header search icon, typing a task title, and verifying matching tasks appear as results.

**Acceptance Scenarios**:

1. **Given** a user on any page, **When** they click the search icon in the header, **Then** a search input appears with focus.
2. **Given** a user typing in the search input, **When** they enter at least 2 characters, **Then** matching tasks (by title, description, or tags) appear in a dropdown below.
3. **Given** search results are displayed, **When** the user clicks a result, **Then** they are navigated to the tasks page with that task highlighted or filtered.
4. **Given** a user searching, **When** no tasks match the query, **Then** a "No results found" message appears.
5. **Given** a user with the search open, **When** they press Escape, **Then** the search closes and the input clears.

---

### User Story 5 - Notification Bell Shows Activity (Priority: P3)

A user clicks the notification bell icon in the header and sees a dropdown with recent activity notifications such as overdue task reminders, recently completed tasks, and system messages. Unread notifications are indicated by a badge count.

**Why this priority**: The notification bell renders with a permanent red dot but has no dropdown or data. It gives the misleading impression of pending notifications.

**Independent Test**: Can be fully tested by clicking the bell, verifying a dropdown appears with notifications, and verifying the badge reflects actual unread count.

**Acceptance Scenarios**:

1. **Given** a user with overdue tasks, **When** they view the header, **Then** the notification bell shows a count badge matching the number of pending notifications.
2. **Given** a user clicks the notification bell, **When** the dropdown opens, **Then** it displays a list of recent notifications (overdue reminders, task completions) ordered by recency.
3. **Given** a user with no notifications, **When** they click the bell, **Then** the dropdown shows an empty state message: "You're all caught up!"
4. **Given** a user clicks the bell again or clicks outside, **When** the event fires, **Then** the dropdown closes.

---

### User Story 6 - Settings Page Save and Security Actions (Priority: P1)

A user updates their profile information (name, email, timezone) and notification preferences on the settings page and clicks "Save Changes." The changes persist across sessions. Security actions (change password) open the appropriate flows. The save confirmation uses an in-page success banner instead of a browser alert.

**Why this priority**: The settings page is entirely cosmetic. Save calls `alert()`, security buttons are non-interactive, and nothing persists. This is a fundamental functionality gap.

**Independent Test**: Can be fully tested by changing settings, saving, refreshing the page, and verifying changes persisted.

**Acceptance Scenarios**:

1. **Given** a user on the settings page, **When** they change their name and click "Save Changes", **Then** a success banner appears at the top of the page and the change persists after page refresh.
2. **Given** a user saving settings, **When** the save succeeds, **Then** no browser `alert()` is shown; instead, an in-page toast/banner displays.
3. **Given** a user clicks "Change Password" in the Security section, **When** the button is clicked, **Then** a password change form/modal opens requesting current password and new password.
4. **Given** a user on the settings page, **When** the page loads, **Then** their email is auto-populated from their authenticated session (not hardcoded).
5. **Given** a user selects a timezone, **When** they interact with the timezone dropdown, **Then** a searchable list appears organized by region and city (e.g., "America/New_York").
6. **Given** a user toggles email or push notification preferences, **When** they save, **Then** the preference persists and controls future notification behavior.

---

### User Story 7 - User Profile Page (Priority: P2)

A user clicks "Profile" from the header dropdown menu and is taken to a profile page where they can view and update their account details. The page is not a 404.

**Why this priority**: The profile link exists in the header but the page is missing, resulting in a 404 error. This is a broken navigation path.

**Independent Test**: Can be fully tested by clicking Profile in the header dropdown and verifying the page loads with user information.

**Acceptance Scenarios**:

1. **Given** a user clicks "Profile" in the header dropdown, **When** the page loads, **Then** they see their profile information including email and account creation date.
2. **Given** a user on the profile page, **When** they view their details, **Then** the email matches their authenticated session.
3. **Given** an unauthenticated user, **When** they try to access `/dashboard/profile`, **Then** they are redirected to the sign-in page.

---

### User Story 8 - Terms of Service and Privacy Policy Pages (Priority: P2)

A user clicks the "Terms of Service" or "Privacy Policy" links (visible on sign-up page and footer) and is taken to a readable page with the relevant content. Links are not broken `#` anchors.

**Why this priority**: Legal links are visible throughout the application but all point to `#`, providing no content. This is both a UX issue and a potential compliance gap.

**Independent Test**: Can be fully tested by clicking any Terms or Privacy link and verifying the page loads with content.

**Acceptance Scenarios**:

1. **Given** a user on the sign-up page, **When** they click "Terms of Service", **Then** they navigate to `/terms` with readable terms content.
2. **Given** a user on the sign-up page, **When** they click "Privacy Policy", **Then** they navigate to `/privacy` with readable privacy content.
3. **Given** a user on the footer of any page, **When** they click legal links, **Then** the corresponding page loads.
4. **Given** the terms/privacy pages, **When** they load, **Then** content is readable and structured with headings.

---

### User Story 9 - Forgot Password Flow (Priority: P1)

A user on the sign-in page clicks "Forgot password?" and enters their email. The system sends a password reset link. The user clicks the link, enters a new password, and can sign in with the updated credentials.

**Why this priority**: The "Forgot password?" link exists on the sign-in page but does nothing. Users who forget their password have no way to recover their account.

**Independent Test**: Can be fully tested by clicking "Forgot password?", entering an email, receiving a reset link, setting a new password, and signing in with it.

**Acceptance Scenarios**:

1. **Given** a user on the sign-in page, **When** they click "Forgot password?", **Then** they are taken to a password reset request page.
2. **Given** a user on the reset request page, **When** they enter a registered email and submit, **Then** they see a confirmation message: "If an account exists with this email, a reset link has been sent."
3. **Given** a user enters an unregistered email, **When** they submit, **Then** the same confirmation message is shown (no email enumeration).
4. **Given** a user clicks the reset link from their email, **When** the link is valid and not expired, **Then** they see a form to enter a new password.
5. **Given** a user enters a new password, **When** they submit, **Then** the password is updated and they are redirected to sign-in with a success message.
6. **Given** a reset link older than 1 hour, **When** a user clicks it, **Then** an "expired link" message is shown with an option to request a new one.

---

### Edge Cases

- **Date near midnight**: When a user creates a task "for today" at 11:59 PM, the system uses the current server UTC date which may differ from user's local date. The chatbot should reference UTC and clarify if ambiguous.
- **Timezone-sensitive dates**: "Tomorrow" at 11 PM PST is already "today" in UTC. The system should document its date reference frame (UTC) clearly in chatbot responses.
- **Concurrent dark mode changes**: If dark mode is toggled via sidebar while the settings page is open, the settings page theme buttons should reflect the change.
- **Empty notifications**: When no notifications exist, the bell badge should be hidden (not show "0").
- **Password reset for OAuth users**: If OAuth is added in the future, password reset should gracefully inform users who don't have password-based accounts.
- **Large search result sets**: Search results dropdown should be bounded (max 10 items) with a "View all results" option.
- **Save settings with no changes**: The "Save Changes" button should be disabled if no changes have been made.
- **Profile page with incomplete data**: If user has no name set, profile page should prompt them to add one rather than showing blank fields.

## Requirements *(mandatory)*

### Functional Requirements

#### Phase III-A: AI Date Intelligence

- **FR-001**: System MUST provide the current UTC date and time to the AI agent at the start of every chat interaction.
- **FR-002**: The AI agent MUST use the runtime-provided date as its reference for resolving all relative date expressions ("tomorrow", "next Monday", "this Friday").
- **FR-003**: The AI agent MUST NOT use hardcoded, static, or training-data dates for task due date calculations.
- **FR-004**: The AI agent MUST include the resolved absolute date (YYYY-MM-DD) in its confirmation response when creating or rescheduling tasks.
- **FR-005**: All MCP tool date parameters MUST accept and validate dates in YYYY-MM-DD format.

#### Phase III-B: Broken UI Interactions

- **FR-006**: The calendar page "Add Event" button MUST open a task creation form with the currently viewed date pre-filled.
- **FR-007**: Dark mode toggle in the sidebar and theme buttons on the settings page MUST be synchronized and both MUST apply the theme change immediately.
- **FR-008**: The system MUST persist the user's theme preference and restore it on page load without visual flash.
- **FR-009**: The notification bell MUST display a dropdown with recent activity when clicked.
- **FR-010**: The notification badge MUST reflect the actual count of unread notifications (hidden when zero).
- **FR-011**: The header search bar MUST capture user input and display matching tasks in a results dropdown.
- **FR-012**: Search MUST match against task title, description, and tags.
- **FR-013**: The settings page "Save Changes" button MUST persist changes to the backend and display an in-page success banner (not a browser `alert()`).
- **FR-014**: The "Change Password" button in Settings Security section MUST open a password change flow.
- **FR-015**: The "Payment Methods" and "Billing Information" buttons MUST either be functional or removed from the interface if out of scope.

#### Phase III-C: Missing Pages & Routing

- **FR-016**: The system MUST serve a user profile page at `/dashboard/profile` that displays the authenticated user's account information.
- **FR-017**: The system MUST serve a Terms of Service page at a stable route accessible from all pages that link to it.
- **FR-018**: The system MUST serve a Privacy Policy page at a stable route accessible from all pages that link to it.
- **FR-019**: All navigation links to profile, terms, and privacy MUST point to valid routes (no `#` anchors).

#### Phase III-D: Authentication & Settings Upgrade

- **FR-020**: The system MUST provide a "Forgot Password" flow accessible from the sign-in page that allows users to reset their password via email link.
- **FR-021**: Password reset tokens MUST expire after a defined period (1 hour) and be single-use.
- **FR-022**: The password reset response MUST not reveal whether an email is registered (prevent email enumeration).
- **FR-023**: The settings timezone selector MUST present a searchable list of IANA timezones organized by region and city.
- **FR-024**: The settings page MUST auto-populate the user's email from their authenticated session instead of hardcoded values.
- **FR-025**: User preferences (theme, timezone, notification toggles, display name) MUST persist in the database and load on settings page open.
- **FR-026**: The email notification toggle MUST control whether the user receives email notifications for overdue tasks and reminders.
- **FR-027**: The push notification toggle MUST control whether the user receives in-browser push notifications.

### Key Entities

- **UserPreferences**: Stores user-specific settings including display name, timezone (IANA format), theme preference (light/dark/system), email notifications enabled, push notifications enabled. One-to-one relationship with User.
- **PasswordResetToken**: Stores a hashed token, associated user, creation timestamp, expiration timestamp, and used flag. Enables secure, time-limited password reset flows.
- **Notification**: Represents an in-app notification with type (overdue_reminder, task_completed, system), message content, read/unread status, creation timestamp. Belongs to one User.

### Assumptions

- The existing backend stack (FastAPI, SQLModel, asyncpg, Neon PostgreSQL) and frontend stack (Next.js, TypeScript, Tailwind CSS) remain unchanged.
- The OpenAI Agents SDK is the existing AI layer and will continue to be used.
- Password reset emails will be sent via a configurable SMTP service or a transactional email provider. For MVP, console/log-based email delivery is acceptable.
- Push notifications use the browser Push API with a service worker. For MVP, in-app notification display (bell dropdown) is the minimum requirement; actual push delivery can be deferred.
- The "Payment Methods" and "Billing Information" security buttons will be removed as they are out of scope for this application.
- Terms of Service and Privacy Policy content will be static markdown-rendered pages with placeholder legal text.
- IANA timezone data is sourced from the `Intl.supportedValuesOf('timeZone')` browser API or an equivalent static list.
- Notifications are generated client-side from task data (overdue calculations) for MVP. Server-side notification generation is a future enhancement.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of tasks created via chat with relative date expressions ("tomorrow", "next Monday") receive the correct due date relative to the actual current date.
- **SC-002**: Users can create a task from the calendar "Add Event" button and see it on the calendar within 3 seconds.
- **SC-003**: Dark mode preference persists across page refreshes 100% of the time with no flash of incorrect theme.
- **SC-004**: Header search returns matching results within 500ms for a task list of up to 500 tasks.
- **SC-005**: Settings changes persist across sessions, verified by saving, signing out, signing back in, and confirming saved values.
- **SC-006**: Password reset flow completes end-to-end (request, email, reset, sign-in) within 5 minutes.
- **SC-007**: 100% of navigation links lead to valid pages (zero `#` anchors or 404 errors in the authenticated application).
- **SC-008**: The notification bell dropdown opens within 300ms of click and displays relevant activity.
- **SC-009**: The "Save Changes" button on settings uses an in-page banner with zero browser `alert()` calls remaining.
- **SC-010**: All new features have corresponding automated tests that pass in CI.

---

## Phase III Round 2 — Remaining Issue Specifications

**Context**: Phase III-A through III-D are implemented. The following three sub-phases address remaining unresolved issues discovered during validation. Each sub-phase MUST be completed and validated sequentially before proceeding to the next.

**Execution Rule**: Strict sequential improvement. No overlapping execution. No parallel fixes.

---

### User Story 10 - Authentication Routing & Password Flow Fix (Priority: P0 — Blocking)

**Phase**: III-E

Users encounter PageNotFound errors when clicking "Forgot password?" on the sign-in page or "Change Password" in Settings. The pages exist at the correct filesystem paths but internal links use incorrect URL prefixes.

**Root Cause Analysis**:
Next.js route groups use parenthesized folder names (e.g., `(auth)`) which are stripped from the URL path. The actual routes are:
- `src/app/(auth)/forgot-password/page.tsx` → URL: `/forgot-password`
- `src/app/(auth)/reset-password/page.tsx` → URL: `/reset-password`
- `src/app/(auth)/change-password/page.tsx` → URL: `/change-password`

However, internal navigation links incorrectly use `/auth/` prefix:
- `sign-in/page.tsx:159` → `href="/auth/forgot-password"` (should be `/forgot-password`)
- `settings/page.tsx:124` → `router.push('/auth/change-password')` (should be `/change-password`)
- `reset-password/page.tsx:71` → `href="/auth/forgot-password"` (should be `/forgot-password`)
- `forgot-password/page.tsx:24` → `router.push('/auth/sign-in')` (should be `/sign-in`)

**Why this priority**: P0 — These are broken navigation paths on existing implemented features. Users cannot access password recovery at all.

**Independent Test**: Click "Forgot password?" link on sign-in page and verify the forgot-password page loads without PageNotFound.

**Acceptance Scenarios**:

1. **Given** a user on the sign-in page, **When** they click "Forgot password?", **Then** the forgot-password page loads (no PageNotFound).
2. **Given** a user on the Settings page, **When** they click "Change Password", **Then** the change-password page loads (no PageNotFound).
3. **Given** a user on the reset-password page with an invalid token, **When** they click "Request a new reset link", **Then** the forgot-password page loads (no PageNotFound).
4. **Given** a user who submits the forgot-password form, **When** the success timer fires, **Then** they are redirected to the sign-in page (no PageNotFound).
5. **Given** a user who successfully resets their password, **When** the redirect fires, **Then** they land on the sign-in page (no PageNotFound).
6. **Given** a user on the change-password page who successfully changes password, **When** the redirect fires, **Then** they return to the settings page.
7. **Given** the complete forgot-password flow, **When** the user requests a reset, receives a token, and submits a new password, **Then** the flow completes end-to-end with correct routing at every step.
8. **Given** a user clicks a reset link with an expired token (>1 hour), **When** the reset-password page validates, **Then** an "expired link" message is shown with a link to request a new one.

**Specification Requirements**:

**SR-E1**: Required frontend routes (all already exist as pages):

| URL Path             | Filesystem Path                                        | Auth Required |
| -------------------- | ------------------------------------------------------ | ------------- |
| `/forgot-password`   | `src/app/(auth)/forgot-password/page.tsx`              | No            |
| `/reset-password`    | `src/app/(auth)/reset-password/page.tsx`               | No            |
| `/change-password`   | `src/app/(auth)/change-password/page.tsx`              | Yes           |

**SR-E2**: All internal links MUST use the correct URL paths (without `/auth/` prefix):

| Source File (line)              | Current (broken)              | Correct                 |
| ------------------------------- | ----------------------------- | ----------------------- |
| `sign-in/page.tsx:159`          | `/auth/forgot-password`       | `/forgot-password`      |
| `settings/page.tsx:124`         | `/auth/change-password`       | `/change-password`      |
| `reset-password/page.tsx:71`    | `/auth/forgot-password`       | `/forgot-password`      |
| `forgot-password/page.tsx:24`   | `/auth/sign-in`               | `/sign-in`              |

**SR-E3**: Required backend API endpoints (all already exist):

| Method | Path                          | Auth   | Status    |
| ------ | ----------------------------- | ------ | --------- |
| POST   | `/api/auth/forgot-password`   | Public | Exists    |
| POST   | `/api/auth/reset-password`    | Public | Exists    |
| POST   | `/api/auth/change-password`   | JWT    | Exists    |

**SR-E4**: Password reset lifecycle (already implemented, verify):
- Request: User submits email → backend generates token, hashes it, stores with 1-hour expiry, logs reset URL
- Token validation: Unhashed token in URL → backend hashes and looks up → validates `used == false` AND `expires_at > now()`
- Reset: Valid token → update password → mark token as used → redirect to sign-in
- Change password (authenticated): Verify current password → validate new password (min 8 chars) → update
- Error states: expired token, already-used token, invalid token, password mismatch, password too short

**SR-E5**: Password strength validation rules:
- Minimum 8 characters (enforced on both forgot-password and change-password flows)
- New password and confirmation must match

---

### User Story 11 - Global Theme System Architecture Fix (Priority: P1)

**Phase**: III-F

The dark mode toggle changes the theme but two critical issues remain:
1. Theme state is duplicated — the `useTheme` hook creates independent instances in Sidebar and Settings, so changes in one may not immediately reflect in the other.
2. Dark mode hides text in the Settings Notifications section — "Email Notifications" and "Push Notifications" labels (`settings/page.tsx:222,232`) use bare `<span>` elements without `dark:text-*` classes, making text invisible against dark backgrounds.

**Root Cause Analysis**:
- The `useTheme` hook stores state in `useState` — each component that calls `useTheme()` gets its own state instance. Although `localStorage` synchronizes on page load, there is no cross-component reactivity during the same session.
- Settings page Notifications section uses `<span>Email Notifications</span>` and `<span>Push Notifications</span>` without dark-mode-aware text color classes. On a dark background, the default inherited text color becomes invisible.

**Why this priority**: P1 — Text becomes invisible in dark mode on the Settings page, making the feature unusable. Theme inconsistency between controls is a user trust issue.

**Independent Test**: Toggle dark mode from sidebar, navigate to Settings, verify "Email Notifications" and "Push Notifications" text is readable.

**Acceptance Scenarios**:

1. **Given** a user in light mode, **When** they toggle dark mode from the sidebar, **Then** the entire application (all pages) switches to dark mode immediately, including the Settings page if open.
2. **Given** a user on the Settings page in dark mode, **When** they view the Notifications section, **Then** "Email Notifications" and "Push Notifications" text is readable (not invisible).
3. **Given** a user on the Settings page, **When** they click "Light", "Dark", or "System" theme buttons, **Then** the sidebar toggle icon reflects the current state on next view.
4. **Given** a user who selects dark mode, **When** they refresh the page, **Then** the application loads in dark mode without a flash of light mode.
5. **Given** a user selects "System" theme, **When** their OS switches between light/dark, **Then** the application follows the OS preference.
6. **Given** any page in the application (Dashboard, Settings, Calendar, Auth pages), **When** dark mode is active, **Then** all text content is readable against its background.

**Specification Requirements**:

**SR-F1**: Global theme system contract:
- Theme state MUST be stored globally and be reactive across all components
- Theme MUST be applied at the root layout level (`document.documentElement.classList`)
- No component MAY maintain isolated theme state — all MUST derive from the single source of truth
- Options: Either lift `useTheme` to a React Context provider, or synchronize via `localStorage` + `storage` event listener

**SR-F2**: Theme persistence:
- Stored in `localStorage` under key `theme`
- Loaded on app initialization via inline `<script>` in root layout (already exists at `layout.tsx:37-50`) to prevent FOUC
- Valid values: `"light"`, `"dark"`, `"system"`

**SR-F3**: Design token rules — all components MUST use Tailwind dark-mode-aware classes:

| Token Purpose      | Light Class             | Dark Class                    |
| ------------------ | ----------------------- | ----------------------------- |
| Primary text       | `text-gray-900`         | `dark:text-white`             |
| Secondary text     | `text-gray-600`         | `dark:text-gray-400`          |
| Muted text         | `text-gray-500`         | `dark:text-gray-400`          |
| Background         | `bg-white`              | `dark:bg-gray-900`            |
| Card background    | `bg-white`              | `dark:bg-gray-800`            |
| Border             | `border-gray-200`       | `dark:border-gray-700`        |
| Hover background   | `hover:bg-gray-50`      | `dark:hover:bg-gray-800`      |
| Disabled text      | `text-gray-400`         | `dark:text-gray-500`          |

**SR-F4**: Rule — No hardcoded text colors allowed:
- Every `<span>`, `<p>`, `<label>`, `<div>` containing text MUST include both light and dark text color classes
- Specifically: `settings/page.tsx:222` and `settings/page.tsx:232` MUST add `className="text-gray-900 dark:text-white"` or equivalent

**SR-F5**: Accessibility requirement:
- All text-on-background combinations MUST meet WCAG 2.1 AA minimum contrast ratio (4.5:1 for normal text, 3:1 for large text)
- The auth pages (`forgot-password`, `reset-password`) currently use `bg-gray-50` with `text-gray-900` — these MUST also include dark variants

**SR-F6**: Auth page theme compliance:
- `forgot-password/page.tsx` and `reset-password/page.tsx` use hardcoded `bg-gray-50`, `text-gray-900`, `text-gray-600` without dark variants
- These pages MUST be updated to use dark-mode-aware classes consistent with the auth layout

---

### User Story 12 - Calendar & Event Synchronization Fix (Priority: P1)

**Phase**: III-G

The calendar page has three synchronization issues:
1. "Add Event" creates a task in the database (via TaskCreationModal + API) but the calendar does not update to show it.
2. The calendar displays only hardcoded demo events (`calendar/page.tsx:73-91`) instead of fetching from the task API.
3. The "Upcoming Events" section (`calendar/page.tsx:191-196`) is also hardcoded with static data.

**Root Cause Analysis**:
- `getTasksForDay()` function (`calendar/page.tsx:73-91`) returns hardcoded mock data for days 15, 20, and 25 only
- The "Upcoming Events" section (`calendar/page.tsx:191-196`) has a hardcoded array of four demo events
- `handleTaskCreated()` callback (`calendar/page.tsx:67-70`) is empty — it contains only a comment about refreshing but does nothing
- No `useEffect` or data fetching exists to load tasks from the API on page load

**Why this priority**: P1 — The calendar appears functional but shows stale/fake data. Users who create tasks via "Add Event" see them vanish, undermining trust in the application.

**Independent Test**: Create a task with a due date, navigate to the calendar, verify the task appears on the correct date.

**Acceptance Scenarios**:

1. **Given** a user with existing tasks in the database, **When** they navigate to the calendar page, **Then** tasks are displayed on their respective due dates (not hardcoded demo data).
2. **Given** a user on the calendar page, **When** they click a date cell and create a task via the modal, **Then** the task appears on the calendar immediately after creation without page refresh.
3. **Given** a user on the calendar page, **When** they view the "Upcoming Events" section, **Then** it shows actual upcoming tasks from the database sorted by date.
4. **Given** a user on the calendar page, **When** they navigate to a different month, **Then** tasks for that month are displayed.
5. **Given** a user with no tasks, **When** they view the calendar, **Then** all date cells are empty and the "Upcoming Events" section shows an empty state message.
6. **Given** a user who creates a task via the chat panel, **When** they navigate to the calendar, **Then** the task appears on the correct date.
7. **Given** a page refresh, **When** the calendar reloads, **Then** all previously created events are still visible.

**Specification Requirements**:

**SR-G1**: Remove all hardcoded event data:
- Remove `getTasksForDay()` mock function (`calendar/page.tsx:73-91`)
- Remove hardcoded "Upcoming Events" array (`calendar/page.tsx:191-196`)

**SR-G2**: Event source of truth:
- Events MUST come from the task API (`GET /api/tasks`)
- Calendar MUST fetch tasks on initial page load
- Calendar MUST refresh task data after successful event creation via the modal

**SR-G3**: Task-to-calendar mapping rules:

| Task Field      | Calendar Display        |
| --------------- | ----------------------- |
| `task.due_date` | Calendar event date     |
| `task.title`    | Calendar event title    |
| `task.id`       | Calendar event ID       |
| `task.priority` | Event color/badge style |

**SR-G4**: Real-time update rule:
- After successful "Add Event" (task created via API):
  - Option A: Refetch all tasks from API and update state
  - Option B: Optimistically add the new task to local state, then verify with API
- The `handleTaskCreated()` callback MUST trigger the update mechanism

**SR-G5**: Empty state behavior:
- When no tasks exist for the current month: date cells show no event indicators
- "Upcoming Events" section shows: "No upcoming events. Create a task to get started."
- Empty state MUST be styled consistently with the rest of the application

**SR-G6**: Upcoming Events section:
- MUST display tasks with `due_date >= today`, sorted by `due_date` ascending
- MUST be limited to a reasonable number (e.g., 10 next events)
- MUST update when new tasks are created

---

## Requirements — Phase III Round 2 *(addendum)*

### Functional Requirements (Phase III-E)

- **FR-028**: All internal navigation links MUST use correct Next.js route group paths (no `/auth/` prefix for `(auth)` group pages).
- **FR-029**: The forgot-password page MUST be accessible at `/forgot-password` from the sign-in page link.
- **FR-030**: The change-password page MUST be accessible at `/change-password` from the Settings page button.
- **FR-031**: The reset-password page MUST be accessible at `/reset-password?token=...` from the email reset link.
- **FR-032**: All redirects within auth flows MUST use correct route paths (`/sign-in`, `/forgot-password`, `/dashboard/settings`).

### Functional Requirements (Phase III-F)

- **FR-033**: The theme system MUST use a single shared state mechanism that all components read from and write to.
- **FR-034**: All text elements across the application MUST include dark-mode-aware Tailwind classes.
- **FR-035**: The Settings page Notifications section labels ("Email Notifications", "Push Notifications") MUST be visible in both light and dark themes.
- **FR-036**: Auth pages (forgot-password, reset-password, change-password) MUST support dark mode with proper contrast.

### Functional Requirements (Phase III-G)

- **FR-037**: The calendar page MUST NOT contain any hardcoded or static event data.
- **FR-038**: The calendar MUST fetch task data from the backend API on page load.
- **FR-039**: After creating a task via the calendar modal, the calendar MUST immediately reflect the new task.
- **FR-040**: The "Upcoming Events" section MUST display real task data from the API, not static mock data.
- **FR-041**: The calendar MUST handle the empty state (no tasks) gracefully.

---

## Success Criteria — Phase III Round 2 *(addendum)*

- **SC-011**: 100% of auth navigation links resolve to valid pages (zero PageNotFound errors for forgot-password, change-password, reset-password flows).
- **SC-012**: Complete password reset flow (request → token → reset → sign-in) completes with correct routing at every step.
- **SC-013**: Theme changes from any control (sidebar toggle, settings buttons) are immediately visible across all pages without refresh.
- **SC-014**: All text on the Settings page is readable in both light and dark modes (zero invisible text elements).
- **SC-015**: Calendar displays real tasks from the database (zero hardcoded events remain).
- **SC-016**: Tasks created via the calendar "Add Event" modal appear on the calendar within 2 seconds of creation.
- **SC-017**: Page refresh preserves all calendar events (events survive reload).

---

## Quality & Testing Requirements *(mandatory)*

### Backend Testing

- **TR-001**: The AI agent date injection MUST be tested by verifying the system prompt contains the current UTC date at request time, not a static date.
- **TR-002**: Password reset endpoints MUST have tests covering: valid request, expired token, already-used token, invalid token, email enumeration prevention.
- **TR-003**: User preferences endpoints MUST have tests covering: create, read, update, and default value handling.

### Frontend Testing

- **TR-004**: Dark mode synchronization MUST be tested by toggling from sidebar, verifying settings page reflects the change, and vice versa.
- **TR-005**: Calendar "Add Event" MUST be tested end-to-end: button click, form display, submission, task creation, and calendar update.
- **TR-006**: Header search MUST be tested for: input capture, results display, result click navigation, empty state, and Escape to close.
- **TR-007**: Settings save MUST be tested to verify no `alert()` is called and an in-page banner is displayed.
- **TR-008**: Profile, Terms, and Privacy pages MUST be tested for route existence, content rendering, and access control.

### Integration Testing

- **TR-009**: The full chat-to-task-with-date flow MUST be tested: send relative date message, verify backend creates task with correct date.
- **TR-010**: Settings save round-trip MUST be tested: save preferences, reload page, verify preferences loaded from backend.

### Phase III Round 2 Testing Requirements

#### Phase III-E: Authentication Routing Tests

- **TR-011**: Route existence tests — verify all auth pages load at their correct paths (`/forgot-password`, `/reset-password`, `/change-password`, `/sign-in`, `/sign-up`) without 404 or PageNotFound.
- **TR-012**: Navigation link tests — verify clicking "Forgot password?" on sign-in navigates to `/forgot-password` (not `/auth/forgot-password`).
- **TR-013**: Settings "Change Password" button test — verify clicking navigates to `/change-password` (not `/auth/change-password`).
- **TR-014**: Redirect tests — verify forgot-password success redirects to `/sign-in`; reset-password success redirects to `/sign-in`; change-password success redirects to `/dashboard/settings`.
- **TR-015**: End-to-end password reset flow test — request reset, use token URL, set new password, verify redirect to sign-in with success state.

#### Phase III-F: Theme System Tests

- **TR-016**: Theme toggle unit test — verify `useTheme` hook correctly adds/removes `dark` class from `document.documentElement`.
- **TR-017**: Theme persistence test — set theme to dark, simulate page reload, verify dark class is present before React hydration.
- **TR-018**: Cross-component synchronization test — toggle theme from sidebar, verify settings page theme buttons reflect correct state.
- **TR-019**: Settings page dark mode visibility test — verify all text elements on Settings page are visible (have sufficient contrast) in dark mode. Specifically: "Email Notifications" and "Push Notifications" labels.
- **TR-020**: Auth page dark mode test — verify forgot-password, reset-password, and change-password pages are readable in dark mode.

#### Phase III-G: Calendar Synchronization Tests

- **TR-021**: API integration test — verify calendar page fetches tasks from `GET /api/tasks` on load.
- **TR-022**: Calendar rendering test — create a task with a known due date, verify it renders on the correct calendar date cell.
- **TR-023**: State synchronization test — create a task via AddEvent modal, verify it appears on the calendar without page refresh.
- **TR-024**: No hardcoded data test — verify calendar page source contains no static/mock event arrays.
- **TR-025**: Empty state test — verify calendar shows appropriate empty state when no tasks exist.
- **TR-026**: Upcoming events test — verify the "Upcoming Events" section displays tasks from the API sorted by due date.

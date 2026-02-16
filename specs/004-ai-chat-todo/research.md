# Research: AI Chat-Driven Todo Application

**Feature Branch**: `004-ai-chat-todo`
**Date**: 2026-02-10

## Research Summary

All technical unknowns for the Phase 3 AI Chat-Driven Todo application have been resolved through documentation research. This document captures decisions, rationale, and alternatives considered.

---

## R-001: ChatKit + FastAPI Backend Integration Pattern

**Decision**: Use OpenAI ChatKit (`@openai/chatkit-react`) on the frontend with a custom FastAPI backend that subclasses `ChatKitServer` from the `chatkit` Python package.

**Rationale**:
- ChatKit provides a production-ready chat UI (message threads, streaming, tool integration, history, theming) out of the box.
- The `chatkit` Python package provides `ChatKitServer` base class that integrates directly with OpenAI Agents SDK via `Runner.run_streamed()` and `stream_agent_response()`.
- FastAPI exposes a single `POST /chatkit` endpoint that processes ChatKit protocol payloads and returns `StreamingResponse` with `text/event-stream`.
- ChatKit's `onClientTool` callback on the frontend enables the chatbot to trigger UI-side actions (navigate calendar, apply filters, highlight tasks).

**Alternatives Considered**:
- Custom WebSocket chat implementation: More control but massive engineering overhead for streaming, reconnection, history management. Rejected.
- Direct OpenAI API calls from frontend: Violates stateless backend requirement and exposes API keys. Rejected.

---

## R-002: Agent Architecture — OpenAI Agents SDK with Function Tools (Not MCP Server)

**Decision**: Use OpenAI Agents SDK `@function_tool` decorator to define task operations as agent-callable tools directly in the backend. Do NOT run a separate MCP server process.

**Rationale**:
- The spec requires "all task operations must be exposed as MCP tools." The OpenAI Agents SDK's `@function_tool` decorator is the idiomatic way to expose tools to agents — these tools follow MCP semantics (typed inputs, structured outputs) without requiring a separate MCP server process.
- Running a separate MCP server (via `MCPServerStdio` or `MCPServerSse`) would add deployment complexity (two processes to manage) with no benefit since both the agent and tools run in the same FastAPI process.
- Each `@function_tool` function receives typed parameters, enforces validation, and calls SQLModel queries against the database. The agent never accesses the DB directly — it calls tools.
- This pattern is demonstrated in the official ChatKit advanced samples: tools are defined with `@function_tool` and passed to `Agent[AgentContext](tools=[...])`.

**Alternatives Considered**:
- Separate MCP server process connected via stdio/SSE: Adds operational complexity, latency, and failure modes for no benefit in a monolithic deployment. Rejected.
- Direct database access in agent instructions: Violates the spec requirement that the chatbot must never directly access the database. Rejected.

---

## R-003: Authentication Flow — Better Auth (Frontend) + JWT Verification (Backend)

**Decision**: Use Better Auth on the Next.js frontend for registration/login/session management with the JWT plugin. The FastAPI backend verifies JWT tokens on each request using the shared JWT secret or JWKS endpoint.

**Rationale**:
- Better Auth provides a complete auth solution with email/password, session management, and a JWT plugin that generates tokens for external API authentication.
- The frontend calls `authClient.token()` to get a JWT, then includes it as `Authorization: Bearer <token>` on all requests to the FastAPI backend.
- FastAPI middleware extracts and verifies the JWT, extracting `user_id` for all downstream operations.
- This keeps the backend fully stateless — no session storage required.

**Alternatives Considered**:
- Implement auth entirely in FastAPI: Would require building registration, password hashing, email verification, and session management from scratch. Rejected — Better Auth provides this out of the box.
- NextAuth.js: Mature but less aligned with the spec requirement for "Better Auth." Rejected per spec.

---

## R-004: Database Schema — SQLModel with Neon PostgreSQL

**Decision**: Use SQLModel ORM models for User, Task, TaskTag (join table), Tag, and ChatMessage entities. Connect to Neon PostgreSQL via async connection string. Use Alembic for migrations.

**Rationale**:
- SQLModel is explicitly required by the spec ("SQLModel, NOT SQLAlchemy").
- SQLModel supports both Pydantic validation and SQLAlchemy ORM features, making it ideal for FastAPI request/response models that double as database models.
- Neon PostgreSQL provides serverless Postgres with connection pooling, which matches the stateless backend requirement.
- Tags use a many-to-many relationship via a join table (`task_tag`) to support multi-select tagging.

**Alternatives Considered**:
- SQLAlchemy directly: Rejected per spec mandate.
- Prisma (Python): Less mature ecosystem, not specified. Rejected.

---

## R-005: ChatKit Conversation History Management

**Decision**: ChatKit manages thread/conversation state via its built-in `ChatKitServer.store` mechanism. The backend's `respond()` method receives thread metadata and message items, which include conversation history. Additionally, we persist all messages to the database (ChatMessage table) for durability across sessions.

**Rationale**:
- ChatKit's protocol includes thread management (create thread, list threads, get thread items). The `ChatKitServer` base class handles this.
- For the AI agent, conversation history comes from ChatKit's thread items, which are passed to `Runner.run_streamed()`.
- We additionally persist to our own ChatMessage table for backup/analytics and to support the spec requirement that "all conversation history must be persisted in the database."

**Alternatives Considered**:
- OpenAI's `conversation_id` for server-managed state: Works but ties us to OpenAI's storage. We need DB persistence per spec. Rejected as sole solution.
- SQLiteSession from Agents SDK: SQLite is not suitable for production Neon PostgreSQL deployment. Rejected.

---

## R-006: UI-Chatbot Bridge — Client Tools via onClientTool

**Decision**: Use ChatKit's `onClientTool` callback to enable the chatbot to control the UI. The agent defines client tools (e.g., `navigate_calendar`, `apply_filter`, `highlight_task`) that trigger UI-side state changes via React state management.

**Rationale**:
- ChatKit supports `onClientTool` in its options: when the agent calls a client tool, the ChatKit frontend receives it and can execute arbitrary UI logic.
- This enables the chatbot to say "I created a task for March 15" AND simultaneously navigate the calendar to March 15.
- The agent defines these as tools with `ClientToolCall` in the `AgentContext`, which ChatKit streams back to the frontend.

**Alternatives Considered**:
- Polling the backend for UI state changes: Adds latency and complexity. Rejected.
- WebSocket for real-time UI updates: Overhead for what ChatKit already provides. Rejected.

---

## R-007: Testing Strategy

**Decision**:
- **Backend**: pytest with httpx AsyncClient for API tests, pytest-asyncio for async test support
- **AI Layer**: Deterministic tests using mocked OpenAI responses; test tool selection by asserting which `@function_tool` functions get called
- **Frontend**: Vitest + React Testing Library for component tests; Playwright for E2E calendar/filter tests

**Rationale**:
- pytest is the standard Python testing framework and integrates well with FastAPI's TestClient.
- AI layer tests mock the LLM responses to make tests deterministic — we test that given a specific user message, the correct tool is selected with correct parameters.
- Vitest is the modern Next.js-compatible test runner; React Testing Library tests UI behavior, not implementation.

**Alternatives Considered**:
- Jest for frontend: Vitest is faster and more aligned with modern Next.js. Rejected.
- Integration tests hitting real OpenAI API: Non-deterministic, slow, costly. Rejected for CI/CD.

---

## R-008: Home Page Navigation Updates (Specification v1.2)

**Decision**: Update the home page to display "Sign In" and "Sign Up" navigation buttons for unauthenticated users instead of redirecting immediately. Authenticated users should be redirected to `/dashboard` instead of `/tasks`.

**Rationale**:
- Specification v1.2 (User Story 1) requires visible navigation buttons on the home page that are "visible above the fold without scrolling"
- Current implementation redirects unauthenticated users to `/sign-in` immediately, which doesn't meet the spec requirement for visible buttons
- The spec requires "Sign Up" as primary (filled/prominent) and "Sign In" as secondary (outlined/subtle) for clear visual hierarchy
- Authenticated users must be redirected to `/dashboard` per FR-008, not `/tasks`

**Current behavior**:
- Authenticated: Redirect to `/tasks`
- Unauthenticated: Redirect to `/sign-in`
- No visible navigation buttons on home page

**Required behavior**:
- Authenticated: Redirect to `/dashboard`
- Unauthenticated: Show "Sign In" and "Sign Up" buttons on home page
- Minimum touch target size of 44x44 pixels (FR-006)
- Accessible labels for screen readers (FR-007)
- Visual feedback for hover/active/focus states (FR-009)

**Alternatives Considered**:
- Keep current redirect behavior: Does not meet specification requirements. Rejected.
- Show buttons in a modal: Not specified; complicates accessibility. Rejected.

---

## R-009: Authentication API Contract Alignment (Specification v1.2)

**Decision**: Update authentication API endpoints to match specification v1.2 contract:
- Rename `/api/auth/sign-up` → `/api/auth/register`
- Rename `/api/auth/sign-in` → `/api/auth/login`
- Update response schema to include nested `user` object

**Rationale**:
- Specification v1.2 explicitly defines the Authentication API Contract with specific endpoint names and response schemas
- Current implementation uses different endpoint names (`sign-up`/`sign-in` vs `register`/`login`)
- Current response returns `{ user_id, token }` but spec requires `{ token, user: { id, email, created_at } }`

**Current schema**:
```json
{
  "user_id": "string (UUID)",
  "token": "string (JWT)"
}
```

**Required schema (per spec)**:
```json
{
  "token": "string (JWT token)",
  "user": {
    "id": "string (UUID)",
    "email": "string",
    "created_at": "string (ISO 8601 datetime)"
  }
}
```

**Implementation Changes Required**:

### Backend Changes
1. Rename `sign_up` endpoint to `register` at `/api/auth/register`
2. Rename `sign_in` endpoint to `login` at `/api/auth/login`
3. Update `AuthResponse` model to include nested `user` object with `id`, `email`, `created_at`
4. Ensure `/api/auth/me` endpoint returns `UserProfile` schema

### Frontend Changes
1. Update `api-client.ts` to use new endpoint names (`/api/auth/register`, `/api/auth/login`)
2. Update `types.ts` `AuthResponse` interface to match new schema
3. Update auth pages to handle new response structure
4. Update `setAuthToken` to store user email if needed

**Alternatives Considered**:
- Keep current endpoints and add aliases: Adds complexity, confusing for developers. Rejected.
- Maintain backward compatibility with both endpoint names: Unnecessary maintenance burden. Rejected.

---

## R-010: Enterprise UI/UX Design System

**Decision**: Adopt modern enterprise SaaS dashboard patterns with sidebar navigation, persistent header, and content-focused layouts.

**Rationale**:
- Enterprise users expect familiar patterns (Notion, Linear, Asana)
- Sidebar navigation enables quick access to all features
- Persistent header maintains brand visibility and quick actions
- Content area maximizes productivity workspace

**Alternatives Considered**:
1. **Top-nav only pattern**: Rejected - insufficient navigation space for complex app
2. **Bottom navigation (mobile-first)**: Rejected - not suitable for productivity apps
3. **Full-screen modal navigation**: Rejected - disrupts workflow continuity

---

## R-011: Design Token Foundation

**Decision**: Extend existing Tailwind configuration with comprehensive design tokens.

**Design Token Specifications**:

```javascript
// Spacing Scale (8px base)
spacing: {
  xs: '4px',    // 0.5
  sm: '8px',    // 1
  md: '16px',   // 2
  lg: '24px',   // 3
  xl: '32px',   // 4
  '2xl': '48px', // 6
  '3xl': '64px'  // 8
}

// Typography Scale
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  '5xl': ['3rem', { lineHeight: '1' }]          // 48px
}

// Border Radius
borderRadius: {
  none: '0',
  sm: '4px',
  DEFAULT: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
}
```

**Rationale**:
- Existing color palette (Primary: #3B82F6, Success: #10B981, Error: #EF4444) is professional
- Tailwind provides rapid prototyping with utility-first approach
- Design tokens ensure scalability and theme switching capability

---

## R-012: Responsive Breakpoints Strategy

**Decision**: Mobile-first with 4 breakpoints aligned with Tailwind defaults.

**Breakpoints**:
| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| Default (mobile) | 0px | Phones |
| sm | 640px | Large phones, small tablets |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large desktops |

**Rationale**: Aligns with Tailwind CSS defaults for consistency.

---

## R-013: Sidebar Navigation Pattern

**Decision**: Collapsible sidebar with icon-only collapsed state.

**Specification**:
- **Expanded Width**: 256px (16rem)
- **Collapsed Width**: 64px (4rem)
- **Collapse Trigger**: Toggle button + automatic on mobile
- **Persistence**: localStorage for user preference
- **Animation**: 200ms ease-out transition

**Navigation Items**:
1. Dashboard (home icon) - `/dashboard`
2. Tasks (checkbox icon) - `/tasks`
3. Calendar (calendar icon) - `/calendar`
4. Chat (message icon) - `/chat`
5. Settings (gear icon) - `/settings`

---

## R-014: Dark Mode Strategy

**Decision**: System preference with manual toggle, CSS variables for theming.

**Color Palette (Dark Mode)**:
```javascript
dark: {
  bg: {
    primary: '#0F172A',    // slate-900
    secondary: '#1E293B',  // slate-800
    tertiary: '#334155'    // slate-700
  },
  text: {
    primary: '#F8FAFC',    // slate-50
    secondary: '#CBD5E1',  // slate-300
    muted: '#94A3B8'       // slate-400
  },
  border: '#334155'        // slate-700
}
```

---

## R-015: Animation and Micro-interactions

**Decision**: Subtle, purposeful animations that enhance UX without distracting.

**Animation Guidelines**:
| Animation Type | Duration | Easing | Use Case |
|----------------|----------|--------|----------|
| Micro (hover, focus) | 150ms | ease-out | Button hover, input focus |
| Small (toggle, expand) | 200ms | ease-out | Sidebar collapse, dropdown |
| Medium (page transitions) | 300ms | ease-in-out | Route changes, modals |
| Large (initial load) | 500ms | ease-out | Hero animation, skeleton |

---

## R-016: Accessibility Requirements (WCAG 2.1 AA)

**Decision**: Implement comprehensive accessibility from the start.

**Requirements**:
1. **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
2. **Focus Indicators**: Visible focus rings (2px offset)
3. **Keyboard Navigation**: All interactive elements focusable
4. **Screen Reader Support**: Proper ARIA labels and roles
5. **Reduced Motion**: Respect prefers-reduced-motion
6. **Touch Targets**: Minimum 44x44px on mobile (per FR-006)

---

## R-017: Floating Label Input Pattern

**Decision**: Extend the existing `Input` component (`src/components/ui/Input.tsx`) with a `floatingLabel` boolean prop.

**Rationale**: The current Input uses a static label-above-field pattern. Floating labels (label inside the field that animates upward on focus/content) are achievable purely with CSS using Tailwind's `peer` utility and `peer-focus:` / `peer-[:not(:placeholder-shown)]:` modifiers. No new dependency needed.

**Implementation**: Use `peer` class on the `<input>`, position the label absolutely inside the field wrapper, and use peer-based transitions to move the label from centered to scaled-down/translated-up position on focus or when the field has content.

**Alternatives considered**:
- Third-party library (Headless UI, Radix): Rejected — adds dependency for a CSS-only feature.
- Separate `FloatingInput` component: Rejected — creates component fragmentation. A boolean prop on existing Input is simpler.

---

## R-018: Password Strength Meter

**Decision**: Create a new `PasswordStrengthMeter` component using a purely client-side strength algorithm (no external library).

**Rationale**: Password strength can be computed with simple heuristics: length, character variety (uppercase, lowercase, numbers, symbols). This avoids adding `zxcvbn` (~350KB) for what is fundamentally a visual indicator.

**Strength levels**:
| Level  | Color                    | Criteria |
|--------|--------------------------|----------|
| Weak   | Red (`--color-error`)    | Length < 6 or single char type |
| Fair   | Orange (`--color-warning`) | Length >= 6, at least 2 char types |
| Good   | Yellow-Green (#84CC16)   | Length >= 8, at least 3 char types |
| Strong | Green (`--color-success`) | Length >= 10, all 4 char types |

---

## R-019: AI Insights Panel — Productivity Score

**Decision**: Compute productivity score as a 7-day rolling completion ratio on the frontend from existing task data.

**Rationale**: Per clarification (2026-02-12), productivity score = (tasks completed in last 7 days / total tasks created in last 7 days) × 100. This can be computed from the existing task list endpoint data (which includes `created_at` and `status`) without a new backend endpoint.

**Alternatives considered**:
- Dedicated analytics endpoint: Rejected for MVP — adds backend scope.
- Backend-computed score: Rejected — adds data model complexity.

---

## R-020: Drag-and-Drop Task Reordering

**Decision**: Use HTML5 Drag and Drop API with a lightweight abstraction. No external library.

**Rationale**: The spec requires simple single-list reorder. HTML5 DnD API is sufficient. On touch devices, a fallback with move-up/move-down buttons (per spec edge case) eliminates the need for a touch DnD polyfill.

**Persistence**: Task order stored as a `sort_order` integer field. On drag-drop, the reordered list sends a PATCH request with the new order. Optimistic UI update with rollback on failure.

**Alternatives considered**:
- `@dnd-kit/core`: ~15KB for single-list reorder. Overkill.
- `react-beautiful-dnd`: Deprecated.
- `react-sortable-hoc`: Legacy, incompatible with React 19.

---

## R-021: Quick-Add Input with Autocomplete

**Decision**: Build a custom autocomplete dropdown sourced from the user's existing task titles. No external library.

**Rationale**: Suggestions come from the user's own task titles (already loaded). A simple filtered dropdown with keyboard navigation (ArrowUp/Down, Enter, Escape) meets the spec. Client-side filtering is faster than API calls for autocomplete.

---

## R-022: Social Login Deferral

**Decision**: Remove social login buttons from sign-in and sign-up pages. Remove "Or continue with" divider.

**Rationale**: Per clarification (2026-02-12), social login (Google, GitHub) is deferred entirely from this iteration. The existing Google/GitHub buttons in the current code must be removed to avoid user confusion.

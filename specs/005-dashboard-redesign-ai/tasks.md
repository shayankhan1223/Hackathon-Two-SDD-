# Tasks: Enterprise Dashboard Redesign with Sidebar and Integrated AI Assistant

**Input**: Design documents from `/specs/005-dashboard-redesign-ai/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested — manual verification via quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing. Focused on UI/UX upgradation of Dashboard per user request.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app frontend**: `phase-03-ai-chat/frontend/src/`
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create foundational hooks and utility components shared across all user stories

- [X] T001 Create `useAIPanel` hook with `isOpen`, `isMinimized`, toggle/close/minimize functions, and localStorage persistence in `phase-03-ai-chat/frontend/src/hooks/useAIPanel.ts`
- [X] T002 [P] Create `SkeletonCard` loading placeholder component with Tailwind `animate-pulse` in `phase-03-ai-chat/frontend/src/components/ui/SkeletonCard.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Sidebar and layout modifications that ALL user stories depend on

**CRITICAL**: No dashboard or AI panel work can begin until sidebar and layout are updated

- [X] T003 Add Analytics nav item with `BarChart3` icon to `mainNavItems` array in `phase-03-ai-chat/frontend/src/components/layout/Sidebar.tsx` — insert between "Chat" and the Tools section, href `/dashboard/analytics`
- [X] T004 Add AI Assistant toggle button (Sparkles icon) to the header right-side actions area in `phase-03-ai-chat/frontend/src/components/layout/Header.tsx` — button calls `onAIToggle` callback prop
- [X] T005 Update `pageTitles` map to include `/dashboard/analytics: 'Analytics'` in `phase-03-ai-chat/frontend/src/app/(dashboard)/layout.tsx`
- [X] T006 Add `aiPanelOpen` state (via `useAIPanel` hook), `onAIToggle` handler, and render `AIChatSlideIn` component in `phase-03-ai-chat/frontend/src/app/(dashboard)/layout.tsx` — pass `onAIToggle` to Header
- [X] T007 Add tablet auto-collapse: in `phase-03-ai-chat/frontend/src/app/(dashboard)/layout.tsx`, add `useEffect` with `window.matchMedia('(min-width: 768px) and (max-width: 1024px)')` listener to auto-set `sidebarCollapsed=true` on tablet

**Checkpoint**: Sidebar has Analytics link, Header has AI toggle button, layout manages AI panel state

---

## Phase 3: User Story 1 — Hierarchical Dashboard Layout (Priority: P1) MVP

**Goal**: Replace the current flat dashboard with summary cards, a dominant primary task panel, and a secondary context panel with clear information hierarchy

**Independent Test**: Navigate to `/dashboard`, verify summary cards show correct task counts, task list dominates ~60% of content area, secondary panel is smaller, layout is NOT equally divided

### Implementation for User Story 1

- [X] T008 [P] [US1] Create `DashboardHeader` component in `phase-03-ai-chat/frontend/src/components/dashboard/DashboardHeader.tsx` — renders page title "Dashboard", greeting with user name/email, and "Add Task" button (Plus icon) that calls `onAddTask` callback
- [X] T009 [P] [US1] Create `SummaryCards` component in `phase-03-ai-chat/frontend/src/components/dashboard/SummaryCards.tsx` — accepts `stats: { total, completed, pending, overdue }` and `loading: boolean` props; renders 4 cards in a responsive grid (1 col mobile, 2 col tablet, 4 col desktop); each card has icon (`ListTodo`, `CheckCircle`, `Clock`, `AlertTriangle`), numeric value, label, and accent color; when `loading=true`, render `SkeletonCard` placeholders
- [X] T010 [P] [US1] Create `PrimaryTaskPanel` component in `phase-03-ai-chat/frontend/src/components/dashboard/PrimaryTaskPanel.tsx` — accepts `tasks`, `onToggle`, `onDelete`, `onEdit` props; renders a Card with header containing sort dropdown (priority/due date/title) and filter dropdown (all/pending/completed + priority filter); task list renders each task with priority badge, due date, title, and hover quick-action buttons (edit=Pencil, complete=CheckCircle, delete=Trash2); hover actions use `group/group-hover` pattern visible by default on mobile; empty state shows "No tasks yet" with suggestion to add one
- [X] T011 [P] [US1] Create `SecondaryContextPanel` component in `phase-03-ai-chat/frontend/src/components/dashboard/SecondaryContextPanel.tsx` — renders a Card with tab switcher (Calendar Preview / AI Insights); Calendar tab shows next 3 upcoming events from mock data with Calendar icon and date/time; AI Insights tab shows productivity score circle, completed/overdue counts, and AI suggestion text based on highest-priority incomplete task; empty state for each tab shows helpful messaging
- [X] T012 [US1] Rewrite dashboard page in `phase-03-ai-chat/frontend/src/app/(dashboard)/page.tsx` — replace current content with: (1) `DashboardHeader` at top, (2) `SummaryCards` row with stats computed from `useTasks` hook (`getTaskStats()` plus overdue count calculated as `tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length`), (3) two-column grid with `PrimaryTaskPanel` at `lg:col-span-7` (dominant ~60%) and `SecondaryContextPanel` at `lg:col-span-5`; wire `useTasks` hook for real data with loading/error states; keep QuickAddInput integrated in header or as standalone row
- [X] T013 [US1] Add overdue count computation to `getTaskStats` in `phase-03-ai-chat/frontend/src/hooks/useTasks.ts` — add `overdue: number` field computed as tasks with `!completed && dueDate && dueDate < new Date().toISOString().split('T')[0]`

**Checkpoint**: Dashboard shows summary cards, dominant task list with sort/filter/hover actions, and secondary context panel. Information hierarchy is clear.

---

## Phase 4: User Story 2 — Persistent Sidebar Navigation (Priority: P1)

**Goal**: Ensure sidebar has complete navigation (including Analytics), responsive collapse behavior, and meets all acceptance criteria

**Independent Test**: Navigate between all routes, verify sidebar persists, active page highlighted, collapse/expand smooth <300ms, tooltips on collapsed icons, tablet auto-collapse, mobile hamburger drawer

### Implementation for User Story 2

- [X] T014 [US2] Verify and fix sidebar active state highlighting — in `phase-03-ai-chat/frontend/src/components/layout/Sidebar.tsx`, ensure `isActive('/dashboard/analytics')` returns true when on analytics route; test all nav items highlight correctly on their respective pages
- [X] T015 [US2] Add `aria-current="page"` attribute to active nav links and ensure all nav items have `tabIndex={0}` and keyboard `Enter`/`Space` activation in `phase-03-ai-chat/frontend/src/components/layout/Sidebar.tsx`
- [X] T016 [US2] Verify sidebar collapse animation completes within 300ms — confirm `transition-all duration-300` is applied to the sidebar container and the main content `lg:ml-64`/`lg:ml-16` transition in `phase-03-ai-chat/frontend/src/app/(dashboard)/layout.tsx`

**Checkpoint**: Sidebar navigation is complete with all routes, responsive behavior correct at all breakpoints, accessible with keyboard.

---

## Phase 5: User Story 3 — Toggle-Based AI Chat Panel (Priority: P2)

**Goal**: Create a slide-in AI chat panel accessible from any dashboard page via the header toggle button

**Independent Test**: Click AI button in header, panel slides in from right, send message, close panel, reopen — conversation preserved; test overlay on tablet, modal on mobile

### Implementation for User Story 3

- [X] T017 [US3] Create `AIChatSlideIn` wrapper component in `phase-03-ai-chat/frontend/src/components/chat/AIChatSlideIn.tsx` — renders a `fixed` panel on the right side (width `w-96` on desktop, full-width on mobile); uses `translate-x-full` when closed and `translate-x-0` when open with `transition-transform duration-300`; includes a semi-transparent backdrop overlay that closes panel on click; panel has a header bar with "AI Assistant" title, minimize button, and close (X) button; body renders `ChatPanel` component; on mobile (<768px) render as bottom drawer with `translate-y-full`/`translate-y-0`; on tablet (768-1024px) render as overlay (panel + backdrop, no content push); z-index: panel=30, backdrop=20
- [X] T018 [US3] Modify `ChatPanel` to accept `mode?: 'standalone' | 'embedded'` prop in `phase-03-ai-chat/frontend/src/components/chat/ChatPanel.tsx` — when `mode='embedded'`, hide the internal header (title bar) since `AIChatSlideIn` provides its own; keep all message/input functionality identical; export as both default and named export for flexibility
- [X] T019 [US3] Wire `AIChatSlideIn` into dashboard layout in `phase-03-ai-chat/frontend/src/app/(dashboard)/layout.tsx` — render `<AIChatSlideIn isOpen={aiPanelOpen} onClose={closeAIPanel} />` after main content div; ensure Escape key closes the panel via `useEffect` keydown listener
- [X] T020 [US3] Add rapid-toggle debounce to `useAIPanel` hook in `phase-03-ai-chat/frontend/src/hooks/useAIPanel.ts` — if toggle is called within 200ms of last toggle, ignore the second call to prevent animation stacking

**Checkpoint**: AI chat slides in from right on header button click, conversation history preserved within session, responsive behavior correct (overlay on tablet, drawer on mobile), rapid toggle handled gracefully.

---

## Phase 6: User Story 4 — Analytics Placeholder Page (Priority: P3)

**Goal**: Create an Analytics page with "Coming Soon" messaging and placeholder areas for future charts

**Independent Test**: Click Analytics in sidebar, page loads with correct header, "Feature Coming Soon" subheading, and 3 structured placeholder card areas

### Implementation for User Story 4

- [X] T021 [P] [US4] Create analytics placeholder page in `phase-03-ai-chat/frontend/src/app/(dashboard)/analytics/page.tsx` — render header "Analytics" (text-2xl font-bold), subheading "Feature Coming Soon" (text-gray-500), and a grid of 3 placeholder cards: (1) "Task Completion Charts" with BarChart3 icon, (2) "Productivity Trends" with TrendingUp icon, (3) "Performance Metrics" with Activity icon; each card has a dashed border, icon, title, and descriptive text explaining what will be available; use same Card/spacing/typography as dashboard for visual consistency

**Checkpoint**: Analytics page is accessible, visually consistent, communicates upcoming features.

---

## Phase 7: User Story 5 — Responsive Layout Adaptation (Priority: P2)

**Goal**: Ensure all components adapt correctly across desktop (>1024px), tablet (768-1024px), and mobile (<768px) breakpoints

**Independent Test**: Resize browser through all breakpoints, verify: sidebar full/collapsed/drawer, AI panel slide-in/overlay/modal, dashboard grid stacks vertically on mobile, no horizontal scroll at 320px

### Implementation for User Story 5

- [X] T022 [US5] Add responsive grid classes to `PrimaryTaskPanel` and `SecondaryContextPanel` layout in `phase-03-ai-chat/frontend/src/app/(dashboard)/page.tsx` — use `grid-cols-1 lg:grid-cols-12` with primary panel at `lg:col-span-7` and secondary at `lg:col-span-5`; on mobile both panels stack full-width
- [X] T023 [US5] Ensure `SummaryCards` responsive grid uses `grid-cols-2 md:grid-cols-4` in `phase-03-ai-chat/frontend/src/components/dashboard/SummaryCards.tsx` — on mobile shows 2x2 grid, on tablet+ shows 1x4 row
- [X] T024 [US5] Add minimum width constraint `min-w-[320px]` to the root layout wrapper in `phase-03-ai-chat/frontend/src/app/(dashboard)/layout.tsx` to prevent content from breaking below 320px
- [X] T025 [US5] Verify `AIChatSlideIn` responsive behavior in `phase-03-ai-chat/frontend/src/components/chat/AIChatSlideIn.tsx` — confirm desktop: fixed right panel; tablet: overlay with backdrop; mobile: bottom drawer or full-screen modal; add `useEffect` with `matchMedia` listener to switch between modes on resize

**Checkpoint**: Layout renders correctly at all breakpoints without horizontal scrolling. Smooth transitions on rotation/resize.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Micro-interactions, accessibility, empty states, and edge case handling

- [X] T026 [P] Add ARIA attributes to all new components: `role="region"` + `aria-label` on SummaryCards section, `role="list"` on task list, `aria-live="polite"` on AI chat messages, `role="dialog"` + `aria-modal="true"` on AIChatSlideIn overlay
- [X] T027 [P] Add empty states: in `PrimaryTaskPanel` show "No tasks yet — create one to get started" with an illustration/icon; in `SecondaryContextPanel` calendar tab show "No upcoming events"; in AI Insights tab show "Chat with AI to get insights"
- [X] T028 [P] Add keyboard navigation: `Escape` closes AI panel and mobile sidebar; `Tab` traverses all interactive elements in logical order (sidebar → header → summary cards are skipped → task list → secondary panel → AI panel when open); focus trap in AI panel when open on mobile
- [X] T029 Verify all transitions complete within 300ms: sidebar collapse/expand (`duration-300`), AI panel slide (`duration-300`), summary card skeleton→content fade, hover quick-action reveal; adjust timing if any feel sluggish
- [X] T030 Run full manual verification per `quickstart.md` — test all 6 sections (Dashboard, Sidebar, AI Panel, Analytics, Responsive, Keyboard) and fix any issues found

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001 for useAIPanel hook)
- **US1 Dashboard (Phase 3)**: Depends on Phase 2 completion (sidebar and layout updated)
- **US2 Sidebar (Phase 4)**: Depends on Phase 2 (T003 adds Analytics link)
- **US3 AI Panel (Phase 5)**: Depends on Phase 1 (T001) and Phase 2 (T004, T006)
- **US4 Analytics (Phase 6)**: Depends on Phase 2 (T003, T005 for nav + route)
- **US5 Responsive (Phase 7)**: Depends on Phases 3, 4, 5 (all components must exist)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1 Dashboard)**: After Phase 2. No dependency on other stories.
- **US2 (P1 Sidebar)**: After Phase 2. No dependency on other stories.
- **US3 (P2 AI Panel)**: After Phase 2. No dependency on US1/US2.
- **US4 (P3 Analytics)**: After Phase 2. No dependency on other stories.
- **US5 (P2 Responsive)**: After US1, US2, US3, US4 complete (cross-cutting).

**Note**: US1, US2, US3, US4 can all run in parallel after Phase 2 completes.

### Within Each User Story

- Components (T008-T011) before page integration (T012)
- Hook updates (T013) alongside or before page integration
- Wrapper components (T017) before layout wiring (T019)

### Parallel Opportunities

```text
Phase 1: T001 ─┬─ T002 (parallel)
                │
Phase 2: T003 ─┬─ T004 ─── T005 ─── T006 ─── T007 (sequential - same file dependencies)
                │
After Phase 2:  ├── US1: T008 ┬ T009 ┬ T010 ┬ T011 (parallel) → T012, T013 (sequential)
                ├── US2: T014 ┬ T015 ┬ T016 (parallel)
                ├── US3: T017 → T018 → T019 → T020 (sequential)
                └── US4: T021 (independent)
                │
After US1-4:    └── US5: T022 ─ T023 ─ T024 ─ T025 (sequential)
                │
After US5:      └── Polish: T026 ┬ T027 ┬ T028 (parallel) → T029 → T030
```

---

## Implementation Strategy

### MVP Scope (Recommended First Delivery)
- **Phase 1 + Phase 2 + Phase 3 (US1)**: Delivers the core dashboard redesign with summary cards, task list, and context panel. This is the highest-impact change visible to users.

### Incremental Delivery Order
1. **MVP**: Phases 1-3 (Dashboard hierarchy) — visual impact, core value
2. **Sidebar polish**: Phase 4 (US2) — navigation completeness
3. **AI integration**: Phase 5 (US3) — key differentiator
4. **Placeholder**: Phase 6 (US4) — low effort, navigation completeness
5. **Responsive + Polish**: Phases 7-8 — quality and cross-device support

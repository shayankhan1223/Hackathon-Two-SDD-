# Research: Enterprise Dashboard Redesign with Sidebar and Integrated AI Assistant

**Feature**: 005-dashboard-redesign-ai
**Date**: 2026-02-12

## R1: Slide-in Panel Pattern for AI Chat

**Decision**: CSS-only slide-in panel using Tailwind `translate-x` + `transition` on a fixed-position container.

**Rationale**: The existing stack (Tailwind CSS 4.x) provides all the animation primitives needed. A CSS transform-based slide is GPU-accelerated, performs within the <300ms target, and requires zero additional dependencies. The panel is positioned `fixed` on the right with `translate-x-full` when closed and `translate-x-0` when open.

**Alternatives considered**:
- **Headless UI Dialog/Transition**: Would add a dependency. The app doesn't use Headless UI. Overkill for a simple slide.
- **Framer Motion**: Powerful but adds ~30KB. Not justified for one animation.
- **React Portal**: Could use `createPortal` to render at document root, but `fixed` positioning within the dashboard layout achieves the same visual result without the complexity.

## R2: Summary Cards — Data Source

**Decision**: Compute summary card values client-side from the task list returned by `api.tasks.list()`.

**Rationale**: The existing `useTasks` hook already exposes a `getTaskStats()` method that returns `{ total, completed, pending, highPriority, completionRate }`. Overdue count needs to be added by comparing `dueDate < today` for pending tasks. No backend endpoint needed.

**Alternatives considered**:
- **Dedicated backend `/api/tasks/stats` endpoint**: Would require backend changes (out of scope per spec). Also, client-side computation from the full task list is fast enough for the expected scale.
- **Caching with SWR/React Query**: Would add a dependency. The current `useTasks` hook with `useEffect` is sufficient for the expected data volume.

## R3: Dashboard Task List — Sort/Filter Implementation

**Decision**: Reuse existing `SortDropdown` and `FilterDropdown` UI components. Sort/filter logic applied client-side to the in-memory task array.

**Rationale**: The backend `api.tasks.list()` already supports `sort_by`, `sort_order`, `status`, and `priority` query params. However, for the dashboard's primary panel, applying client-side sorting/filtering to the already-loaded task array provides instant feedback without additional API calls. The Tasks page (`/dashboard/tasks`) already handles server-side filtering for larger datasets.

**Alternatives considered**:
- **Server-side sort/filter on dashboard**: Adds latency for each sort/filter change. Unnecessary since the dashboard loads all tasks anyway.
- **Shared filter state between Tasks page and Dashboard**: Over-engineering; the dashboard shows a simplified view, the Tasks page is the full management interface.

## R4: AI Panel State Management

**Decision**: Custom `useAIPanel` hook using React `useState` with `localStorage` persistence for panel open/close state.

**Rationale**: The sidebar already uses this exact pattern (`useSidebar` hook + `localStorage`). Consistent approach. No global state manager (Zustand, Redux) is in the stack, and adding one for a single boolean state is unjustified.

**Alternatives considered**:
- **Zustand store**: Clean API but adds a dependency for minimal state.
- **React Context**: Would work but prop drilling from `layout.tsx` is simpler for 1-2 levels deep.
- **URL query param (`?ai=open`)**: Interesting for shareability but AI panel state is session-local, not navigational.

## R5: Responsive Sidebar Behavior

**Decision**: The sidebar already implements responsive behavior correctly — full width on desktop (`lg:`), hidden by default on mobile with hamburger toggle. Enhancement needed: auto-collapse to icon-only on tablet (`md:` to `lg:` range).

**Rationale**: The existing `Sidebar.tsx` handles `isCollapsed` and `isMobileOpen` states. The `(dashboard)/layout.tsx` manages both states. For tablet, we need to detect the `md` breakpoint and auto-set `isCollapsed=true` via a media query listener in `useEffect`.

**Alternatives considered**:
- **CSS-only approach (hiding text with media query)**: Breaks the state model since `isCollapsed` state wouldn't match visual state.
- **Container queries**: Not well-supported in all browsers; Tailwind responsive is simpler.

## R6: Analytics Placeholder Page Structure

**Decision**: Simple static page with consistent styling: header, subheading "Feature Coming Soon", 3 placeholder card areas using `SkeletonCard` or styled empty cards.

**Rationale**: This is explicitly a placeholder (P3 priority). Minimal implementation that maintains navigation completeness and visual consistency.

**Alternatives considered**:
- **Full chart library integration with mock data**: Over-engineering for a placeholder.
- **Redirect to a "coming soon" modal**: Poor UX; users expect clicking a nav item to land on a page.

## R7: Overdue Task Detection

**Decision**: Compare `task.dueDate` (or `task.due_date` from API) with `new Date().toISOString().split('T')[0]` and filter tasks where `status !== 'completed'` and `due_date < today`.

**Rationale**: Simple string comparison works for ISO date format (`YYYY-MM-DD`). The existing `TaskResponse` type includes `due_date: string` and `status: TaskStatus`. No timezone complexity needed — dates are date-only strings.

**Alternatives considered**:
- **date-fns library**: Adds dependency for one comparison.
- **Backend computation**: Out of scope; no API changes allowed.

# Quickstart: Enterprise Dashboard Redesign with Sidebar and Integrated AI Assistant

**Feature**: 005-dashboard-redesign-ai
**Date**: 2026-02-12

## Prerequisites

- Node.js 20+
- The frontend project at `phase-03-ai-chat/frontend/`
- Backend running at `http://localhost:8000` (optional — dashboard works with loading/error states)

## Development Setup

```bash
cd phase-03-ai-chat/frontend
npm install   # No new dependencies needed
npm run dev   # Starts Next.js dev server on http://localhost:3000
```

## Key Integration Points

### 1. Dashboard Page (`/dashboard`)

After implementation, the dashboard should display:
1. **Header** with "Dashboard" title, greeting, and "Add Task" button
2. **Summary Cards** row: Total, Completed, Pending, Overdue counts
3. **Primary Task Panel** (~60% width on desktop) with sort/filter controls
4. **Secondary Context Panel** (~40% width) with calendar preview / AI insights

**Manual Verification**:
- Navigate to `http://localhost:3000/dashboard`
- Verify summary cards show correct counts matching task data
- Sort by priority → high priority tasks should appear first
- Filter by "pending" → only pending tasks visible
- Hover over a task card → edit/complete/delete buttons appear
- Resize browser to <768px → content stacks vertically

### 2. Sidebar Navigation

The sidebar should contain (in order):
- **Main section**: Dashboard, Tasks, Calendar, AI Assistant, Analytics
- **Tools section**: (AI Insights link)
- **Bottom**: Settings, Dark Mode toggle, User profile

**Manual Verification**:
- Click each nav item → correct page loads, item highlights
- Click collapse toggle → sidebar transitions to icon-only view in <300ms
- Hover over icon in collapsed state → tooltip shows label
- Resize to <768px → sidebar becomes hidden, hamburger menu shows

### 3. AI Chat Slide-In Panel

**Manual Verification**:
- Click AI assistant button in header → panel slides in from right
- Type a message → AI responds (requires backend)
- Click close button → panel slides out
- Reopen panel → previous conversation preserved
- Resize to tablet (768-1024px) → panel appears as overlay
- Resize to mobile (<768px) → panel appears as modal/drawer
- Rapidly click toggle 5 times → no visual glitches

### 4. Analytics Page (`/dashboard/analytics`)

**Manual Verification**:
- Click "Analytics" in sidebar → page loads
- Header shows "Analytics"
- Subheading shows "Feature Coming Soon"
- Placeholder card areas are visible
- Sidebar highlights "Analytics" as active

### 5. Responsive Breakpoints

| Breakpoint | Sidebar | AI Panel | Dashboard Content |
|------------|---------|----------|-------------------|
| >1024px (Desktop) | Full expanded | Slide-in from right | Side-by-side panels |
| 768-1024px (Tablet) | Icon-only collapsed | Overlay | Side-by-side panels |
| <768px (Mobile) | Hidden (hamburger drawer) | Modal/drawer | Stacked vertically |
| <320px (Narrow) | Hidden (hamburger only) | Modal/drawer | Single column, min width |

### 6. Keyboard Navigation

- `Tab` through all interactive elements in logical order
- `Escape` closes AI panel when open
- `Escape` closes mobile sidebar when open
- All buttons have visible focus ring
- Summary cards are not tab-focusable (decorative)

## Existing API Endpoints Used (No Changes)

| Endpoint | Method | Used By |
|----------|--------|---------|
| `/api/tasks` | GET | SummaryCards, PrimaryTaskPanel (via useTasks) |
| `/api/tasks/:id` | PATCH | Task quick actions (complete/edit) |
| `/api/tasks/:id` | DELETE | Task quick actions (delete) |
| `/api/tasks` | POST | "Add Task" button |
| `/api/chat` | POST | AI slide-in panel |
| `/api/chat/history` | GET | AI slide-in panel |
| `/api/calendar/month` | GET | SecondaryContextPanel calendar preview |

## Files Changed Summary

| Action | Count | Key Files |
|--------|-------|-----------|
| CREATE | ~8 | SummaryCards, PrimaryTaskPanel, SecondaryContextPanel, DashboardHeader, AIChatSlideIn, SkeletonCard, useAIPanel, analytics/page.tsx |
| MODIFY | ~5 | Sidebar.tsx, Header.tsx, (dashboard)/layout.tsx, (dashboard)/page.tsx, ChatPanel.tsx |
| NO CHANGE | - | api.ts, types.ts, auth.ts, useTasks.ts, all backend files |

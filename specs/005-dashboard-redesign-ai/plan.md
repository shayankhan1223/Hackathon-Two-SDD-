# Implementation Plan: Enterprise Dashboard Redesign with Sidebar and Integrated AI Assistant

**Branch**: `005-dashboard-redesign-ai` | **Date**: 2026-02-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-dashboard-redesign-ai/spec.md`

## Summary

Redesign the TaskFlow Todo Web App dashboard from a flat layout to a structured, hierarchical enterprise dashboard. The sidebar navigation already exists and needs enhancement (Analytics link, responsive refinements). The dashboard main area needs summary cards, a dominant task list with sorting/filtering/hover actions, and a secondary context panel. The AI chat must be relocated from a fixed page to a toggle-based slide-in panel accessible from any dashboard page. An Analytics placeholder page needs to be created. All changes are frontend-only — no backend API modifications.

## Technical Context

**Language/Version**: TypeScript 5.9.3 with React 19 and Next.js 16.1.6 (App Router)
**Primary Dependencies**: Tailwind CSS 4.1.18, Lucide React 0.563, clsx, Zod 4.3, react-hook-form 7.71
**Storage**: N/A (frontend-only; consumes existing backend APIs via `src/lib/api.ts`)
**Testing**: Manual browser testing (no test framework configured in frontend)
**Target Platform**: Web (Desktop >1024px, Tablet 768-1024px, Mobile <768px)
**Project Type**: Web application (frontend only within `phase-03-ai-chat/frontend/`)
**Performance Goals**: Dashboard load <2s, sidebar animation <300ms, AI panel toggle <300ms
**Constraints**: No backend changes, no auth changes, preserve dark mode, preserve existing API contracts
**Scale/Scope**: ~15 component files modified/created, 2 new pages, 1 new hook

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution template is unfilled (project has no ratified constitution). No gates to enforce.
Proceeding with standard best practices: smallest viable diff, modular components, no secret leaks, code references.

**Post-design re-check**: PASS — all changes are frontend UI; no new APIs, no persistence changes, no security implications.

## Project Structure

### Documentation (this feature)

```text
specs/005-dashboard-redesign-ai/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (UI entities)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
phase-03-ai-chat/frontend/src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx                    # MODIFY: Add AI panel state, pass to children
│   │   ├── page.tsx                      # MODIFY: Redesign with summary cards + task list + context panel
│   │   ├── analytics/
│   │   │   └── page.tsx                  # CREATE: Analytics placeholder page
│   │   ├── calendar/page.tsx             # EXISTING (no changes)
│   │   ├── chat/page.tsx                 # EXISTING (keep as standalone page)
│   │   ├── settings/page.tsx             # EXISTING (no changes)
│   │   └── tasks/page.tsx               # EXISTING (no changes)
│   └── layout.tsx                        # EXISTING (no changes)
├── components/
│   ├── dashboard/
│   │   ├── SummaryCards.tsx              # CREATE: Task stats cards (Total, Completed, Pending, Overdue)
│   │   ├── PrimaryTaskPanel.tsx          # CREATE: Main task list with sort/filter/hover actions
│   │   ├── SecondaryContextPanel.tsx     # CREATE: Calendar preview + AI insights
│   │   ├── DashboardHeader.tsx           # CREATE: Header with title, greeting, Add Task button
│   │   ├── AIInsightsPanel.tsx           # MODIFY: Adapt for secondary panel
│   │   ├── QuickAddInput.tsx             # EXISTING (reuse)
│   │   └── ...                           # EXISTING components preserved
│   ├── chat/
│   │   ├── ChatPanel.tsx                 # MODIFY: Add close/minimize controls for slide-in mode
│   │   └── AIChatSlideIn.tsx             # CREATE: Slide-in wrapper with overlay + transitions
│   ├── layout/
│   │   ├── Sidebar.tsx                   # MODIFY: Add Analytics nav item, responsive refinements
│   │   └── Header.tsx                    # MODIFY: Add AI assistant toggle button
│   └── ui/
│       └── SkeletonCard.tsx              # CREATE: Skeleton loading placeholder
├── hooks/
│   ├── useAIPanel.ts                     # CREATE: AI panel open/close state management
│   ├── useTasks.ts                       # EXISTING (reuse for real data)
│   └── useSidebar.ts                     # EXISTING (no changes)
└── lib/
    ├── api.ts                            # EXISTING (no changes)
    └── types.ts                          # EXISTING (no changes)
```

**Structure Decision**: Web application frontend-only. All changes within `phase-03-ai-chat/frontend/src/`. No new directories beyond what's shown above. The `(dashboard)` route group already provides the correct layout structure.

## Complexity Tracking

No constitution violations to justify.

## Technology Decisions

### Libraries (No New Dependencies)

All features can be implemented using the existing stack:

| Need | Solution | Rationale |
|------|----------|-----------|
| Slide-in panel animations | Tailwind CSS `transition` + `transform` utilities | Already in stack; CSS transitions are performant |
| Summary card skeletons | Custom `SkeletonCard` component with Tailwind `animate-pulse` | Standard pattern; no lib needed |
| Sort/filter dropdowns | Existing `SortDropdown` + `FilterDropdown` components | Already built in `src/components/ui/` |
| Responsive breakpoints | Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) | Already configured |
| Icons | Lucide React (BarChart3, TrendingUp, Sparkles, PanelRightClose, etc.) | Already in stack |

### Architecture Patterns

| Pattern | Description |
|---------|-------------|
| State lifting | AI panel state managed in `(dashboard)/layout.tsx`, passed via props |
| Composition | Dashboard page composes SummaryCards, PrimaryTaskPanel, SecondaryContextPanel |
| Hook extraction | `useAIPanel` hook for panel open/close/minimize logic with localStorage |
| Responsive strategy | Mobile-first with `lg:` breakpoints for desktop sidebar, `md:` for tablet |

## Implementation Phases

### Phase 1: Sidebar Enhancement + Layout Foundation
**Goal**: Add Analytics to sidebar, ensure responsive collapse works correctly

- Add Analytics nav item (`BarChart3` icon) to sidebar `mainNavItems`
- Verify sidebar responsive behavior at all breakpoints
- Add AI Assistant toggle button to Header component
- Create `useAIPanel` hook for AI panel state

### Phase 2: Dashboard Hierarchy Redesign
**Goal**: Replace current dashboard with summary cards + dominant task list + secondary panel

- Create `DashboardHeader` with greeting, "Add Task" button
- Create `SummaryCards` showing Total/Completed/Pending/Overdue with skeleton states
- Create `PrimaryTaskPanel` with sorting, filtering, priority indicators, hover quick actions
- Create `SecondaryContextPanel` with calendar preview + AI insights tabs
- Create `SkeletonCard` for loading states
- Wire to real task data via existing `useTasks` hook

### Phase 3: AI Chat Slide-In Panel
**Goal**: Relocate AI chat to slide-in panel accessible from any dashboard page

- Create `AIChatSlideIn` wrapper component with slide-in/out animation
- Modify `ChatPanel` to support embedded mode (close/minimize controls)
- Integrate into `(dashboard)/layout.tsx` with portal or absolute positioning
- Preserve conversation history within session
- Handle overlay on tablet, modal on mobile

### Phase 4: Analytics Placeholder Page
**Goal**: Create Analytics page with "Coming Soon" layout

- Create `app/(dashboard)/analytics/page.tsx`
- Add header, subheading, and placeholder card areas
- Ensure consistent visual style with dashboard

### Phase 5: Polish & Cross-Cutting
**Goal**: Micro-interactions, transitions, accessibility, edge cases

- Smooth transitions for sidebar collapse/expand (already exists, verify <300ms)
- AI panel slide-in/out animation refinement
- Keyboard navigation (Tab order, focus management)
- Empty states for all panels
- Rapid toggle debounce for AI panel
- Test all breakpoints (desktop, tablet, mobile, <320px)
- ARIA labels and roles for new interactive elements

## Risk Assessment

1. **Task data is mock on dashboard**: Current dashboard page uses hardcoded mock data. Plan integrates real `useTasks` hook data, but if the backend is down the dashboard will show errors. **Mitigation**: Add graceful error/loading states.

2. **AI panel z-index conflicts**: Slide-in panel needs to layer correctly over main content and under mobile sidebar drawer. **Mitigation**: Establish clear z-index scale (sidebar=40, AI panel=30, overlays=50).

3. **Performance on re-render**: Opening/closing AI panel may trigger unnecessary re-renders of dashboard content. **Mitigation**: Use `React.memo` on heavy components and keep AI panel state isolated in layout.

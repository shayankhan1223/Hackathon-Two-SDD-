# Data Model: Enterprise Dashboard Redesign with Sidebar and Integrated AI Assistant

**Feature**: 005-dashboard-redesign-ai
**Date**: 2026-02-12

> This feature is frontend-only. No new database entities are created. This document describes the UI-level data structures (component props, state shapes, and computed values) that drive the redesigned dashboard.

## Existing Entities (No Changes)

### TaskResponse (from backend API)
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique task identifier |
| user_id | string | Owner user ID |
| title | string | Task title |
| description | string \| null | Optional description |
| due_date | string | ISO date (YYYY-MM-DD) |
| priority | "high" \| "medium" \| "low" | Task priority level |
| status | "pending" \| "completed" | Task completion status |
| tags | TagResponse[] | Associated tags |
| created_at | string | ISO datetime |
| updated_at | string | ISO datetime |

### ChatMessage (from backend API)
| Field | Type | Description |
|-------|------|-------------|
| id | string | Message identifier |
| role | "user" \| "assistant" | Message sender |
| content | string | Message text |
| created_at | string | ISO datetime |

## New UI Entities

### DashboardStats (computed client-side)
| Field | Type | Computation |
|-------|------|-------------|
| total | number | `tasks.length` |
| completed | number | `tasks.filter(t => t.status === 'completed').length` |
| pending | number | `total - completed` |
| overdue | number | `tasks.filter(t => t.status !== 'completed' && t.due_date < today).length` |
| completionRate | number | `Math.round((completed / total) * 100)` or 0 |

### SummaryCard
| Field | Type | Description |
|-------|------|-------------|
| label | string | Display label ("Total Tasks", "Completed", etc.) |
| value | number | Numeric metric |
| icon | LucideIcon | Visual indicator icon |
| color | string | Tailwind color class for accent |
| trend | "up" \| "down" \| "neutral" | Optional trend indicator |

### AIPanelState
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| isOpen | boolean | false | Whether the panel is visible |
| isMinimized | boolean | false | Whether the panel is minimized (header only) |

### SidebarNavItem
| Field | Type | Description |
|-------|------|-------------|
| href | string | Route path |
| icon | LucideIcon | Lucide icon component |
| label | string | Display text |
| section | "main" \| "tools" | Navigation section grouping |

### TaskSortOption
| Field | Type | Description |
|-------|------|-------------|
| field | "priority" \| "due_date" \| "title" \| "created_at" | Sort field |
| order | "asc" \| "desc" | Sort direction |

### TaskFilterState
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| status | "all" \| "pending" \| "completed" | "all" | Status filter |
| priority | "all" \| "high" \| "medium" \| "low" | "all" | Priority filter |
| search | string | "" | Text search term |

## State Relationships

```text
(dashboard)/layout.tsx
├── sidebarCollapsed: boolean ← useSidebar hook (existing)
├── mobileMenuOpen: boolean ← existing
├── aiPanelOpen: boolean ← useAIPanel hook (new)
│
├── <Sidebar /> ← receives isCollapsed, onToggle
├── <Header /> ← receives onAIToggle callback
├── <AIChatSlideIn /> ← receives isOpen, onClose
└── {children}
    └── (dashboard)/page.tsx
        ├── tasks: Task[] ← useTasks hook (existing)
        ├── stats: DashboardStats ← computed from tasks
        ├── sort: TaskSortOption ← local state
        ├── filter: TaskFilterState ← local state
        │
        ├── <DashboardHeader />
        ├── <SummaryCards stats={stats} />
        ├── <PrimaryTaskPanel tasks={filtered} sort={sort} />
        └── <SecondaryContextPanel />
```

## Validation Rules

- **SummaryCards**: Values must be non-negative integers. If loading, show skeleton state.
- **TaskSortOption**: `field` must be one of the allowed values. Default: `priority` / `desc`.
- **TaskFilterState**: Filters compose (AND logic). Empty search means no text filter.
- **AIPanelState**: Cannot be `isOpen=false` and `isMinimized=true` simultaneously.
- **Overdue detection**: Only tasks with `status !== 'completed'` and `due_date < today` (string comparison on YYYY-MM-DD format).

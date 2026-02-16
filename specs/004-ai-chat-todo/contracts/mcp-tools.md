# MCP Tool Contracts: AI Chat-Driven Todo Application

**Feature Branch**: `004-ai-chat-todo`
**Date**: 2026-02-10

These tools are implemented as `@function_tool` decorated functions in the OpenAI Agents SDK, callable by the AI agent. Each tool operates on the authenticated user's data only.

---

## Tool: add_task

**Description**: Create a new task for the authenticated user.

**Parameters**:

| Parameter   | Type             | Required | Default  | Description                           |
|-------------|------------------|----------|----------|---------------------------------------|
| title       | string           | Yes      | —        | Task title (1-255 chars)              |
| description | string \| null   | No       | null     | Optional description                  |
| due_date    | string (date)    | Yes      | —        | ISO date format (YYYY-MM-DD)          |
| priority    | string           | No       | "medium" | One of: high, medium, low             |
| tags        | list[string]     | No       | []       | Tag names (e.g., ["Work", "Study"])   |

**Returns**: JSON object with created task details (id, title, due_date, priority, status, tags, created_at).

**Errors**: Validation error if title empty or due_date invalid.

---

## Tool: update_task

**Description**: Update an existing task's fields. Only provided fields are modified.

**Parameters**:

| Parameter   | Type             | Required | Default | Description                          |
|-------------|------------------|----------|---------|--------------------------------------|
| task_id     | string (uuid)    | Yes      | —       | ID of the task to update             |
| title       | string \| null   | No       | null    | New title                            |
| description | string \| null   | No       | null    | New description                      |
| due_date    | string \| null   | No       | null    | New due date (YYYY-MM-DD)            |
| priority    | string \| null   | No       | null    | New priority (high/medium/low)       |
| status      | string \| null   | No       | null    | New status (pending/completed)       |
| tags        | list[string] \| null | No   | null    | Replace tags entirely                |

**Returns**: JSON object with updated task details.

**Errors**: 404 if task not found or not owned by user.

---

## Tool: delete_task

**Description**: Permanently delete a task.

**Parameters**:

| Parameter | Type          | Required | Description             |
|-----------|---------------|----------|-------------------------|
| task_id   | string (uuid) | Yes      | ID of the task to delete |

**Returns**: Confirmation message with deleted task title.

**Errors**: 404 if task not found or not owned by user.

---

## Tool: list_tasks

**Description**: List the user's tasks with optional filtering and sorting.

**Parameters**:

| Parameter     | Type           | Required | Default    | Description                              |
|---------------|----------------|----------|------------|------------------------------------------|
| status        | string \| null | No       | null       | Filter by pending or completed           |
| priority      | string \| null | No       | null       | Filter by high, medium, or low           |
| tags          | list[string] \| null | No | null       | Filter by tag names                      |
| search        | string \| null | No       | null       | Keyword search in title/description/tags |
| due_date_from | string \| null | No       | null       | Start of date range (YYYY-MM-DD)         |
| due_date_to   | string \| null | No       | null       | End of date range (YYYY-MM-DD)           |
| sort_by       | string         | No       | "due_date" | Sort field: due_date, priority, title    |
| sort_order    | string         | No       | "asc"      | Sort direction: asc or desc              |

**Returns**: JSON array of task objects matching filters.

---

## Tool: complete_task

**Description**: Mark a task as completed.

**Parameters**:

| Parameter | Type          | Required | Description               |
|-----------|---------------|----------|---------------------------|
| task_id   | string (uuid) | Yes      | ID of the task to complete |

**Returns**: Confirmation with task title and new status.

**Errors**: 404 if task not found or not owned by user.

---

## Tool: reschedule_task

**Description**: Change the due date of a task.

**Parameters**:

| Parameter    | Type          | Required | Description                |
|--------------|---------------|----------|----------------------------|
| task_id      | string (uuid) | Yes      | ID of the task to reschedule |
| new_due_date | string (date) | Yes      | New due date (YYYY-MM-DD)  |

**Returns**: Confirmation with task title, old date, and new date.

**Errors**: 404 if task not found. Validation error if date invalid.

---

## Tool: bulk_add_tasks

**Description**: Create multiple tasks in a single operation.

**Parameters**:

| Parameter | Type         | Required | Description                         |
|-----------|--------------|----------|-------------------------------------|
| tasks     | list[object] | Yes      | Array of task objects (same schema as add_task params) |

**Returns**: JSON array of created task objects. Reports partial failures if any.

**Errors**: Validation errors per-task, with clear indication of which succeeded/failed.

---

## Tool: bulk_update_tasks

**Description**: Update multiple tasks in a single operation.

**Parameters**:

| Parameter | Type         | Required | Description                                        |
|-----------|--------------|----------|----------------------------------------------------|
| updates   | list[object] | Yes      | Array of {task_id, ...fields_to_update} objects    |

**Returns**: JSON array of updated task objects. Reports partial failures.

**Errors**: Per-task errors (not found, validation) with clear indication.

---

## Tool: analytics_query

**Description**: Run a read-only analytical query over the user's tasks.

**Parameters**:

| Parameter  | Type   | Required | Description                                              |
|------------|--------|----------|----------------------------------------------------------|
| query_type | string | Yes      | One of: count, by_date, by_priority, by_tag, by_status, overdue |
| date_from  | string \| null | No | Start of date range filter                             |
| date_to    | string \| null | No | End of date range filter                               |
| tags       | list[string] \| null | No | Filter by tag names                             |

**Returns**: JSON object with query results (counts, groupings, date lists).

**Errors**: Invalid query_type.

---

## Client Tools (UI Control)

These tools are NOT database operations. They return instructions that ChatKit's `onClientTool` callback processes on the frontend.

### navigate_calendar

**Description**: Navigate the calendar UI to a specific date or view.

**Parameters**:

| Parameter | Type   | Required | Description                                |
|-----------|--------|----------|--------------------------------------------|
| date      | string | No       | Target date (YYYY-MM-DD)                   |
| view      | string | No       | Calendar view: month, week, day            |

### apply_filter

**Description**: Apply filters to the task list UI.

**Parameters**:

| Parameter | Type             | Required | Description                  |
|-----------|------------------|----------|------------------------------|
| status    | string \| null   | No       | pending or completed         |
| priority  | string \| null   | No       | high, medium, or low         |
| tags      | list[string] \| null | No   | Tag names to filter by       |
| search    | string \| null   | No       | Search keyword               |

### highlight_task

**Description**: Highlight a specific task in the UI (e.g., after creation).

**Parameters**:

| Parameter | Type          | Required | Description              |
|-----------|---------------|----------|--------------------------|
| task_id   | string (uuid) | Yes      | ID of the task to highlight |

"""@function_tool definitions for the AI agent — MCP-style tools."""

import uuid
from datetime import date, datetime
from typing import Any

from agents import RunContextWrapper, function_tool

from src.models.task import Priority, TaskStatus
from src.services import task_service


class AgentContext:
    """Context injected into the agent carrying user_id and DB session."""

    def __init__(self, user_id: uuid.UUID, session: Any):
        self.user_id = user_id
        self.session = session


def _parse_date(date_str: str) -> date:
    """Parse a date string in YYYY-MM-DD format."""
    return datetime.strptime(date_str, "%Y-%m-%d").date()


def _parse_priority(priority_str: str) -> Priority:
    """Parse a priority string."""
    return Priority(priority_str.lower())


@function_tool
async def add_task(
    ctx: RunContextWrapper[AgentContext],
    title: str,
    due_date: str,
    description: str | None = None,
    priority: str = "medium",
    tags: list[str] | None = None,
) -> str:
    """Create a new task for the user.

    Args:
        title: Task title (1-255 chars)
        due_date: ISO date format (YYYY-MM-DD)
        description: Optional description
        priority: One of: high, medium, low
        tags: Tag names (e.g., ["Work", "Study"])
    """
    session = ctx.context.session
    user_id = ctx.context.user_id

    parsed_date = _parse_date(due_date)
    parsed_priority = _parse_priority(priority)

    # Resolve tag names to IDs
    tag_ids = None
    if tags:
        from sqlmodel import select
        from src.models.task import Tag
        result = await session.execute(select(Tag).where(Tag.name.in_(tags)))
        tag_ids = [t.id for t in result.scalars().all()]

    task = await task_service.create_task(
        session=session,
        user_id=user_id,
        title=title,
        due_date=parsed_date,
        description=description,
        priority=parsed_priority,
        tag_ids=tag_ids,
    )
    task_tags = await task_service.get_task_tags(session, task.id)
    return (
        f"Task created: '{task.title}' due {task.due_date.isoformat()}, "
        f"priority: {task.priority.value}, status: {task.status.value}, "
        f"tags: {[t.name for t in task_tags]}, id: {task.id}"
    )


@function_tool
async def update_task(
    ctx: RunContextWrapper[AgentContext],
    task_id: str,
    title: str | None = None,
    description: str | None = None,
    due_date: str | None = None,
    priority: str | None = None,
    status: str | None = None,
    tags: list[str] | None = None,
) -> str:
    """Update an existing task's fields. Only provided fields are modified.

    Args:
        task_id: ID of the task to update
        title: New title
        description: New description
        due_date: New due date (YYYY-MM-DD)
        priority: New priority (high/medium/low)
        status: New status (pending/completed)
        tags: Replace tags entirely with these tag names
    """
    session = ctx.context.session
    user_id = ctx.context.user_id

    tag_ids = None
    if tags is not None:
        from sqlmodel import select
        from src.models.task import Tag
        result = await session.execute(select(Tag).where(Tag.name.in_(tags)))
        tag_ids = [t.id for t in result.scalars().all()]

    task = await task_service.update_task(
        session=session,
        user_id=user_id,
        task_id=uuid.UUID(task_id),
        title=title,
        description=description,
        due_date=_parse_date(due_date) if due_date else None,
        priority=_parse_priority(priority) if priority else None,
        status=TaskStatus(status) if status else None,
        tag_ids=tag_ids,
    )
    if not task:
        return f"Task not found with id: {task_id}"
    return f"Task updated: '{task.title}' — due {task.due_date.isoformat()}, priority: {task.priority.value}, status: {task.status.value}"


@function_tool
async def delete_task(
    ctx: RunContextWrapper[AgentContext],
    task_id: str,
) -> str:
    """Permanently delete a task.

    Args:
        task_id: ID of the task to delete
    """
    session = ctx.context.session
    user_id = ctx.context.user_id

    # Get task title before deleting
    task = await task_service.get_task(session, user_id, uuid.UUID(task_id))
    if not task:
        return f"Task not found with id: {task_id}"

    title = task.title
    deleted = await task_service.delete_task(session, user_id, uuid.UUID(task_id))
    if deleted:
        return f"Task deleted: '{title}'"
    return f"Failed to delete task: {task_id}"


@function_tool
async def list_tasks(
    ctx: RunContextWrapper[AgentContext],
    status: str | None = None,
    priority: str | None = None,
    tags: list[str] | None = None,
    search: str | None = None,
    due_date_from: str | None = None,
    due_date_to: str | None = None,
    sort_by: str = "due_date",
    sort_order: str = "asc",
) -> str:
    """List the user's tasks with optional filtering and sorting.

    Args:
        status: Filter by pending or completed
        priority: Filter by high, medium, or low
        tags: Filter by tag names
        search: Keyword search in title/description/tags
        due_date_from: Start of date range (YYYY-MM-DD)
        due_date_to: End of date range (YYYY-MM-DD)
        sort_by: Sort field: due_date, priority, title
        sort_order: Sort direction: asc or desc
    """
    session = ctx.context.session
    user_id = ctx.context.user_id

    tag_ids = None
    if tags:
        from sqlmodel import select
        from src.models.task import Tag
        result = await session.execute(select(Tag).where(Tag.name.in_(tags)))
        tag_ids = [t.id for t in result.scalars().all()]

    tasks = await task_service.list_tasks(
        session=session,
        user_id=user_id,
        status=TaskStatus(status) if status else None,
        priority=Priority(priority) if priority else None,
        tag_ids=tag_ids,
        search=search,
        due_date_from=_parse_date(due_date_from) if due_date_from else None,
        due_date_to=_parse_date(due_date_to) if due_date_to else None,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    if not tasks:
        return "No tasks found matching your criteria."

    lines = [f"Found {len(tasks)} task(s):"]
    for t in tasks:
        task_tags = await task_service.get_task_tags(session, t.id)
        tag_str = f" [{', '.join(tg.name for tg in task_tags)}]" if task_tags else ""
        lines.append(
            f"- {t.title} | Due: {t.due_date.isoformat()} | "
            f"Priority: {t.priority.value} | Status: {t.status.value}{tag_str} | ID: {t.id}"
        )
    return "\n".join(lines)


@function_tool
async def complete_task(
    ctx: RunContextWrapper[AgentContext],
    task_id: str,
) -> str:
    """Mark a task as completed.

    Args:
        task_id: ID of the task to complete
    """
    session = ctx.context.session
    user_id = ctx.context.user_id

    task = await task_service.complete_task(session, user_id, uuid.UUID(task_id))
    if not task:
        return f"Task not found with id: {task_id}"
    return f"Task completed: '{task.title}'"


@function_tool
async def reschedule_task(
    ctx: RunContextWrapper[AgentContext],
    task_id: str,
    new_due_date: str,
) -> str:
    """Change the due date of a task.

    Args:
        task_id: ID of the task to reschedule
        new_due_date: New due date (YYYY-MM-DD)
    """
    session = ctx.context.session
    user_id = ctx.context.user_id

    old_task = await task_service.get_task(session, user_id, uuid.UUID(task_id))
    if not old_task:
        return f"Task not found with id: {task_id}"

    old_date = old_task.due_date.isoformat()
    task = await task_service.update_task(
        session=session,
        user_id=user_id,
        task_id=uuid.UUID(task_id),
        due_date=_parse_date(new_due_date),
    )
    return f"Task rescheduled: '{task.title}' from {old_date} to {task.due_date.isoformat()}"


@function_tool
async def bulk_add_tasks(
    ctx: RunContextWrapper[AgentContext],
    tasks_json: str,
) -> str:
    """Create multiple tasks in a single operation.

    Args:
        tasks_json: JSON string of array of task objects. Each object has keys: title (required), due_date (required, YYYY-MM-DD), description (optional), priority (optional, default medium), tags (optional, list of tag names). Example: [{"title":"Buy milk","due_date":"TODAY_DATE"},{"title":"Call dentist","due_date":"TOMORROW_DATE","priority":"high"}]
    """
    import json as _json
    tasks = _json.loads(tasks_json)
    session = ctx.context.session
    user_id = ctx.context.user_id

    results = []
    for i, t in enumerate(tasks):
        try:
            tag_ids = None
            if t.get("tags"):
                from sqlmodel import select
                from src.models.task import Tag
                result = await session.execute(select(Tag).where(Tag.name.in_(t["tags"])))
                tag_ids = [tg.id for tg in result.scalars().all()]

            task = await task_service.create_task(
                session=session,
                user_id=user_id,
                title=t["title"],
                due_date=_parse_date(t["due_date"]),
                description=t.get("description"),
                priority=_parse_priority(t.get("priority", "medium")),
                tag_ids=tag_ids,
            )
            results.append(f"✓ Created: '{task.title}' due {task.due_date.isoformat()}")
        except Exception as e:
            results.append(f"✗ Failed task {i + 1}: {str(e)}")

    return f"Bulk add results ({len(results)} tasks):\n" + "\n".join(results)


@function_tool
async def bulk_update_tasks(
    ctx: RunContextWrapper[AgentContext],
    updates_json: str,
) -> str:
    """Update multiple tasks in a single operation.

    Args:
        updates_json: JSON string of array of update objects. Each object must have task_id and optional fields: title, description, due_date, priority, status, tags. Example: [{"task_id":"uuid-here","status":"completed"},{"task_id":"uuid-2","priority":"high"}]
    """
    import json as _json
    updates = _json.loads(updates_json)
    session = ctx.context.session
    user_id = ctx.context.user_id

    results = []
    for i, u in enumerate(updates):
        try:
            task_id = uuid.UUID(u["task_id"])
            tag_ids = None
            if u.get("tags") is not None:
                from sqlmodel import select
                from src.models.task import Tag
                result = await session.execute(select(Tag).where(Tag.name.in_(u["tags"])))
                tag_ids = [tg.id for tg in result.scalars().all()]

            task = await task_service.update_task(
                session=session,
                user_id=user_id,
                task_id=task_id,
                title=u.get("title"),
                description=u.get("description"),
                due_date=_parse_date(u["due_date"]) if u.get("due_date") else None,
                priority=_parse_priority(u["priority"]) if u.get("priority") else None,
                status=TaskStatus(u["status"]) if u.get("status") else None,
                tag_ids=tag_ids,
            )
            if task:
                results.append(f"✓ Updated: '{task.title}'")
            else:
                results.append(f"✗ Task not found: {u['task_id']}")
        except Exception as e:
            results.append(f"✗ Failed update {i + 1}: {str(e)}")

    return f"Bulk update results ({len(results)} tasks):\n" + "\n".join(results)


@function_tool
async def analytics_query(
    ctx: RunContextWrapper[AgentContext],
    query_type: str,
    date_from: str | None = None,
    date_to: str | None = None,
    tags: list[str] | None = None,
) -> str:
    """Run a read-only analytical query over the user's tasks.

    Args:
        query_type: One of: count, by_date, by_priority, by_tag, by_status, overdue
        date_from: Start of date range filter (YYYY-MM-DD)
        date_to: End of date range filter (YYYY-MM-DD)
        tags: Filter by tag names
    """
    session = ctx.context.session
    user_id = ctx.context.user_id

    result = await task_service.analytics_query(
        session=session,
        user_id=user_id,
        query_type=query_type,
        date_from=_parse_date(date_from) if date_from else None,
        date_to=_parse_date(date_to) if date_to else None,
        tags=tags,
    )
    import json
    return json.dumps(result, default=str)

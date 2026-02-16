"""Client tool definitions for UI control via ChatKit's onClientTool."""

from agents import function_tool, RunContextWrapper
from src.agent.tools import AgentContext


@function_tool
async def navigate_calendar(
    ctx: RunContextWrapper[AgentContext],
    date: str | None = None,
    view: str | None = None,
) -> str:
    """Navigate the calendar UI to a specific date or view.

    Args:
        date: Target date (YYYY-MM-DD)
        view: Calendar view: month, week, or day
    """
    parts = []
    if date:
        parts.append(f"date={date}")
    if view:
        parts.append(f"view={view}")
    return f"Calendar navigated: {', '.join(parts) if parts else 'default view'}"


@function_tool
async def apply_filter(
    ctx: RunContextWrapper[AgentContext],
    status: str | None = None,
    priority: str | None = None,
    tags: list[str] | None = None,
    search: str | None = None,
) -> str:
    """Apply filters to the task list UI.

    Args:
        status: pending or completed
        priority: high, medium, or low
        tags: Tag names to filter by
        search: Search keyword
    """
    filters = {}
    if status:
        filters["status"] = status
    if priority:
        filters["priority"] = priority
    if tags:
        filters["tags"] = tags
    if search:
        filters["search"] = search
    return f"Filters applied: {filters if filters else 'cleared'}"


@function_tool
async def highlight_task(
    ctx: RunContextWrapper[AgentContext],
    task_id: str,
) -> str:
    """Highlight a specific task in the UI.

    Args:
        task_id: ID of the task to highlight
    """
    return f"Task highlighted: {task_id}"

"""Task business logic — CRUD operations scoped to authenticated user."""

import uuid
from datetime import date, datetime, timezone

from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.models.task import Priority, Tag, Task, TaskStatus, TaskTag


async def create_task(
    session: AsyncSession,
    user_id: uuid.UUID,
    title: str,
    due_date: date,
    description: str | None = None,
    priority: Priority = Priority.medium,
    tag_ids: list[uuid.UUID] | None = None,
) -> Task:
    """Create a new task for the user."""
    task = Task(
        user_id=user_id,
        title=title,
        description=description,
        due_date=due_date,
        priority=priority,
        status=TaskStatus.pending,
    )
    session.add(task)
    await session.flush()

    if tag_ids:
        for tag_id in tag_ids:
            task_tag = TaskTag(task_id=task.id, tag_id=tag_id)
            session.add(task_tag)

    await session.commit()
    await session.refresh(task)
    return task


async def get_task(
    session: AsyncSession, user_id: uuid.UUID, task_id: uuid.UUID
) -> Task | None:
    """Get a single task by ID, scoped to user."""
    result = await session.execute(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def list_tasks(
    session: AsyncSession,
    user_id: uuid.UUID,
    status: TaskStatus | None = None,
    priority: Priority | None = None,
    tag_ids: list[uuid.UUID] | None = None,
    search: str | None = None,
    due_date_from: date | None = None,
    due_date_to: date | None = None,
    sort_by: str = "due_date",
    sort_order: str = "asc",
) -> list[Task]:
    """List tasks for a user with optional filters, search, and sorting."""
    query = select(Task).where(Task.user_id == user_id)

    if status:
        query = query.where(Task.status == status)
    if priority:
        query = query.where(Task.priority == priority)
    if due_date_from:
        query = query.where(Task.due_date >= due_date_from)
    if due_date_to:
        query = query.where(Task.due_date <= due_date_to)
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            Task.title.ilike(search_filter) | Task.description.ilike(search_filter)
        )
    if tag_ids:
        query = query.where(
            Task.id.in_(
                select(TaskTag.task_id).where(TaskTag.tag_id.in_(tag_ids))
            )
        )

    # Sorting
    sort_column = {
        "due_date": Task.due_date,
        "priority": Task.priority,
        "title": Task.title,
    }.get(sort_by, Task.due_date)

    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    result = await session.execute(query)
    return list(result.scalars().all())


async def update_task(
    session: AsyncSession,
    user_id: uuid.UUID,
    task_id: uuid.UUID,
    title: str | None = None,
    description: str | None = None,
    due_date: date | None = None,
    priority: Priority | None = None,
    status: TaskStatus | None = None,
    tag_ids: list[uuid.UUID] | None = None,
) -> Task | None:
    """Update a task's fields. Only provided fields are modified."""
    task = await get_task(session, user_id, task_id)
    if not task:
        return None

    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    if due_date is not None:
        task.due_date = due_date
    if priority is not None:
        task.priority = priority
    if status is not None:
        task.status = status
    task.updated_at = datetime.now(timezone.utc)

    if tag_ids is not None:
        # Replace tags entirely
        existing = await session.execute(
            select(TaskTag).where(TaskTag.task_id == task.id)
        )
        for tt in existing.scalars().all():
            await session.delete(tt)
        for tag_id in tag_ids:
            session.add(TaskTag(task_id=task.id, tag_id=tag_id))

    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def delete_task(
    session: AsyncSession, user_id: uuid.UUID, task_id: uuid.UUID
) -> bool:
    """Delete a task. Returns True if deleted, False if not found."""
    task = await get_task(session, user_id, task_id)
    if not task:
        return False

    # Delete task tags first
    existing = await session.execute(
        select(TaskTag).where(TaskTag.task_id == task.id)
    )
    for tt in existing.scalars().all():
        await session.delete(tt)

    await session.delete(task)
    await session.commit()
    return True


async def complete_task(
    session: AsyncSession, user_id: uuid.UUID, task_id: uuid.UUID
) -> Task | None:
    """Mark a task as completed."""
    return await update_task(session, user_id, task_id, status=TaskStatus.completed)


async def get_tags(session: AsyncSession) -> list[Tag]:
    """Get all available tags."""
    result = await session.execute(select(Tag).order_by(Tag.name))
    return list(result.scalars().all())


async def get_task_tags(session: AsyncSession, task_id: uuid.UUID) -> list[Tag]:
    """Get tags for a specific task."""
    result = await session.execute(
        select(Tag).join(TaskTag).where(TaskTag.task_id == task_id)
    )
    return list(result.scalars().all())


async def get_dates_with_tasks(
    session: AsyncSession, user_id: uuid.UUID, year: int, month: int
) -> list[date]:
    """Get distinct dates in a month that have tasks."""
    from datetime import date as date_type

    first_day = date_type(year, month, 1)
    if month == 12:
        last_day = date_type(year + 1, 1, 1)
    else:
        last_day = date_type(year, month + 1, 1)

    result = await session.execute(
        select(Task.due_date)
        .where(
            Task.user_id == user_id,
            Task.due_date >= first_day,
            Task.due_date < last_day,
        )
        .distinct()
        .order_by(Task.due_date)
    )
    return [row for row in result.scalars().all()]


async def get_tasks_for_date(
    session: AsyncSession, user_id: uuid.UUID, target_date: date
) -> dict:
    """Get pending and completed tasks for a specific date."""
    result = await session.execute(
        select(Task).where(Task.user_id == user_id, Task.due_date == target_date)
    )
    tasks = result.scalars().all()
    return {
        "date": target_date.isoformat(),
        "pending_tasks": [t for t in tasks if t.status == TaskStatus.pending],
        "completed_tasks": [t for t in tasks if t.status == TaskStatus.completed],
    }


async def analytics_query(
    session: AsyncSession,
    user_id: uuid.UUID,
    query_type: str,
    date_from: date | None = None,
    date_to: date | None = None,
    tags: list[str] | None = None,
) -> dict:
    """Run a read-only analytical query over the user's tasks."""
    base_query = select(Task).where(Task.user_id == user_id)

    if date_from:
        base_query = base_query.where(Task.due_date >= date_from)
    if date_to:
        base_query = base_query.where(Task.due_date <= date_to)
    if tags:
        tag_result = await session.execute(select(Tag).where(Tag.name.in_(tags)))
        tag_ids = [t.id for t in tag_result.scalars().all()]
        if tag_ids:
            base_query = base_query.where(
                Task.id.in_(select(TaskTag.task_id).where(TaskTag.tag_id.in_(tag_ids)))
            )

    result = await session.execute(base_query)
    tasks = list(result.scalars().all())

    if query_type == "count":
        return {"count": len(tasks)}
    elif query_type == "by_priority":
        groups = {}
        for t in tasks:
            p = t.priority.value
            groups[p] = groups.get(p, 0) + 1
        return {"by_priority": groups}
    elif query_type == "by_status":
        groups = {}
        for t in tasks:
            s = t.status.value
            groups[s] = groups.get(s, 0) + 1
        return {"by_status": groups}
    elif query_type == "by_date":
        groups = {}
        for t in tasks:
            d = t.due_date.isoformat()
            groups[d] = groups.get(d, 0) + 1
        return {"by_date": groups}
    elif query_type == "by_tag":
        groups = {}
        for t in tasks:
            task_tags = await get_task_tags(session, t.id)
            for tag in task_tags:
                groups[tag.name] = groups.get(tag.name, 0) + 1
        return {"by_tag": groups}
    elif query_type == "overdue":
        from datetime import date as date_type

        today = date_type.today()
        overdue = [
            t for t in tasks if t.due_date < today and t.status == TaskStatus.pending
        ]
        return {"overdue_count": len(overdue), "overdue_tasks": [t.title for t in overdue]}
    else:
        return {"error": f"Unknown query_type: {query_type}"}

"""Task, Tag, TaskTag SQLModel entities."""

import enum
import uuid
from datetime import date, datetime, timezone

from sqlalchemy import DateTime
from sqlmodel import Column, Enum, Field, SQLModel


class Priority(str, enum.Enum):
    high = "high"
    medium = "medium"
    low = "low"


class TaskStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"


class Tag(SQLModel, table=True):
    """Label category for organizing tasks."""

    __tablename__ = "tags"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=50, unique=True, nullable=False)


class TaskTag(SQLModel, table=True):
    """Many-to-many join table between Task and Tag."""

    __tablename__ = "task_tags"

    task_id: uuid.UUID = Field(foreign_key="tasks.id", primary_key=True)
    tag_id: uuid.UUID = Field(foreign_key="tags.id", primary_key=True)


class Task(SQLModel, table=True):
    """A to-do item owned by a single user."""

    __tablename__ = "tasks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, index=True)
    title: str = Field(max_length=255, nullable=False)
    description: str | None = Field(default=None)
    due_date: date = Field(nullable=False)
    priority: Priority = Field(
        sa_column=Column(Enum(Priority), nullable=False, server_default="medium")
    )
    status: TaskStatus = Field(
        sa_column=Column(Enum(TaskStatus), nullable=False, server_default="pending")
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

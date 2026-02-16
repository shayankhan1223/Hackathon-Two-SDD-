"""
SQLModel ORM models for User and Task entities.
"""
from sqlmodel import Field, SQLModel
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional


class User(SQLModel, table=True):
    """
    User model representing an authenticated application user.

    Attributes:
        id: Unique identifier (UUID)
        email: Unique email address for authentication
        hashed_password: bcrypt-hashed password (never store plaintext)
        created_at: Account creation timestamp
    """

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False, max_length=255)
    hashed_password: str = Field(nullable=False, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class Task(SQLModel, table=True):
    """
    Task model representing a todo item belonging to a user.

    Attributes:
        id: Unique identifier (UUID)
        user_id: Owner of the task (foreign key to users.id)
        title: Task title (required, max 200 characters)
        description: Task description (optional, max 1000 characters)
        completed: Task completion status (default: False)
        created_at: Task creation timestamp
        updated_at: Task last modification timestamp (auto-updated)

    Constraints:
        - user_id is immutable after creation (enforced at service layer)
        - title cannot be empty
        - Only the owner can access/modify the task (enforced at API layer)
    """

    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True, nullable=False)
    title: str = Field(nullable=False, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

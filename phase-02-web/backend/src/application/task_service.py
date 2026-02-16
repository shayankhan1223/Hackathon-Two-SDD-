"""
Task service with business logic and user isolation enforcement.
"""
from sqlmodel import Session, select
from uuid import UUID
from typing import List, Optional
from datetime import datetime
from src.infrastructure.models import Task


class TaskService:
    """Service for task management with user isolation."""

    def __init__(self, session: Session):
        self.session = session

    def get_user_tasks(self, user_id: UUID) -> List[Task]:
        """
        Get all tasks for a specific user.

        Args:
            user_id: User's unique identifier

        Returns:
            List of tasks belonging to the user
        """
        statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
        tasks = self.session.exec(statement).all()
        return list(tasks)

    def create_task(self, user_id: UUID, title: str, description: Optional[str] = None) -> Task:
        """
        Create a new task for a user.

        Args:
            user_id: Owner's unique identifier
            title: Task title (required)
            description: Task description (optional)

        Returns:
            Created task

        Business Rules:
            - user_id is set automatically from JWT
            - title must not be empty
            - user_id is immutable after creation
        """
        task = Task(user_id=user_id, title=title, description=description or "")

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)

        return task

    def get_task_by_id(self, task_id: UUID, user_id: UUID) -> Optional[Task]:
        """
        Get a specific task by ID if it belongs to the user.

        Args:
            task_id: Task's unique identifier
            user_id: User's unique identifier (for ownership validation)

        Returns:
            Task if found and owned by user, None otherwise
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = self.session.exec(statement).first()
        return task

    def update_task(
        self,
        task_id: UUID,
        user_id: UUID,
        title: Optional[str] = None,
        description: Optional[str] = None,
        completed: Optional[bool] = None,
    ) -> Optional[Task]:
        """
        Update a task if it belongs to the user.

        Args:
            task_id: Task's unique identifier
            user_id: User's unique identifier (for ownership validation)
            title: New title (optional)
            description: New description (optional)
            completed: New completion status (optional)

        Returns:
            Updated task if found and owned by user, None otherwise

        Business Rules:
            - user_id cannot be changed (immutable)
            - updated_at is automatically set
        """
        task = self.get_task_by_id(task_id, user_id)
        if not task:
            return None

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if completed is not None:
            task.completed = completed

        task.updated_at = datetime.utcnow()

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)

        return task

    def delete_task(self, task_id: UUID, user_id: UUID) -> bool:
        """
        Delete a task if it belongs to the user.

        Args:
            task_id: Task's unique identifier
            user_id: User's unique identifier (for ownership validation)

        Returns:
            True if task was deleted, False if not found or not owned by user
        """
        task = self.get_task_by_id(task_id, user_id)
        if not task:
            return False

        self.session.delete(task)
        self.session.commit()

        return True

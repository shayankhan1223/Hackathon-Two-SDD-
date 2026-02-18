"""SQLModel entities — import all models to ensure they are registered."""

from src.models.chat_message import ChatMessage, MessageRole
from src.models.task import Priority, Tag, Task, TaskStatus, TaskTag
from src.models.uploaded_file import UploadedFile
from src.models.user import User
from src.models.user_preferences import UserPreferences
from src.models.password_reset_token import PasswordResetToken

__all__ = [
    "User",
    "Task",
    "Tag",
    "TaskTag",
    "ChatMessage",
    "UploadedFile",
    "Priority",
    "TaskStatus",
    "MessageRole",
    "UserPreferences",
    "PasswordResetToken",
]

"""ChatMessage SQLModel entity."""

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime
from sqlmodel import Column, Enum, Field, SQLModel


class MessageRole(str, enum.Enum):
    user = "user"
    assistant = "assistant"


class ChatMessage(SQLModel, table=True):
    """A single message in a user's chat conversation."""

    __tablename__ = "chat_messages"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, index=True)
    role: MessageRole = Field(
        sa_column=Column(Enum(MessageRole), nullable=False)
    )
    content: str = Field(nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

"""Model for tracking uploaded files."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Column, DateTime, Integer, String
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class UploadedFileBase(SQLModel):
    filename: str = Field(max_length=255)
    size: int
    content_type: str = Field(max_length=100)
    file_path: str = Field(max_length=500)


class UploadedFile(UploadedFileBase, table=True):
    __tablename__ = "uploaded_files"

    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True)))

    # Relationship
    user: "User" = Relationship(back_populates="uploaded_files")


class UploadedFileCreate(UploadedFileBase):
    pass


class UploadedFileRead(UploadedFileBase):
    id: int
    user_id: str
    created_at: datetime
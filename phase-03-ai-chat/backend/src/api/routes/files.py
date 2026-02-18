"""File upload/download endpoints for Hugging Face compatibility."""

import os
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.deps import get_current_user, get_session
from src.models.uploaded_file import UploadedFileCreate, UploadedFile
from src.models.user import User

router = APIRouter(prefix="/api/files", tags=["Files"])

# Define upload directory - use a temporary directory that works on Hugging Face
UPLOAD_DIR = Path("/tmp/uploads")  # Hugging Face Spaces friendly location
UPLOAD_DIR.mkdir(exist_ok=True)

# Maximum file size: 10MB (Hugging Face Spaces limitation)
MAX_FILE_SIZE = 10 * 1024 * 1024

class FileUploadResponse(BaseModel):
    id: str
    filename: str
    size: int
    content_type: str
    upload_time: str
    url: str


@router.post("", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Upload a file to the server."""
    # Check file size
    # Note: We can't get the size directly from UploadFile, so we'll check as we read
    file_content = await file.read()

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
        )

    # Validate file type (basic validation)
    allowed_types = [
        "text/plain", "text/csv", "application/pdf",
        "image/jpeg", "image/png", "image/gif",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]

    if file.content_type and file.content_type.lower() not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_types)}"
        )

    # Generate unique filename
    file_id = str(uuid.uuid4())
    file_extension = Path(file.filename).suffix
    safe_filename = f"{file_id}{file_extension}"

    file_path = UPLOAD_DIR / safe_filename

    # Write file to disk
    try:
        with open(file_path, "wb") as f:
            f.write(file_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Create database record
    try:
        db_file = UploadedFile(
            filename=file.filename,
            size=len(file_content),
            content_type=file.content_type or "application/octet-stream",
            file_path=str(file_path),
            user_id=str(current_user.id)
        )
        session.add(db_file)
        await session.commit()
        await session.refresh(db_file)
    except Exception as e:
        # Clean up the file if DB insertion fails
        try:
            os.remove(file_path)
        except:
            pass
        raise HTTPException(status_code=500, detail=f"Failed to save file record: {str(e)}")

    # Create response
    response = FileUploadResponse(
        id=file_id,
        filename=file.filename,
        size=len(file_content),
        content_type=file.content_type or "application/octet-stream",
        upload_time=datetime.utcnow().isoformat(),
        url=f"/api/files/{file_id}"
    )

    return response


@router.get("/{file_id}")
async def download_file(
    file_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Download a file by ID."""
    from sqlmodel import select

    # Validate file_id format
    try:
        uuid.UUID(file_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid file ID format")

    # Look for the file in the database
    result = await session.execute(
        select(UploadedFile).where(
            UploadedFile.file_path.like(f"%{file_id}%"),
            UploadedFile.user_id == str(current_user.id)
        )
    )
    db_file = result.first()

    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    db_file = db_file[0]  # Get the actual file object from the tuple
    file_path = Path(db_file.file_path)

    # Verify the file exists on disk
    if not file_path.exists():
        # Remove the database record if file is missing
        session.delete(db_file)
        await session.commit()
        raise HTTPException(status_code=404, detail="File not found on disk")

    return FileResponse(
        path=file_path,
        media_type=db_file.content_type,
        filename=db_file.filename
    )


@router.delete("/{file_id}")
async def delete_file(
    file_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Delete a file by ID."""
    from sqlmodel import select

    # Validate file_id format
    try:
        uuid.UUID(file_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid file ID format")

    # Find the file in the database
    result = await session.execute(
        select(UploadedFile).where(
            UploadedFile.file_path.like(f"%{file_id}%"),
            UploadedFile.user_id == str(current_user.id)
        )
    )
    db_file = result.first()

    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    db_file = db_file[0]  # Get the actual file object from the tuple
    file_path = Path(db_file.file_path)

    # Delete the physical file
    try:
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file from disk: {str(e)}")

    # Delete the database record
    try:
        session.delete(db_file)
        await session.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file record: {str(e)}")

    return {"message": "File deleted successfully"}


class FileListResponse(BaseModel):
    files: list[FileUploadResponse]


@router.get("", response_model=FileListResponse)
async def list_files(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """List all files uploaded by the current user."""
    from sqlmodel import select

    result = await session.execute(
        select(UploadedFile).where(UploadedFile.user_id == str(current_user.id))
    )
    db_files = result.scalars().all()

    files = []
    for db_file in db_files:
        file_resp = FileUploadResponse(
            id=Path(db_file.file_path).stem,  # Extract UUID from file path
            filename=db_file.filename,
            size=db_file.size,
            content_type=db_file.content_type,
            upload_time=db_file.created_at.isoformat(),
            url=f"/api/files/{Path(db_file.file_path).stem}"
        )
        files.append(file_resp)

    return FileListResponse(files=files)
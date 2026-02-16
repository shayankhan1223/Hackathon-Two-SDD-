"""
Authentication endpoints for user registration, login, and profile retrieval.
Updated to match specification v1.2 API contract.
"""
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlmodel import Session, select
from uuid import UUID
from src.infrastructure.database import get_session
from src.infrastructure.models import User
from src.application.auth_service import (
    hash_password,
    verify_password,
    create_jwt_token,
    verify_jwt_token,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# Request Models
class RegisterRequest(BaseModel):
    """Registration request with email and password."""

    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=1, description="Password (minimum 1 character)")


class LoginRequest(BaseModel):
    """Login request with email and password."""

    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="Password")


# Response Models (T001, T002)
class UserProfile(BaseModel):
    """User profile with id, email, and created_at."""

    id: UUID = Field(..., description="Unique user identifier")
    email: str = Field(..., description="User's email address")
    created_at: datetime = Field(..., description="User's registration date and time")


class AuthSuccessResponse(BaseModel):
    """Authentication response with token and nested user object."""

    token: str = Field(..., description="JWT token for authentication")
    user: UserProfile = Field(..., description="User profile information")


# Endpoints (T003, T004, T005, T006)
@router.post("/register", response_model=AuthSuccessResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, session: Session = Depends(get_session)):
    """
    Create a new user account.

    Args:
        request: Registration request with email and password
        session: Database session

    Returns:
        AuthSuccessResponse with token and user profile

    Raises:
        409: Email already registered
        422: Validation error
    """
    # Check if email already exists
    statement = select(User).where(User.email == request.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # Create new user with hashed password
    hashed_pwd = hash_password(request.password)
    new_user = User(email=request.email, hashed_password=hashed_pwd)

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Generate JWT token
    token = create_jwt_token(new_user.id)

    # Return response with nested user object
    return AuthSuccessResponse(
        token=token,
        user=UserProfile(
            id=new_user.id,
            email=new_user.email,
            created_at=new_user.created_at,
        ),
    )


@router.post("/login", response_model=AuthSuccessResponse)
async def login(request: LoginRequest, session: Session = Depends(get_session)):
    """
    Authenticate an existing user.

    Args:
        request: Login request with email and password
        session: Database session

    Returns:
        AuthSuccessResponse with token and user profile

    Raises:
        401: Invalid credentials
        422: Validation error
    """
    # Find user by email
    statement = select(User).where(User.email == request.email)
    user = session.exec(statement).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Generate JWT token
    token = create_jwt_token(user.id)

    # Return response with nested user object
    return AuthSuccessResponse(
        token=token,
        user=UserProfile(
            id=user.id,
            email=user.email,
            created_at=user.created_at,
        ),
    )


@router.get("/me", response_model=UserProfile)
async def me(
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session),
):
    """
    Get the current authenticated user's profile.

    Args:
        authorization: Bearer token from Authorization header
        session: Database session

    Returns:
        UserProfile with id, email, and created_at

    Raises:
        401: Could not validate credentials
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    # Extract token from "Bearer <token>" format
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    token = parts[1]

    # Verify token and get user_id
    user_id = verify_jwt_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    # Find user in database
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    return UserProfile(
        id=user.id,
        email=user.email,
        created_at=user.created_at,
    )

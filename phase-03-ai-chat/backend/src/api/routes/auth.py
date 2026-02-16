"""Authentication endpoints: register, login, me, forgot-password, reset-password, change-password."""

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.api.deps import get_current_user, get_session
from src.auth.jwt import create_jwt_token
from src.models.user import User
from src.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["Auth"])


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class AuthResponse(BaseModel):
    token: str
    user: dict


class UserProfileResponse(BaseModel):
    id: str
    email: str
    created_at: str


class MessageResponse(BaseModel):
    message: str


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, session: AsyncSession = Depends(get_session)):
    """Register a new user with email and password."""
    # Check if email already exists
    result = await session.execute(select(User).where(User.email == body.email.lower()))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )

    # Hash password
    hashed = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt()).decode()
    user = User(email=body.email.lower(), hashed_password=hashed)
    session.add(user)
    await session.commit()
    await session.refresh(user)

    token = create_jwt_token(user.id)
    return {
        "token": token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "created_at": user.created_at.isoformat(),
        },
    }


@router.post("/login")
async def login(body: LoginRequest, session: AsyncSession = Depends(get_session)):
    """Authenticate user with email and password."""
    result = await session.execute(select(User).where(User.email == body.email.lower()))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    if not bcrypt.checkpw(body.password.encode(), user.hashed_password.encode()):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    token = create_jwt_token(user.id)
    return {
        "token": token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "created_at": user.created_at.isoformat(),
        },
    }


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "created_at": current_user.created_at.isoformat(),
    }


@router.post("/forgot-password")
async def forgot_password(
    body: ForgotPasswordRequest,
    session: AsyncSession = Depends(get_session)
):
    """Request a password reset."""
    frontend_url = "http://localhost:3000"

    await auth_service.request_password_reset(
        session, email=body.email.lower(), frontend_url=frontend_url
    )

    # Always return success message to prevent email enumeration
    return {"message": "If an account exists with this email, a reset link has been sent."}


@router.post("/reset-password")
async def reset_password(
    body: ResetPasswordRequest,
    session: AsyncSession = Depends(get_session)
):
    """Reset password using a reset token."""
    success = await auth_service.reset_password(
        session, token=body.token, new_password=body.new_password
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token."
        )

    return {"message": "Password has been reset successfully."}


@router.post("/change-password")
async def change_password(
    body: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Change password for authenticated user."""
    success = await auth_service.change_password(
        session,
        user_id=current_user.id,
        current_password=body.current_password,
        new_password=body.new_password,
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect."
        )

    return {"message": "Password changed successfully."}

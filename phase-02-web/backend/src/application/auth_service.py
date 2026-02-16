"""
Authentication service for password hashing and JWT token management.
"""
import bcrypt
import jwt
from datetime import datetime, timedelta
from uuid import UUID
from typing import Optional
from src.config import settings


def hash_password(password: str) -> str:
    """
    Hash a plain password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        Hashed password string
    """
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.

    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password from database

    Returns:
        True if password matches, False otherwise
    """
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


def create_jwt_token(user_id: UUID) -> str:
    """
    Generate a JWT token for authenticated user.

    Args:
        user_id: User's unique identifier

    Returns:
        JWT token string

    Token payload structure:
        {
            "sub": "user-uuid",
            "exp": expiration_timestamp,
            "iat": issued_at_timestamp
        }
    """
    now = datetime.utcnow()
    expiration = now + timedelta(hours=settings.JWT_EXPIRATION_HOURS)

    payload = {
        "sub": str(user_id),  # Subject: user identifier
        "exp": expiration,  # Expiration time
        "iat": now,  # Issued at time
    }

    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    return token


def verify_jwt_token(token: str) -> Optional[UUID]:
    """
    Verify and decode a JWT token.

    Args:
        token: JWT token string

    Returns:
        User ID (UUID) if token is valid, None otherwise

    Raises:
        jwt.ExpiredSignatureError: If token has expired
        jwt.InvalidTokenError: If token is invalid or tampered
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])

        user_id_str = payload.get("sub")
        if user_id_str is None:
            return None

        return UUID(user_id_str)

    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

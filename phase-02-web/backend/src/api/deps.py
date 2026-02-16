"""
FastAPI dependencies for authentication and database sessions.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from uuid import UUID
from src.application.auth_service import verify_jwt_token

# HTTP Bearer security scheme for JWT tokens
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UUID:
    """
    Dependency to extract and verify JWT token from Authorization header.

    Args:
        credentials: HTTP Bearer credentials from request header

    Returns:
        User ID (UUID) from verified JWT token

    Raises:
        HTTPException: 401 if token is missing, invalid, or expired
    """
    token = credentials.credentials

    user_id = verify_jwt_token(token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id

"""
FastAPI application for Phase II Web Todo Application.

Main application setup with CORS configuration and route registration.
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from src.api.routes import tasks
from src.api.models import ErrorCode


app = FastAPI(
    title="Todo Application API",
    description="Phase II REST API for task management",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Custom handler for Pydantic validation errors.

    Returns 422 for missing required fields or malformed JSON (structural errors).
    Returns 400 for value validation errors (empty strings, too long, etc.).
    """
    errors = exc.errors()
    if not errors:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "detail": "Invalid input data",
                "error_code": ErrorCode.INVALID_TASK_DATA.value,
                "status_code": status.HTTP_400_BAD_REQUEST
            }
        )

    first_error = errors[0]
    error_type = first_error.get("type", "")

    # Structural errors (missing fields, wrong types) → 422
    if error_type in ["missing", "json_invalid", "json_type"]:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": first_error.get("msg", "Validation error"),
                "error_code": "VALIDATION_ERROR",
                "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY
            }
        )

    # Value validation errors (string length, patterns, custom validators) → 400
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "detail": first_error.get("msg", "Invalid input data"),
            "error_code": ErrorCode.INVALID_TASK_DATA.value,
            "status_code": status.HTTP_400_BAD_REQUEST
        }
    )


# CORS configuration for local development
# Allows frontend to communicate with backend on different ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5500",  # VS Code Live Server
        "http://127.0.0.1:5500",
        "http://localhost:8080",  # Alternative frontend port
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Register routers
app.include_router(tasks.router)


@app.get("/", tags=["Health"])
async def root():
    """
    Health check endpoint.

    Returns basic API information and status.
    """
    return {
        "message": "Todo Application API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Detailed health check endpoint.

    Returns API health status.
    """
    return {
        "status": "healthy",
        "api": "operational"
    }

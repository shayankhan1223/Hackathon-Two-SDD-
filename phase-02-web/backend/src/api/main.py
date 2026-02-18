"""
FastAPI application for Multi-User Todo Application with Authentication & Database.

Main application setup with CORS configuration and route registration.
"""
import logging
import traceback
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from src.api.routes import auth, tasks
from src.config import settings

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Multi-User Todo Application API",
    description="REST API with JWT authentication and PostgreSQL persistence",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(tasks.router)


@app.on_event("startup")
async def on_startup():
    """Log startup event but defer database initialization."""
    logging.info("Application starting up...")
    # Defer database connection until it's actually needed
    # This prevents startup failures due to database connectivity issues


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled error: {exc}\n{traceback.format_exc()}")
    return JSONResponse(status_code=500, content={"detail": str(exc)})


@app.get("/", tags=["Health"])
async def root():
    """
    Health check endpoint.

    Returns basic API information and status.
    """
    return {
        "message": "Multi-User Todo Application API",
        "version": "2.0.0",
        "status": "running",
        "authentication": "JWT",
        "database": "PostgreSQL (Neon)",
    }


@app.get("/health", tags=["Health"])
async def health():
    """
    Detailed health check endpoint.

    Returns API health status.
    """
    return {"status": "healthy", "api": "operational", "database": "configured"}

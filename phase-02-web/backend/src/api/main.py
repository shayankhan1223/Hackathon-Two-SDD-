"""
FastAPI application for Multi-User Todo Application with Authentication & Database.

Main application setup with CORS configuration and route registration.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import auth, tasks
from src.config import settings

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
    return {"status": "healthy", "api": "operational", "database": "connected"}

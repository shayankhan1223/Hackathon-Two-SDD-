"""
Demo application for Hugging Face Space that bypasses database dependencies.
"""
import logging
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.INFO)

# Check if running in Hugging Face Space environment
def is_hf_space():
    return os.environ.get("SPACE_ID") is not None

app = FastAPI(
    title="Multi-User Todo Application API - Demo Mode",
    description="REST API with JWT authentication (Demo Mode - No Database)",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS configuration - use environment variables if available
cors_origins = ["https://hackathon-phase2-web.vercel.app", "http://localhost:3000", "https://hackathon-phase2-backend.hf.space"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    """Simple startup event that doesn't require database."""
    logging.info("Demo application starting up...")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled error: {exc}")
    return JSONResponse(status_code=500, content={"detail": str(exc)})

@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "message": "Multi-User Todo Application API - Demo Mode",
        "version": "2.0.0",
        "status": "running",
        "environment": "demo" if is_hf_space() else "production",
        "database": "mocked for demo",
    }

@app.get("/health", tags=["Health"])
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "api": "operational",
        "database": "mocked",
        "environment": "demo" if is_hf_space() else "production"
    }

# Simple endpoints that don't require database
@app.post("/health/test", tags=["Health"])
async def test_endpoint():
    """Simple test endpoint that doesn't require database."""
    return {"status": "ok", "message": "Test endpoint working"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
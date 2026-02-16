"""FastAPI application entry point."""

import logging
import traceback

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.INFO)

from src.api.routes.auth import router as auth_router
from src.api.routes.calendar import router as calendar_router
from src.api.routes.health import router as health_router
from src.api.routes.tags import router as tags_router
from src.api.routes.tasks import router as tasks_router
from src.api.routes.user import router as user_router
from src.agent.server import router as chat_router
from src.config import settings

app = FastAPI(title="Phase 3 - AI Chat-Driven Todo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(tags_router)
app.include_router(calendar_router)
app.include_router(chat_router)
app.include_router(user_router)


@app.on_event("startup")
async def on_startup():
    """Create any missing database tables on startup."""
    from src.database.session import create_all_tables
    await create_all_tables()
    logging.info("Database tables verified/created.")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled error: {exc}\n{traceback.format_exc()}")
    return JSONResponse(status_code=500, content={"detail": str(exc)})

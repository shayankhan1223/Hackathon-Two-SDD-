---
title: Phase 3 Backend API
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# Phase 3 Backend API

This is the backend API for the Phase 3 AI Chat-Driven Todo Application.

## Features
- User authentication and management
- Task management system
- AI chat integration
- Calendar sync
- Health check endpoint
- Secure API endpoints

## Endpoints
- `/health` - Health check
- `/auth/` - Authentication endpoints
- `/tasks/` - Task management endpoints
- `/chat/` - AI chat endpoints
- `/calendar/` - Calendar endpoints

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (requires valid Neon PostgreSQL database)
- `JWT_SECRET`: Secret key for JWT tokens
- `OPENROUTER_API_KEY`: API key for OpenRouter (for AI chat features)
- `API_HOST`: Host address (default: 0.0.0.0)
- `API_PORT`: Port number (default: 7860)
- `CORS_ORIGINS`: Allowed origins for CORS

## Setup Instructions
To run this application, you need to provide valid environment variables, especially a working PostgreSQL database connection string and OpenRouter API key.

# Development Startup Guide - Phase II Web Todo App

This guide explains how to run the full Phase II web application (backend + frontend).

## Prerequisites

1. **Backend Requirements**:
   - Python 3.13+
   - uv (Python package manager)
   - All backend dependencies installed

2. **Frontend Requirements**:
   - Node.js 18+ or 20+
   - npm (comes with Node.js)
   - All frontend dependencies installed

## Quick Start (Recommended)

Open **TWO** separate terminal windows:

### Terminal 1: Start Backend API

```bash
cd /home/shayan/Desktop/Hackathon-two/phase-02-web/backend
uv run uvicorn src.api.main:app --reload
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

The backend API will be available at: **http://localhost:8000**

API Documentation (Swagger): **http://localhost:8000/docs**

### Terminal 2: Start Frontend Next.js App

```bash
cd /home/shayan/Desktop/Hackathon-two/phase-02-web/frontend
npm run dev
```

Expected output:
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Starting...
 ✓ Ready in 2.5s
```

The frontend app will be available at: **http://localhost:3000**

## Step-by-Step First-Time Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd /home/shayan/Desktop/Hackathon-two/phase-02-web/backend
```

2. Install dependencies (if not already done):
```bash
uv sync
```

3. Run backend tests to verify:
```bash
uv run pytest tests/ -v
```

4. Start the backend server:
```bash
uv run uvicorn src.api.main:app --reload
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd /home/shayan/Desktop/Hackathon-two/phase-02-web/frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Verify environment variables:
```bash
cat .env.local
```

Should contain:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run TypeScript type checking:
```bash
npx tsc --noEmit
```

5. Start the frontend development server:
```bash
npm run dev
```

## Testing the Application

Once both servers are running:

1. Open your browser at: **http://localhost:3000**

2. Test the features:
   - ✅ **Create Task**: Fill in the form and click "Create Task"
   - ✅ **View Tasks**: See all tasks displayed in the list
   - ✅ **Complete Task**: Click the checkbox to toggle completion
   - ✅ **Edit Task**: Click "Edit" button to modify a task
   - ✅ **Delete Task**: Click "Delete" and confirm to remove a task

3. Verify API responses in backend terminal:
```
INFO:     127.0.0.1:xxxxx - "GET /tasks HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxxx - "POST /tasks HTTP/1.1" 201 Created
```

## Troubleshooting

### Backend Won't Start

**Error**: `ModuleNotFoundError` or `ImportError`
**Solution**:
```bash
cd backend
uv sync --all-extras
```

**Error**: `Address already in use` on port 8000
**Solution**:
```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9
# Or use a different port
uv run uvicorn src.api.main:app --reload --port 8001
```

### Frontend Won't Start

**Error**: `Module not found` or dependency errors
**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error**: `Port 3000 already in use`
**Solution**:
```bash
PORT=3001 npm run dev
```

**Error**: `Cannot connect to server` in browser
**Solution**: Verify backend is running at http://localhost:8000
```bash
curl http://localhost:8000/tasks
```

### CORS Errors in Browser Console

The backend already has CORS enabled for localhost:3000. If you see CORS errors:

1. Check backend CORS configuration in `backend/src/api/main.py`
2. Restart backend server
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

## Port Configuration

Default ports:
- **Backend API**: 8000
- **Frontend**: 3000

To change ports:

**Backend**:
```bash
uv run uvicorn src.api.main:app --reload --port 8080
```

**Frontend** (update `.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
PORT=3001 npm run dev
```

## Production Build

To test a production build:

```bash
cd frontend
npm run build
npm start
```

This will:
1. Build optimized production assets
2. Start Next.js production server on port 3000

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

You can test all API endpoints directly from the Swagger UI.

## Development Tips

1. **Hot Reload**: Both servers support hot reload
   - Backend: `--reload` flag enables auto-restart on file changes
   - Frontend: Next.js dev server auto-refreshes on file changes

2. **Console Logging**:
   - Backend logs appear in Terminal 1
   - Frontend logs appear in Terminal 2 and browser console

3. **Network Tab**: Use browser DevTools Network tab to inspect API calls

4. **React DevTools**: Install React DevTools extension for component inspection

## Stopping the Servers

To stop the servers:
- Press **Ctrl+C** in each terminal window

## Directory Structure Reference

```
phase-02-web/
├── backend/
│   ├── src/
│   │   ├── api/          # FastAPI routes and models
│   │   ├── application/  # Business logic (TaskService)
│   │   ├── domain/       # Core entities (Task)
│   │   └── infrastructure/ # InMemoryTaskRepository
│   ├── tests/            # Backend tests
│   └── pyproject.toml    # Python dependencies
│
└── frontend/
    ├── app/              # Next.js App Router pages
    ├── components/       # React components
    ├── hooks/            # Custom hooks (useTasks)
    ├── lib/              # API client and types
    └── package.json      # Node.js dependencies
```

## Next Steps

After verifying the application works:

1. Read the frontend README: `frontend/README.md`
2. Explore the API documentation: http://localhost:8000/docs
3. Review the component architecture in `frontend/components/`
4. Check TypeScript types in `frontend/lib/types.ts`

## Support

For issues or questions:
1. Check the backend README: `backend/README.md`
2. Check the frontend README: `frontend/README.md`
3. Review API documentation at `/docs`
4. Check backend tests in `backend/tests/`

Happy coding!

# Manual Testing Guide - Phase 02 Web MVP

Complete step-by-step guide to set up and test the multi-user todo application.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Python 3.11+ installed (`python3 --version`)
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ A Neon PostgreSQL account (free tier works)

---

## 🗄️ Step 1: Set Up Neon PostgreSQL Database

### 1.1 Create Neon Account
1. Go to https://neon.tech
2. Click "Sign Up" (free tier available)
3. Sign up with GitHub, Google, or email

### 1.2 Create a New Project
1. After logging in, click "Create a project"
2. Project name: `todo-app-mvp`
3. PostgreSQL version: 15 or 16 (default)
4. Region: Choose closest to you (e.g., US East)
5. Click "Create project"

### 1.3 Get Database Connection String
1. On your project dashboard, find the **Connection string**
2. Select "Parameters only" or copy the full connection string
3. It will look like:
   ```
   postgresql://username:password@ep-example-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```
4. **Keep this tab open** - you'll need it in the next step

**Example connection string:**
```
postgresql://todo_user:AbCd1234XyZ@ep-cool-morning-123456.us-east-2.aws.neon.tech/todo_db?sslmode=require
```

---

## ⚙️ Step 2: Configure Backend Environment

### 2.1 Navigate to Backend Directory
```bash
cd /home/shayan/Desktop/Hackathon-two/phase-02-web/backend
```

### 2.2 Create .env File
```bash
cp .env.example .env
```

### 2.3 Edit .env File
Open `.env` with your favorite editor:
```bash
nano .env
# or
code .env
# or
vim .env
```

### 2.4 Fill in the Values

**Replace these values:**

```bash
# DATABASE_URL - Paste your Neon connection string from Step 1.3
DATABASE_URL=postgresql://your-username:your-password@ep-your-endpoint.region.aws.neon.tech/your-database?sslmode=require

# JWT_SECRET - Generate a secure random string (at least 32 characters)
# Use this command to generate one:
#   python3 -c "import secrets; print(secrets.token_urlsafe(32))"
JWT_SECRET=your-generated-secret-key-here-min-32-chars

# Keep these as is (or customize if needed)
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENVIRONMENT=development
```

### 2.5 Generate JWT Secret (Quick Method)

Run this command to generate a secure JWT secret:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Example output:**
```
ZjY4NzE2YWQtMzM0YS00NThhLWJmNzUtYjQyOGY0ZjU2YWNl
```

Copy this and paste it as your `JWT_SECRET` value.

### ✅ Your .env Should Look Like This:

```bash
DATABASE_URL=postgresql://todo_user:AbCd1234XyZ@ep-cool-morning-123456.us-east-2.aws.neon.tech/todo_db?sslmode=require
JWT_SECRET=ZjY4NzE2YWQtMzM0YS00NThhLWJmNzUtYjQyOGY0ZjU2YWNl
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENVIRONMENT=development
```

---

## 🎨 Step 3: Configure Frontend Environment

### 3.1 Navigate to Frontend Directory
```bash
cd /home/shayan/Desktop/Hackathon-two/phase-02-web/frontend
```

### 3.2 Create .env.local File
```bash
cp .env.local.example .env.local
```

### 3.3 Edit .env.local File
```bash
nano .env.local
# or
code .env.local
```

### 3.4 Fill in the Values

```bash
# Backend API URL (default for local development)
NEXT_PUBLIC_API_URL=http://localhost:8000

# JWT Secret - MUST MATCH the JWT_SECRET from backend .env
# Copy the same value you used in Step 2.5
NEXT_PUBLIC_JWT_SECRET=ZjY4NzE2YWQtMzM0YS00NThhLWJmNzUtYjQyOGY0ZjU2YWNl
```

⚠️ **IMPORTANT:** The `NEXT_PUBLIC_JWT_SECRET` must be **exactly the same** as the `JWT_SECRET` in your backend `.env` file!

---

## 🚀 Step 4: Install Dependencies and Run Migrations

### 4.1 Backend Setup

```bash
cd /home/shayan/Desktop/Hackathon-two/phase-02-web/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Run database migrations (creates tables)
alembic upgrade head
```

**Expected output:**
```
INFO  [alembic.runtime.migration] Running upgrade -> 001, initial schema
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
```

### 4.2 Frontend Setup

Open a **new terminal** (keep backend terminal open):

```bash
cd /home/shayan/Desktop/Hackathon-two/phase-02-web/frontend

# Install dependencies
npm install
```

**Expected output:**
```
added 345 packages, and audited 346 packages in 15s
```

---

## 🏃 Step 5: Start the Servers

### 5.1 Start Backend Server

In the **backend terminal** (with venv activated):

```bash
cd /home/shayan/Desktop/Hackathon-two/phase-02-web/backend
source venv/bin/activate  # if not already activated
uvicorn src.api.main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

✅ Backend is running at: **http://localhost:8000**
✅ API docs available at: **http://localhost:8000/docs**

### 5.2 Start Frontend Server

In the **frontend terminal**:

```bash
cd /home/shayan/Desktop/Hackathon-two/phase-02-web/frontend
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.100:3000

 ✓ Ready in 2.5s
```

✅ Frontend is running at: **http://localhost:3000**

---

## 🧪 Step 6: Manual Testing

### 6.1 Verify Backend API (Optional)

Open your browser and go to: **http://localhost:8000/docs**

You should see the FastAPI Swagger documentation with all endpoints.

### 6.2 Test User Flow

Open your browser and go to: **http://localhost:3000**

#### Test 1: Sign Up (Create Account)

1. Click **"Sign Up"** or navigate to http://localhost:3000/sign-up
2. Enter test credentials:
   - Email: `alice@example.com`
   - Password: `password123`
3. Click **"Sign Up"**
4. ✅ Expected: Redirected to sign-in page with success message

#### Test 2: Sign In (Login)

1. Navigate to http://localhost:3000/sign-in (or click "Sign In")
2. Enter the same credentials:
   - Email: `alice@example.com`
   - Password: `password123`
3. Click **"Sign In"**
4. ✅ Expected: Redirected to task list page (http://localhost:3000/tasks)
5. ✅ Expected: Header shows "Sign Out" button

#### Test 3: Create a Task

1. From the task list page, click **"Create Task"** or navigate to http://localhost:3000/tasks/new
2. Fill in the form:
   - Title: `Buy groceries`
   - Description: `Milk, eggs, bread`
3. Click **"Create Task"**
4. ✅ Expected: Redirected to task list showing your new task

#### Test 4: View Task List

1. Navigate to http://localhost:3000/tasks
2. ✅ Expected: See "Buy groceries" task in the list
3. ✅ Expected: Task shows as "Not completed"

#### Test 5: Toggle Task Completion

1. On the task list, click the **checkbox** next to "Buy groceries"
2. ✅ Expected: Task shows as "Completed" with strikethrough
3. Click the checkbox again
4. ✅ Expected: Task shows as "Not completed" again

#### Test 6: Delete a Task

1. Click the **"Delete"** button on the task
2. ✅ Expected: Browser confirmation dialog appears
3. Click **"OK"** to confirm
4. ✅ Expected: Task disappears from the list

#### Test 7: Sign Out

1. Click **"Sign Out"** in the header
2. ✅ Expected: Redirected to sign-in page
3. ✅ Expected: Can no longer access http://localhost:3000/tasks (redirects to sign-in)

---

## 🔒 Step 7: Test User Isolation (Multi-User)

This tests that users can only see their own tasks.

### 7.1 Create Second User

1. Sign out if you're signed in
2. Navigate to http://localhost:3000/sign-up
3. Create a second account:
   - Email: `bob@example.com`
   - Password: `password456`
4. Sign in with Bob's credentials

### 7.2 Create Bob's Tasks

1. Create a task:
   - Title: `Bob's secret project`
   - Description: `This should only be visible to Bob`
2. ✅ Expected: Task appears in Bob's list

### 7.3 Verify Isolation

1. Sign out
2. Sign in as Alice (`alice@example.com`)
3. Navigate to task list
4. ✅ Expected: You should **NOT** see Bob's task
5. ✅ Expected: Only Alice's tasks are visible

### 7.4 Test URL Manipulation (Security)

1. While signed in as Alice, note the URL pattern:
   - Example: `http://localhost:3000/tasks`
2. Try to access Bob's tasks by guessing his user_id:
   - The API uses user_id from JWT, not URL
3. ✅ Expected: You can only see your own tasks (server validates)

---

## 📊 Step 8: Testing Checklist

Use this checklist to verify all features:

### Authentication
- [ ] Sign up with new email works
- [ ] Sign up with duplicate email shows error (409)
- [ ] Sign in with correct credentials works
- [ ] Sign in with wrong password shows error (401)
- [ ] Sign in with non-existent email shows error (401)
- [ ] Sign out works and redirects to sign-in
- [ ] Accessing protected routes while logged out redirects to sign-in

### Tasks
- [ ] Create task with title only works
- [ ] Create task with title and description works
- [ ] Create task with empty title shows validation error
- [ ] Task list shows only current user's tasks
- [ ] Toggle task completion works
- [ ] Delete task works with confirmation
- [ ] Empty task list shows "No tasks yet" message

### User Isolation
- [ ] User A cannot see User B's tasks
- [ ] User B cannot see User A's tasks
- [ ] Creating task automatically assigns to current user

### UI/UX
- [ ] Loading states show during API calls
- [ ] Error messages display clearly
- [ ] Success messages display after actions
- [ ] Forms have proper validation
- [ ] Mobile responsive (resize browser window)

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error: `alembic.util.exc.CommandError: Can't locate revision identified by '...'`**
- Solution: Delete `alembic/versions/*.py` and run `alembic revision --autogenerate -m "initial"` then `alembic upgrade head`

**Error: `psycopg2.OperationalError: could not connect to server`**
- Solution: Check your DATABASE_URL in `.env` is correct
- Verify Neon database is active (not paused)

**Error: `ModuleNotFoundError: No module named 'fastapi'`**
- Solution: Activate venv: `source venv/bin/activate`
- Then: `pip install -r requirements.txt`

### Frontend Won't Start

**Error: `Error: Cannot find module 'next'`**
- Solution: Run `npm install` in frontend directory

**Error: `EADDRINUSE: address already in use :::3000`**
- Solution: Kill process on port 3000: `lsof -ti:3000 | xargs kill -9`
- Or use different port: `npm run dev -- -p 3001`

### API Connection Issues

**Error: `Network Error` or `Failed to fetch`**
- Check backend is running: http://localhost:8000/docs should work
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local` matches backend URL
- Check CORS settings in backend `.env` include frontend URL

**Error: `401 Unauthorized`**
- Check JWT_SECRET matches in both backend and frontend .env files
- Try signing out and signing in again
- Clear browser localStorage: DevTools → Application → Local Storage → Clear

### Database Issues

**Error: `relation "users" does not exist`**
- Solution: Run migrations: `alembic upgrade head`

**Error: `JWT_SECRET is not set`**
- Solution: Check `.env` file has `JWT_SECRET` value
- Make sure you're in the right directory and `.env` exists

---

## 🎯 Expected Behavior Summary

| Action | Expected Result |
|--------|----------------|
| Sign up with new email | Account created, redirect to sign-in |
| Sign up with duplicate email | Error: "Email already exists" |
| Sign in with correct credentials | Redirect to task list |
| Sign in with wrong password | Error: "Invalid credentials" |
| Access /tasks while logged out | Redirect to sign-in |
| Create task | Task appears in list |
| Toggle completion | Task status updates |
| Delete task | Task removed from list |
| Sign out | Redirect to sign-in, cannot access tasks |
| User A views tasks | Only sees User A's tasks |

---

## 📝 Test Data Examples

Use these sample accounts and tasks for testing:

### Test Users
```
User 1:
- Email: alice@example.com
- Password: password123

User 2:
- Email: bob@example.com
- Password: password456

User 3:
- Email: charlie@test.com
- Password: testpass789
```

### Test Tasks
```
Task 1:
- Title: Complete project documentation
- Description: Write README and API docs

Task 2:
- Title: Review pull requests
- Description: Check PRs #123 and #124

Task 3:
- Title: Buy groceries
- Description: Milk, eggs, bread, coffee

Task 4:
- Title: Schedule team meeting
- Description: Monday 2pm - quarterly planning
```

---

## 📸 Screenshots (What You Should See)

### Sign Up Page
- Email input field
- Password input field
- "Sign Up" button
- Link to "Sign In" page

### Sign In Page
- Email input field
- Password input field
- "Sign In" button
- Link to "Sign Up" page

### Task List Page (Empty)
- Header with "Sign Out" button
- "No tasks yet" message
- "Create Task" button

### Task List Page (With Tasks)
- Header with "Sign Out" button
- List of task cards
- Each card shows: title, description, checkbox, delete button
- "Create Task" button

### Create Task Page
- Title input field
- Description textarea
- "Create Task" button
- "Cancel" link

---

## ✅ Success Criteria

You've successfully tested the MVP if:

1. ✅ You can create two different user accounts
2. ✅ Each user can sign in and sign out
3. ✅ Each user can create their own tasks
4. ✅ Each user can only see their own tasks
5. ✅ Tasks can be toggled complete/incomplete
6. ✅ Tasks can be deleted
7. ✅ Protected routes redirect to sign-in when not authenticated

---

## 🎉 Next Steps After Testing

Once testing is complete:

1. **Report any bugs** you find
2. **Document edge cases** you discover
3. **Consider implementing** User Stories 4-6:
   - Update tasks
   - Advanced filtering
   - Task search
4. **Add automated tests** (unit and integration)
5. **Deploy to production** (Vercel + Neon)

---

## 📞 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend logs in the terminal
3. Check browser DevTools console for frontend errors
4. Verify .env files have correct values
5. Ensure database migrations ran successfully

Happy testing! 🚀

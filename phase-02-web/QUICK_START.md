# 🚀 Quick Start - 5 Minutes to Running App

Follow these steps in order to get your app running.

---

## ⚡ 1. Generate JWT Secret (30 seconds)

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**📋 Copy the output** and save it somewhere - you'll need it twice!

Example: `ZjY4NzE2YWQtMzM0YS00NThhLWJmNzUtYjQyOGY0ZjU2YWNl`

---

## 🗄️ 2. Get Neon Database (2 minutes)

1. Go to https://neon.tech and sign up (free)
2. Click "Create a project" → Name it `todo-app-mvp`
3. Copy the connection string from the dashboard
4. Should look like: `postgresql://user:pass@ep-xxxxx.region.aws.neon.tech/db?sslmode=require`

---

## 🔧 3. Configure Backend (1 minute)

```bash
cd ~/Desktop/Hackathon-two/phase-02-web/backend
cp .env.example .env
nano .env  # or use: code .env
```

**Edit these two lines in .env:**
```bash
DATABASE_URL=postgresql://paste-your-neon-url-here
JWT_SECRET=paste-your-generated-secret-here
```

Save and exit (Ctrl+X, Y, Enter in nano)

---

## 🎨 4. Configure Frontend (30 seconds)

```bash
cd ~/Desktop/Hackathon-two/phase-02-web/frontend
cp .env.local.example .env.local
nano .env.local  # or use: code .env.local
```

**Edit this line in .env.local:**
```bash
NEXT_PUBLIC_JWT_SECRET=paste-the-same-secret-from-step-1
```

Keep `NEXT_PUBLIC_API_URL=http://localhost:8000` as is.

Save and exit.

---

## 🏗️ 5. Install & Start Backend (1 minute)

```bash
cd ~/Desktop/Hackathon-two/phase-02-web/backend

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create database tables
alembic upgrade head

# Start server
uvicorn src.api.main:app --reload
```

✅ **Backend running at:** http://localhost:8000

**Keep this terminal open!**

---

## 🌐 6. Install & Start Frontend (30 seconds)

Open a **NEW terminal** and run:

```bash
cd ~/Desktop/Hackathon-two/phase-02-web/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ **Frontend running at:** http://localhost:3000

**Keep this terminal open too!**

---

## 🎉 7. Test It!

Open your browser: http://localhost:3000

### First Test (1 minute):
1. Click "Sign Up"
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Click "Sign Up"
5. Sign in with same credentials
6. Create a task!

---

## 📊 Summary

You should have:
- ✅ **2 terminals running:**
  - Terminal 1: Backend (port 8000)
  - Terminal 2: Frontend (port 3000)
- ✅ **2 browser tabs open:**
  - http://localhost:3000 (frontend app)
  - http://localhost:8000/docs (API docs)

---

## 🐛 Something Wrong?

### Backend won't start?
```bash
# Make sure you're in the right directory
cd ~/Desktop/Hackathon-two/phase-02-web/backend

# Check .env file exists and has values
cat .env

# Activate venv if not activated
source venv/bin/activate

# Try running migrations again
alembic upgrade head
```

### Frontend won't start?
```bash
# Make sure you're in the right directory
cd ~/Desktop/Hackathon-two/phase-02-web/frontend

# Check .env.local exists
cat .env.local

# Try installing again
rm -rf node_modules package-lock.json
npm install
```

### Can't connect to database?
- Check your DATABASE_URL is correct in `backend/.env`
- Verify your Neon database is active (not paused)
- Make sure URL ends with `?sslmode=require`

### JWT errors?
- Make sure JWT_SECRET is the **same** in both:
  - `backend/.env` (JWT_SECRET)
  - `frontend/.env.local` (NEXT_PUBLIC_JWT_SECRET)

---

## 📖 Full Documentation

For complete testing instructions, see:
- **MANUAL_TESTING_GUIDE.md** - Complete testing guide
- **ENV_SETUP_QUICK_REFERENCE.md** - Environment variable reference
- **MVP_IMPLEMENTATION_COMPLETE.md** - Full feature documentation

---

## 🎯 What You Can Do

Once running, you can:
- ✅ Sign up / Sign in / Sign out
- ✅ Create tasks
- ✅ View your task list
- ✅ Toggle task completion
- ✅ Delete tasks
- ✅ Test with multiple users (each sees only their tasks)

---

That's it! You're ready to go! 🚀

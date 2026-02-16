# Environment Setup Quick Reference

Quick copy-paste guide for setting up your environment variables.

---

## 🔑 Step 1: Generate JWT Secret

Run this command:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Copy the output** - you'll use it in both backend and frontend!

Example output: `ZjY4NzE2YWQtMzM0YS00NThhLWJmNzUtYjQyOGY0ZjU2YWNl`

---

## 🗄️ Step 2: Get Neon Database URL

1. Sign up at https://neon.tech (free)
2. Create a project: `todo-app-mvp`
3. Copy the connection string (looks like this):

```
postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
```

---

## 🔧 Step 3: Backend .env File

**Location:** `phase-02-web/backend/.env`

```bash
# Paste your Neon connection string here
DATABASE_URL=postgresql://your-user:your-pass@ep-your-endpoint.us-east-2.aws.neon.tech/your-db?sslmode=require

# Paste your generated JWT secret here (from Step 1)
JWT_SECRET=your-generated-secret-from-step-1

# Keep these defaults
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENVIRONMENT=development
```

---

## 🎨 Step 4: Frontend .env.local File

**Location:** `phase-02-web/frontend/.env.local`

```bash
# Backend API URL (default for local dev)
NEXT_PUBLIC_API_URL=http://localhost:8000

# MUST BE THE SAME as backend JWT_SECRET (from Step 1)
NEXT_PUBLIC_JWT_SECRET=your-generated-secret-from-step-1
```

---

## ✅ Verification Checklist

- [ ] Generated JWT secret with Python command
- [ ] Created Neon database and copied connection string
- [ ] Created `backend/.env` with DATABASE_URL and JWT_SECRET
- [ ] Created `frontend/.env.local` with NEXT_PUBLIC_API_URL and NEXT_PUBLIC_JWT_SECRET
- [ ] **JWT secrets match** in both files

---

## 📋 Complete Example

### Generated JWT Secret
```
ZjY4NzE2YWQtMzM0YS00NThhLWJmNzUtYjQyOGY0ZjU2YWNl
```

### Neon Database URL
```
postgresql://shayan_user:mySecretPass123@ep-cool-morning-123456.us-east-2.aws.neon.tech/todo_db?sslmode=require
```

### Backend .env
```bash
DATABASE_URL=postgresql://shayan_user:mySecretPass123@ep-cool-morning-123456.us-east-2.aws.neon.tech/todo_db?sslmode=require
JWT_SECRET=ZjY4NzE2YWQtMzM0YS00NThhLWJmNzUtYjQyOGY0ZjU2YWNl
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENVIRONMENT=development
```

### Frontend .env.local
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_JWT_SECRET=ZjY4NzE2YWQtMzM0YS00NThhLWJmNzUtYjQyOGY0ZjU2YWNl
```

---

## 🚀 Quick Start Commands

After setting up .env files:

### Backend
```bash
cd phase-02-web/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn src.api.main:app --reload
```

### Frontend (in new terminal)
```bash
cd phase-02-web/frontend
npm install
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## ⚠️ Common Mistakes

1. ❌ **JWT secrets don't match** between backend and frontend
   - ✅ Use the same value in both files

2. ❌ **Forgot to add `?sslmode=require`** to DATABASE_URL
   - ✅ Neon requires SSL: `...?sslmode=require`

3. ❌ **Frontend can't connect to backend**
   - ✅ Check backend is running: http://localhost:8000/docs
   - ✅ Check NEXT_PUBLIC_API_URL is `http://localhost:8000`

4. ❌ **Database tables don't exist**
   - ✅ Run: `alembic upgrade head`

---

That's it! See `MANUAL_TESTING_GUIDE.md` for complete testing instructions.

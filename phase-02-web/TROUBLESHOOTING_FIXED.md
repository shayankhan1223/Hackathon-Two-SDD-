# Troubleshooting - Dependency Issues Fixed ✅

## Issue 1: Pytest Version Conflict

**Error:**
```
ERROR: Cannot install -r requirements.txt (line 21) and pytest==8.0.0 because these package versions have conflicting dependencies.

The conflict is caused by:
    The user requested pytest==8.0.0
    pytest-asyncio 0.23.4 depends on pytest<8 and >=7.0.0
```

**Cause:**
- pytest-asyncio 0.23.4 requires pytest < 8.0
- requirements.txt had pytest==8.0.0

**Solution Applied:**
Changed `requirements.txt` line 20 from:
```python
pytest==8.0.0
```
to:
```python
pytest==7.4.4
```

✅ **Status:** FIXED - Dependencies now install correctly

---

## Issue 2: psycopg2 Module Not Found

**Error:**
```
ModuleNotFoundError: No module named 'psycopg2'
```

**Cause:**
- psycopg2-binary was in requirements.txt but not installed due to Issue 1

**Solution:**
- After fixing pytest version, reinstalled all dependencies
- psycopg2-binary==2.9.9 installed successfully

✅ **Status:** FIXED - Database driver now available

---

## ✅ Verification

After fixes, the following commands work correctly:

```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies (all successful)
pip install -r requirements.txt

# Run migrations (successful)
alembic upgrade head
```

Expected output from migrations:
```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
```

---

## 🚀 You're Ready to Go!

Your backend is now properly set up. Start the server:

```bash
cd ~/Desktop/Hackathon-two/phase-02-web/backend
source venv/bin/activate
uvicorn src.api.main:app --reload
```

Backend will be available at: http://localhost:8000

---

## Updated Quick Commands

Here's the working sequence:

```bash
# 1. Backend setup
cd ~/Desktop/Hackathon-two/phase-02-web/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn src.api.main:app --reload
```

All commands should now work without errors! 🎉

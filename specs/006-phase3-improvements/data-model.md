# Data Model: Phase III Improvements

**Feature**: 006-phase3-improvements
**Date**: 2026-02-16

## Existing Entities (unchanged)

### User
- `id`: UUID (primary key)
- `email`: string (unique, required)
- `hashed_password`: string (required)
- `created_at`: datetime
- `updated_at`: datetime

### Task
- `id`: UUID (primary key)
- `user_id`: UUID (FK → User)
- `title`: string (required)
- `description`: string (optional)
- `due_date`: date (required, YYYY-MM-DD)
- `priority`: enum (high, medium, low)
- `status`: enum (pending, completed)
- `created_at`: datetime
- `updated_at`: datetime

### ChatMessage
- `id`: UUID (primary key)
- `user_id`: UUID (FK → User)
- `role`: enum (user, assistant)
- `content`: text
- `created_at`: datetime

---

## New Entities

### UserPreferences

One-to-one relationship with User. Created on first settings save or on user registration (with defaults).

| Field                | Type        | Default    | Constraints              |
| -------------------- | ----------- | ---------- | ------------------------ |
| `id`                 | UUID        | auto       | Primary key              |
| `user_id`            | UUID        | —          | FK → User, unique        |
| `display_name`       | varchar(100)| null       | Optional                 |
| `timezone`           | varchar(50) | "UTC"      | IANA timezone format     |
| `theme`              | varchar(10) | "system"   | Values: light/dark/system|
| `email_notifications`| boolean     | true       |                          |
| `push_notifications` | boolean     | true       |                          |
| `created_at`         | datetime    | now()      |                          |
| `updated_at`         | datetime    | now()      | Auto-updated on change   |

**Relationships**: UserPreferences.user_id → User.id (one-to-one)

**Validation Rules**:
- `timezone` must be a valid IANA timezone string
- `theme` must be one of: "light", "dark", "system"
- `display_name` max length 100 characters

---

### PasswordResetToken

Stores hashed password reset tokens with expiration and single-use tracking.

| Field          | Type        | Default    | Constraints              |
| -------------- | ----------- | ---------- | ------------------------ |
| `id`           | UUID        | auto       | Primary key              |
| `user_id`      | UUID        | —          | FK → User                |
| `token_hash`   | varchar(64) | —          | SHA-256 hash of raw token|
| `expires_at`   | datetime    | —          | now() + 1 hour           |
| `used`         | boolean     | false      |                          |
| `created_at`   | datetime    | now()      |                          |

**Relationships**: PasswordResetToken.user_id → User.id (many-to-one; a user can have multiple tokens, but only the most recent unused one is valid)

**Validation Rules**:
- Token is valid only if: `used == false` AND `expires_at > now()`
- On successful password reset, `used` is set to `true`
- Old unused tokens for the same user should be invalidated on new token creation

**State Transitions**:
```
Created (used=false, not expired)
  ├── Used → used=true (terminal)
  └── Expired → expires_at < now() (terminal)
```

---

## Schema Migration Summary

### New Tables
1. `user_preferences` — User settings persistence
2. `password_reset_tokens` — Password reset flow

### Existing Table Changes
None. All existing tables remain unchanged.

### Migration Order
1. Create `user_preferences` table (no dependencies beyond `users`)
2. Create `password_reset_tokens` table (no dependencies beyond `users`)

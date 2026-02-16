# Todo App Frontend - Multi-User Task Management

A modern, production-ready frontend for a multi-user todo application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Implemented (MVP - User Stories 1-3)

- **User Authentication**
  - Sign up with email and password
  - Sign in with credential validation
  - JWT token management with automatic API integration
  - Persistent authentication (tokens stored in localStorage)
  - Automatic redirect to sign-in on token expiration

- **View Tasks**
  - View personal task list
  - User isolation (only see your own tasks)
  - Empty state with friendly message
  - Task completion status visualization
  - Responsive design for mobile and desktop

- **Create Tasks**
  - Create new tasks with title and description
  - Client-side validation (title required, max lengths)
  - Real-time character count
  - Success feedback and automatic redirect
  - Error handling with helpful messages

- **Task Management**
  - Toggle task completion with optimistic updates
  - Delete tasks with confirmation
  - Real-time task count display
  - Formatted dates and timestamps

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.4+ (strict mode)
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios with JWT interceptor
- **Validation**: Zod for schema validation
- **State Management**: React hooks
- **Authentication**: JWT tokens (localStorage)

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-up/
│   │   │   │   └── page.tsx        # Sign-up page
│   │   │   └── sign-in/
│   │   │       └── page.tsx        # Sign-in page
│   │   ├── tasks/
│   │   │   ├── page.tsx            # Task list page
│   │   │   └── new/
│   │   │       └── page.tsx        # Create task page
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page (redirects)
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── Header.tsx              # App header with sign-out
│   │   ├── TaskCard.tsx            # Individual task card
│   │   ├── TaskList.tsx            # Task list with empty state
│   │   ├── TaskForm.tsx            # Reusable task form
│   │   └── LoadingSpinner.tsx      # Loading indicator
│   └── lib/
│       ├── api-client.ts           # Axios instance with JWT
│       ├── auth.ts                 # Auth utilities
│       ├── types.ts                # TypeScript types
│       └── validation.ts           # Zod schemas
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── .env.local.example
```

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or pnpm
- Backend API running on http://localhost:8000 (see `../backend/README.md`)

### Installation

1. **Install dependencies:**

```bash
cd phase-02-web/frontend
npm install
```

2. **Configure environment variables:**

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_JWT_SECRET=your-32-char-secret-key
```

**Important**: `NEXT_PUBLIC_JWT_SECRET` must match the `JWT_SECRET` in your backend `.env` file.

3. **Start the development server:**

```bash
npm run dev
```

The app will be available at http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes | `http://localhost:8000` |
| `NEXT_PUBLIC_JWT_SECRET` | JWT secret (must match backend) | Yes | - |

## Usage

### Authentication Flow

1. **Sign Up**
   - Navigate to http://localhost:3000
   - Click "Sign up" or go to `/sign-up`
   - Enter email and password (min 8 characters)
   - Automatically signed in and redirected to tasks

2. **Sign In**
   - Navigate to http://localhost:3000 or `/sign-in`
   - Enter your credentials
   - Redirected to your personal task list

3. **Sign Out**
   - Click "Sign Out" in the header
   - Token is cleared and you're redirected to sign-in

### Task Management

1. **View Tasks**
   - After signing in, view your task list at `/tasks`
   - Empty state shown if no tasks exist
   - Tasks show title, description, completion status, and date

2. **Create Task**
   - Click "New Task" button
   - Fill in title (required) and description (optional)
   - Click "Create Task"
   - Redirected back to task list with new task visible

3. **Complete/Uncomplete Task**
   - Click the checkbox next to any task
   - Status updates immediately (optimistic update)
   - Changes persist across page refreshes

4. **Delete Task**
   - Click the trash icon on any task
   - Confirm deletion in browser dialog
   - Task removed immediately

## API Integration

The frontend communicates with the backend API using Axios with automatic JWT token attachment.

### API Endpoints Used

- `POST /api/auth/sign-up` - Create new user account
- `POST /api/auth/sign-in` - Authenticate user
- `GET /api/{user_id}/tasks` - List user's tasks
- `POST /api/{user_id}/tasks` - Create new task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task (including toggle completion)
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task

### Error Handling

- **401 Unauthorized**: Token expired or invalid - automatic redirect to sign-in
- **403 Forbidden**: User ID mismatch - access denied
- **409 Conflict**: Email already registered during sign-up
- **400 Validation Error**: Invalid input data
- **Network Errors**: Friendly error messages displayed

## Design System

### Color Palette

- **Primary**: Blue (#3B82F6) - Buttons, links, accents
- **Success**: Green (#10B981) - Completed tasks, success messages
- **Error**: Red (#EF4444) - Error messages, delete actions
- **Neutral**: Gray scale - Text, backgrounds, borders

### Components

All components follow:
- Mobile-first responsive design
- Accessibility best practices
- TypeScript strict typing
- Reusable and composable patterns

### Tailwind CSS Utilities

Custom utility classes defined in `globals.css`:
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.input`, `.input-error`
- `.card`
- `.form-group`, `.form-label`, `.form-error`

## Development

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Type Safety

- Strict TypeScript mode enabled
- No `any` types allowed
- All API responses typed
- Zod validation for forms

### Code Quality

- ESLint with Next.js recommended config
- TypeScript strict mode
- Consistent component structure
- Error boundaries and loading states

## Architecture Decisions

### Why Next.js App Router?

- Server Components by default (better performance)
- Improved routing with file-system based structure
- Better TypeScript integration
- Modern React patterns

### Why localStorage for JWT?

- Simple implementation for MVP
- Works across page refreshes
- No server-side session management needed
- Can be upgraded to httpOnly cookies later

### Why Zod for Validation?

- Type-safe schema validation
- Excellent TypeScript integration
- Runtime validation + compile-time types
- Better error messages than manual validation

## Troubleshooting

### Issue: "Network error" on all API calls

**Solution**: Ensure backend is running on http://localhost:8000 and `NEXT_PUBLIC_API_URL` is correct.

### Issue: Authentication not persisting

**Solution**: Check browser console for localStorage errors. Clear localStorage and sign in again.

### Issue: CORS errors

**Solution**: Backend must have `CORS_ORIGINS=http://localhost:3000` in `.env` file.

### Issue: 401 errors after successful sign-in

**Solution**: Ensure `NEXT_PUBLIC_JWT_SECRET` matches backend `JWT_SECRET` exactly.

## Future Enhancements (Not in MVP)

- [ ] Edit task functionality (User Story 4)
- [ ] Task detail page
- [ ] Filtering (completed/incomplete)
- [ ] Sorting options
- [ ] Search functionality
- [ ] Password reset flow
- [ ] User profile page
- [ ] Task due dates
- [ ] Task categories/tags
- [ ] Dark mode

## Contributing

This project follows the Spec-Driven Development (SDD) methodology. See `specs/003-web-auth-db/` for specifications, architecture decisions, and tasks.

## License

MIT

## Support

For issues or questions, please refer to the specification documents in `specs/003-web-auth-db/`.

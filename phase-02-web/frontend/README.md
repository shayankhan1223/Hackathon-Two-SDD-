# Todo Application Frontend - Next.js 15

A modern, production-ready todo application frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Strict type checking
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Hooks** - Clean state management with `useTasks`

## Features

- ✅ Create new tasks with title and description
- ✅ View all tasks in a clean, organized list
- ✅ Toggle task completion status
- ✅ Edit existing tasks via modal
- ✅ Delete tasks with confirmation
- ✅ Real-time validation and error handling
- ✅ Loading states and skeleton screens
- ✅ Responsive design (mobile-friendly)
- ✅ Beautiful Tailwind CSS styling

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Main page (task list + form)
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Tailwind CSS imports
├── components/
│   ├── TaskForm.tsx          # Create task form
│   ├── TaskList.tsx          # Task list container
│   ├── TaskItem.tsx          # Individual task card
│   ├── TaskEditModal.tsx     # Edit task modal
│   └── DeleteConfirmModal.tsx # Delete confirmation modal
├── lib/
│   ├── api.ts                # API client (typed)
│   └── types.ts              # TypeScript interfaces
├── hooks/
│   └── useTasks.ts           # Custom hook for task state
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- Backend API running at `http://localhost:8000` (FastAPI)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file (already created):

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development

1. Start the backend API first (in another terminal):

```bash
cd ../backend
uv run uvicorn src.api.main:app --reload
```

2. Start the Next.js development server:

```bash
npm run dev
```

3. Open your browser at [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
npm start
```

## TypeScript Types

All API interactions are fully typed:

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface CreateTaskRequest {
  title: string;
  description: string;
}

interface UpdateTaskRequest {
  title?: string;
  description?: string;
}
```

## API Client

The `apiClient` provides typed methods for all backend operations:

- `createTask(data)` - Create new task
- `getTasks()` - Fetch all tasks
- `getTask(id)` - Get single task
- `updateTask(id, data)` - Update task
- `deleteTask(id)` - Delete task
- `toggleTaskCompletion(id)` - Toggle completion status

## Custom Hooks

### `useTasks()`

Provides complete task management functionality:

```typescript
const {
  tasks,           // Array of tasks
  loading,         // Loading state
  error,           // Error message
  createTask,      // Create task function
  updateTask,      // Update task function
  deleteTask,      // Delete task function
  toggleTaskCompletion, // Toggle completion function
  refetch          // Manually refetch tasks
} = useTasks();
```

## Component Architecture

### Server vs Client Components

- **Server Components**: `layout.tsx` (default)
- **Client Components**: All interactive components marked with `'use client'`

### Component Hierarchy

```
page.tsx (Client Component)
├── TaskForm
├── TaskList
│   └── TaskItem (multiple)
├── TaskEditModal
└── DeleteConfirmModal
```

## Styling Guidelines

All styling uses Tailwind CSS utility classes:

- **Primary Color**: Blue (blue-600, blue-700)
- **Success**: Green (green-500, green-100)
- **Danger**: Red (red-600, red-700)
- **Completed Tasks**: Gray with line-through
- **Shadows**: Medium shadows for cards
- **Rounded Corners**: Medium rounding (rounded-lg, rounded-md)

## Error Handling

- Network errors display friendly messages
- Validation errors show inline on forms
- API errors are caught and displayed to users
- Loading states prevent double submissions

## Performance Features

- Optimistic UI updates
- Skeleton loading screens
- Debounced input validation
- Efficient re-renders with proper memoization

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: http://localhost:8000)

## Code Quality

- ✅ Strict TypeScript mode enabled
- ✅ ESLint configured with Next.js rules
- ✅ All props and functions properly typed
- ✅ Clean component separation (container vs presentational)
- ✅ No business logic in components (delegated to hooks)

## Browser Support

Modern browsers supporting:
- ES2020+
- CSS Grid and Flexbox
- Fetch API
- Async/await

## Troubleshooting

### Backend Connection Issues

If you see "Cannot connect to server":
1. Verify backend is running at http://localhost:8000
2. Check CORS configuration in backend
3. Ensure `.env.local` has correct API URL

### Port Already in Use

If port 3000 is taken:
```bash
PORT=3001 npm run dev
```

### TypeScript Errors

Run type checking:
```bash
npx tsc --noEmit
```

## Future Enhancements (Phase III+)

- Authentication and user management
- Database persistence
- Real-time updates with WebSockets
- Task categories and tags
- Due dates and reminders
- Dark mode support
- Keyboard shortcuts
- Drag-and-drop reordering

## License

Part of the Hackathon II - Spec-Driven Todo System

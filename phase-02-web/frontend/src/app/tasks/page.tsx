'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tasksAPI } from '@/lib/api-client';
import { getUserId, isAuthenticated } from '@/lib/auth';
import type { Task } from '@/lib/types';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/sign-in');
      return;
    }

    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadTasks = async () => {
    const userId = getUserId();
    if (!userId) {
      router.push('/sign-in');
      return;
    }

    try {
      setError('');
      const response = await tasksAPI.listTasks(userId);
      setTasks(response.tasks);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    const userId = getUserId();
    if (!userId) return;

    // Find the task to get current completion state
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      await tasksAPI.toggleComplete(userId, taskId, task.completed);
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      );
      console.error('Error toggling task:', err);
    }
  };

  const handleEdit = (taskId: string) => {
    router.push(`/tasks/${taskId}/edit`);
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    const userId = getUserId();
    if (!userId) return;

    // Optimistic update
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    try {
      await tasksAPI.deleteTask(userId, taskId);
    } catch (err) {
      // Reload on error
      loadTasks();
      console.error('Error deleting task:', err);
    }
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="mt-1 text-sm text-gray-500">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
            </p>
          </div>
          <Link
            href="/tasks/new"
            className="btn-primary inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Task
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-error-light border border-error text-error px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { tasksAPI } from '@/lib/api-client';
import { getUserId, isAuthenticated } from '@/lib/auth';
import type { CreateTaskFormData } from '@/lib/validation';
import Header from '@/components/Header';
import TaskForm from '@/components/TaskForm';

export default function NewTaskPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/sign-in');
    }
  }, [router]);

  const handleSubmit = async (data: CreateTaskFormData) => {
    const userId = getUserId();
    if (!userId) {
      router.push('/sign-in');
      return;
    }

    try {
      setError('');
      await tasksAPI.createTask(userId, data);
      router.push('/tasks');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { detail?: string } } };
        setError(axiosError.response?.data?.detail || 'Failed to create task. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
      throw err; // Re-throw to keep loading state in form
    }
  };

  const handleCancel = () => {
    router.push('/tasks');
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add a new task to your list
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 bg-error-light border border-error text-error px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <TaskForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Create Task"
          />
        </div>
      </main>
    </div>
  );
}

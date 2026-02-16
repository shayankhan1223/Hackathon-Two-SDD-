'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { tasksAPI } from '@/lib/api-client';
import { getUserId, isAuthenticated } from '@/lib/auth';
import type { Task } from '@/lib/types';
import type { CreateTaskFormData } from '@/lib/validation';
import Header from '@/components/Header';
import TaskForm from '@/components/TaskForm';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/sign-in');
      return;
    }

    loadTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, taskId]);

  const loadTask = async () => {
    const userId = getUserId();
    if (!userId) {
      router.push('/sign-in');
      return;
    }

    try {
      setError('');
      const taskData = await tasksAPI.getTask(userId, taskId);
      setTask(taskData);
    } catch {
      setError('Failed to load task. It may not exist or you may not have access.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateTaskFormData) => {
    const userId = getUserId();
    if (!userId) {
      router.push('/sign-in');
      return;
    }

    try {
      setError('');
      await tasksAPI.updateTask(userId, taskId, data);
      router.push('/tasks');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { detail?: string } } };
        setError(axiosError.response?.data?.detail || 'Failed to update task. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
      throw err;
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update your task details
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 bg-error-light border border-error text-error px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : task ? (
            <TaskForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={{ title: task.title, description: task.description }}
              submitLabel="Update Task"
            />
          ) : (
            <p className="text-gray-500 text-center py-8">Task not found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/lib/types';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import TaskEditModal from '@/components/TaskEditModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function Home() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
            Todo Application
          </h1>
          <p className="text-center text-gray-600">
            Manage your tasks efficiently with a modern interface
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <TaskForm onSubmit={createTask} />

        <TaskList
          tasks={tasks}
          loading={loading}
          onToggleComplete={toggleTaskCompletion}
          onEdit={setEditingTask}
          onDelete={setDeletingTask}
        />

        <TaskEditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={updateTask}
        />

        <DeleteConfirmModal
          task={deletingTask}
          onClose={() => setDeletingTask(null)}
          onConfirm={deleteTask}
        />
      </div>

      <footer className="py-6 text-center text-gray-600 text-sm">
        <p>Built with Next.js 15, TypeScript, and Tailwind CSS</p>
      </footer>
    </div>
  );
}

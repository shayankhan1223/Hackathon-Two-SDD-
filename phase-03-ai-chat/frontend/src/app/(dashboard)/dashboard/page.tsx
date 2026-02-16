'use client';

import { useState, useCallback } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { PrimaryTaskPanel } from '@/components/dashboard/PrimaryTaskPanel';
import { SecondaryContextPanel } from '@/components/dashboard/SecondaryContextPanel';
import { QuickAddInput } from '@/components/dashboard/QuickAddInput';
import { useTasks } from '@/hooks/useTasks';
import { getUserEmail } from '@/lib/auth';

export default function DashboardPage() {
  const { tasks, loading, error, createTask, toggleTaskCompletion, deleteTask, getTaskStats, refetch } = useTasks();
  const [showAddInput, setShowAddInput] = useState(false);
  const userEmail = typeof window !== 'undefined' ? getUserEmail() : null;

  const today = new Date().toISOString().split('T')[0];
  const baseStats = getTaskStats();
  const overdue = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length;
  const stats = {
    total: baseStats.total,
    completed: baseStats.completed,
    pending: baseStats.pending,
    overdue,
  };

  const handleAddTask = useCallback(async (title: string) => {
    try {
      await createTask({ title, priority: 'medium' });
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  }, [createTask]);

  const handleToggleComplete = useCallback(async (id: string) => {
    try {
      await toggleTaskCompletion(id);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  }, [toggleTaskCompletion]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteTask(id);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  }, [deleteTask]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={refetch} className="text-blue-600 hover:text-blue-700">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        userName={userEmail ?? undefined}
        onAddTask={() => setShowAddInput(!showAddInput)}
      />

      {showAddInput && (
        <QuickAddInput
          onAddTask={(title) => { handleAddTask(title); setShowAddInput(false); }}
          existingTitles={tasks.map(t => t.title)}
        />
      )}

      <SummaryCards stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <PrimaryTaskPanel
            tasks={tasks}
            loading={loading}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
          />
        </div>
        <div className="lg:col-span-5">
          <SecondaryContextPanel tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

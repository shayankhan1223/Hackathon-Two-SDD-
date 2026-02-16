import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { TaskResponse } from '@/lib/types';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.tasks.list();

      // Transform the response to match the Task interface
      const transformedTasks: Task[] = res.tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description ?? undefined,
        completed: task.status === 'completed',
        priority: task.priority as 'high' | 'medium' | 'low',
        dueDate: task.due_date,
        tags: task.tags?.map((t: { name: string }) => t.name) ?? [],
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      }));

      setTasks(transformedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => {
    try {
      setLoading(true);
      setError(null);

      await api.tasks.create({
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.dueDate ?? new Date().toISOString().split('T')[0],
        priority: taskData.priority,
      });

      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setLoading(true);
      setError(null);

      await api.tasks.update(id, updates);

      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      setLoading(true);
      setError(null);

      await api.tasks.update(id, { status: task.completed ? 'pending' : 'completed' });

      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await api.tasks.delete(id);

      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const today = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length;

    return {
      total,
      completed,
      pending,
      highPriority,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    getTaskStats,
    refetch: loadTasks,
  };
}

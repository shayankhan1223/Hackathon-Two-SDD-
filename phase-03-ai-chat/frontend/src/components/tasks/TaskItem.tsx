'use client';

import { TaskCard } from './TaskCard';
import { api } from '@/lib/api';
import type { TaskResponse } from '@/lib/types';

interface TaskItemProps {
  task: TaskResponse;
  onChanged?: () => void;
}

export default function TaskItem({ task, onChanged }: TaskItemProps) {
  const convertedTask = {
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    completed: task.status === 'completed',
    priority: task.priority as 'high' | 'medium' | 'low',
    dueDate: task.due_date,
    tags: task.tags?.map(tag => tag.name) || [],
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  };

  const handleToggleComplete = async () => {
    try {
      await api.tasks.complete(task.id);
      onChanged?.();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.tasks.delete(task.id);
        onChanged?.();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <TaskCard
      task={convertedTask}
      onToggleComplete={handleToggleComplete}
      onDelete={handleDelete}
      onEdit={() => {
        // TODO: Implement edit functionality
        console.log('Edit task:', task.id);
      }}
    />
  );
}

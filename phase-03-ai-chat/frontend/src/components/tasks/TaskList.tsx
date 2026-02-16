'use client';

import { Task, TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  isLoading = false,
  emptyState,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return emptyState || (
      <div className="text-center py-12">
        <p className="text-gray-500">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
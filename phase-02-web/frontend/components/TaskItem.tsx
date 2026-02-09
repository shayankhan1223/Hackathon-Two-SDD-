'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => Promise<Task>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggleComplete(task.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 mb-4 border-l-4 ${
      task.completed ? 'border-green-500' : 'border-blue-500'
    }`}>
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          disabled={loading}
          className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${
            task.completed ? 'line-through text-gray-400' : 'text-gray-800'
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-2 text-sm ${
              task.completed ? 'line-through text-gray-300' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${
              task.completed
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {task.completed ? 'Completed' : 'Incomplete'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task)}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

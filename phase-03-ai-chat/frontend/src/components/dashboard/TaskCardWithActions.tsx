'use client';

import { CheckCircle, Circle, Pencil, Trash2, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

interface TaskCardWithActionsProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const priorityVariant: Record<string, 'error' | 'warning' | 'primary'> = {
  high: 'error',
  medium: 'warning',
  low: 'primary',
};

export function TaskCardWithActions({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isDragging,
  dragHandleProps,
}: TaskCardWithActionsProps) {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 p-4 rounded-lg border transition-all',
        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0 hidden md:block"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Completion Toggle */}
      <button
        onClick={() => onToggleComplete(task.id)}
        className="shrink-0 text-gray-400 hover:text-blue-500 transition-colors"
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium truncate',
            task.completed
              ? 'line-through text-gray-400 dark:text-gray-500'
              : 'text-gray-900 dark:text-white'
          )}
          title={task.title}
        >
          {task.title}
        </p>
        {formattedDate && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Due {formattedDate}
          </p>
        )}
      </div>

      {/* Priority Badge */}
      <Badge variant={priorityVariant[task.priority]} size="sm" className="shrink-0">
        {task.priority}
      </Badge>

      {/* Hover Actions - visible on hover (desktop) or always (mobile) */}
      <div className={cn(
        'flex items-center gap-1 shrink-0',
        'md:opacity-0 md:group-hover:opacity-100 transition-opacity'
      )}>
        {onEdit && (
          <button
            onClick={() => onEdit(task.id)}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            title="Edit task"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

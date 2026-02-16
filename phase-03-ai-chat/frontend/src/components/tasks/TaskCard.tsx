'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, MoreHorizontal, Calendar, Flag, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn, formatDate } from '@/lib/utils';

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

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

const priorityStyles: Record<string, { badge: 'error' | 'warning' | 'default' | 'primary' | 'success'; icon: string; border: string }> = {
  high: {
    badge: 'error',
    icon: 'text-red-500',
    border: 'border-red-200 dark:border-red-900/30',
  },
  medium: {
    badge: 'warning',
    icon: 'text-yellow-500',
    border: 'border-yellow-200 dark:border-yellow-900/30',
  },
  low: {
    badge: 'default',
    icon: 'text-green-500',
    border: 'border-green-200 dark:border-green-900/30',
  },
};

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const priorityStyle = priorityStyles[task.priority];

  return (
    <Card
      variant="bordered"
      className={cn(
        'group hover:shadow-md transition-shadow',
        task.completed && 'opacity-70',
        priorityStyle.border
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className="shrink-0 mt-0.5"
          aria-label={
            task.completed
              ? `Mark "${task.title}" as incomplete`
              : `Mark "${task.title}" as complete`
          }
        >
          {task.completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3
                className={cn(
                  'font-medium text-gray-900 dark:text-white break-words',
                  task.completed && 'line-through text-gray-500 dark:text-gray-500'
                )}
              >
                {task.title}
              </h3>

              {task.description && isExpanded && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {task.description}
                </p>
              )}
            </div>

            {/* Action Menu */}
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task.id)}
                  aria-label="Edit task"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Meta Information */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            {/* Priority */}
            <div className="flex items-center gap-1">
              <Flag className={cn('h-3 w-3', priorityStyle.icon)} />
              <Badge variant={priorityStyle.badge} size="sm">
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </div>

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                <div className="flex gap-1">
                  {task.tags.map((tag, index) => (
                    <Badge key={index} variant="default" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Expand/Collapse */}
            {task.description && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 ml-auto"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons (shown on hover on desktop) */}
      {(onDelete || onEdit) && (
        <div className="mt-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(task.id)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

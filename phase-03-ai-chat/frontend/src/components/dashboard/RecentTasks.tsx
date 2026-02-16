'use client';

import Link from 'next/link';
import { CheckCircle2, Circle, ChevronRight, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, formatDate } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

interface RecentTasksProps {
  tasks: Task[];
  onToggleComplete?: (taskId: string) => void;
  className?: string;
}

const priorityStyles = {
  high: 'error',
  medium: 'warning',
  low: 'default',
} as const;

const priorityLabels = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export function RecentTasks({
  tasks,
  onToggleComplete,
  className,
}: RecentTasksProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Tasks</CardTitle>
        <Link
          href="/dashboard/tasks"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              No tasks yet. Create your first task!
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {/* Checkbox */}
                <button
                  onClick={() => onToggleComplete?.(task.id)}
                  className="shrink-0"
                  aria-label={
                    task.completed
                      ? `Mark "${task.title}" as incomplete`
                      : `Mark "${task.title}" as complete`
                  }
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium truncate',
                      task.completed
                        ? 'text-gray-400 line-through'
                        : 'text-gray-900 dark:text-white'
                    )}
                  >
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(task.dueDate)}
                    </div>
                  )}
                </div>

                {/* Priority Badge */}
                <Badge
                  variant={priorityStyles[task.priority]}
                  size="sm"
                >
                  {priorityLabels[task.priority]}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

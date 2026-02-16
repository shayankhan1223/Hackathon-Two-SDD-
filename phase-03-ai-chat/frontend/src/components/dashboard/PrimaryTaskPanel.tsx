'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface Task {
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

interface PrimaryTaskPanelProps {
  tasks: Task[];
  loading?: boolean;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

type SortField = 'priority' | 'dueDate' | 'title';
type FilterStatus = 'all' | 'pending' | 'completed';

const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export function PrimaryTaskPanel({ tasks, loading, onToggleComplete, onDelete, onEdit }: PrimaryTaskPanelProps) {
  const [sortField, setSortField] = useState<SortField>('priority');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filtered = tasks.filter(t => {
    if (filterStatus === 'pending') return !t.completed;
    if (filterStatus === 'completed') return t.completed;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'priority') return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
    if (sortField === 'dueDate') return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
    if (sortField === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Tasks <span className="text-sm font-normal text-gray-500">({filtered.length})</span>
        </h3>
        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); }}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Sort: {sortField === 'dueDate' ? 'Due Date' : sortField.charAt(0).toUpperCase() + sortField.slice(1)}
              <ChevronDown className="h-3 w-3" />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1 min-w-[140px]">
                {(['priority', 'dueDate', 'title'] as SortField[]).map(field => (
                  <button
                    key={field}
                    onClick={() => { setSortField(field); setShowSortMenu(false); }}
                    className={cn(
                      'w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700',
                      sortField === field ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                    )}
                  >
                    {field === 'dueDate' ? 'Due Date' : field.charAt(0).toUpperCase() + field.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); }}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {filterStatus === 'all' ? 'All' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              <ChevronDown className="h-3 w-3" />
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                {(['all', 'pending', 'completed'] as FilterStatus[]).map(status => (
                  <button
                    key={status}
                    onClick={() => { setFilterStatus(status); setShowFilterMenu(false); }}
                    className={cn(
                      'w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700',
                      filterStatus === status ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                    )}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto max-h-[500px]">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-3">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No tasks yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create a task to get started</p>
          </div>
        ) : (
          <div role="list" aria-label="Task list" className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {sorted.map(task => (
              <div
                key={task.id}
                role="listitem"
                className="group flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className="flex-shrink-0"
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 hover:text-green-500 transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium truncate',
                    task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
                  )}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge className={cn('text-xs px-1.5 py-0', priorityColors[task.priority])}>
                      {task.priority}
                    </Badge>
                    {task.dueDate && (
                      <span className={cn(
                        'text-xs',
                        !task.completed && task.dueDate < new Date().toISOString().split('T')[0]
                          ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'
                      )}>
                        {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(task.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      aria-label="Edit task"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

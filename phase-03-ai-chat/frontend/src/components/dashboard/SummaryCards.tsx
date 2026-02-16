'use client';

import { ListTodo, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
  loading?: boolean;
}

const cards = [
  { key: 'total', label: 'Total Tasks', icon: ListTodo, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { key: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
  { key: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { key: 'overdue', label: 'Overdue', icon: AlertTriangle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
] as const;

export function SummaryCards({ stats, loading }: SummaryCardsProps) {
  return (
    <div role="region" aria-label="Task summary" className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key as keyof typeof stats];
        return (
          <div
            key={card.key}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            {loading ? (
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-7 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                  <p className={cn('text-2xl font-bold mt-1', card.color)}>{value}</p>
                </div>
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', card.bg)}>
                  <Icon className={cn('h-5 w-5', card.color)} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

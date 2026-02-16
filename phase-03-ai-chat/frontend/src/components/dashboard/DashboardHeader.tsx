'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DashboardHeaderProps {
  userName?: string;
  onAddTask: () => void;
}

export function DashboardHeader({ userName, onAddTask }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {userName ? `Welcome back, ${userName.split('@')[0]}` : 'Welcome back'}
        </p>
      </div>
      <Button onClick={onAddTask} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Task
      </Button>
    </div>
  );
}

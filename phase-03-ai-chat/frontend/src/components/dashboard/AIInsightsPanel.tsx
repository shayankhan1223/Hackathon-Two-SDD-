'use client';

import { useMemo } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  createdAt?: string;
}

interface AIInsightsPanelProps {
  tasks: Task[];
}

export function AIInsightsPanel({ tasks }: AIInsightsPanelProps) {
  const insights = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const completedCount = tasks.filter(t => t.completed).length;
    const overdueCount = tasks.filter(t => {
      if (t.completed || !t.dueDate) return false;
      return new Date(t.dueDate) < now;
    }).length;

    // Productivity score: completed in last 7 days / total created in last 7 days
    const recentTasks = tasks.filter(t => {
      const created = t.createdAt ? new Date(t.createdAt) : sevenDaysAgo;
      return created >= sevenDaysAgo;
    });
    const recentCompleted = recentTasks.filter(t => t.completed).length;
    const productivityScore = recentTasks.length > 0
      ? Math.round((recentCompleted / recentTasks.length) * 100)
      : 0;

    // AI suggestion: find highest priority incomplete task
    const highestPriorityTask = tasks
      .filter(t => !t.completed)
      .sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      })[0];

    const suggestion = highestPriorityTask
      ? `Focus on "${highestPriorityTask.title}" first`
      : 'Great job! All tasks are completed.';

    return { completedCount, overdueCount, productivityScore, suggestion };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Sparkles className="h-10 w-10 text-blue-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Start adding tasks to see your AI insights!
          </p>
        </div>
      </div>
    );
  }

  // SVG circular progress for productivity score
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (insights.productivityScore / 100) * circumference;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">AI Insights</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* Completed */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{insights.completedCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
        </div>

        {/* Overdue */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{insights.overdueCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Overdue</p>
        </div>

        {/* Productivity Score */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-2">
            <svg className="h-10 w-10 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-blue-500 transition-all duration-500"
              />
            </svg>
            <TrendingUp className="absolute h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{insights.productivityScore}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Productivity</p>
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
        <Sparkles className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700 dark:text-blue-300">{insights.suggestion}</p>
      </div>
    </div>
  );
}

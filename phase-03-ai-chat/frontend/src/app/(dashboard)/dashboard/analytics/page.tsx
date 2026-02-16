'use client';

import { BarChart3, TrendingUp, Activity } from 'lucide-react';

const placeholderCards = [
  {
    title: 'Task Completion Charts',
    description: 'Visualize your task completion rates over time with interactive charts and breakdowns by priority.',
    icon: BarChart3,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
  },
  {
    title: 'Productivity Trends',
    description: 'Track your productivity patterns across days, weeks, and months to identify peak performance periods.',
    icon: TrendingUp,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
  },
  {
    title: 'Performance Metrics',
    description: 'Monitor key performance indicators including task velocity, on-time completion rate, and priority distribution.',
    icon: Activity,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Feature Coming Soon</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50 p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
          <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          We&apos;re building powerful analytics tools to help you understand your productivity patterns and optimize your workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {placeholderCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`rounded-xl border-2 border-dashed ${card.border} ${card.bg} p-6 flex flex-col items-center text-center`}
            >
              <div className="h-12 w-12 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center mb-4 shadow-sm">
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

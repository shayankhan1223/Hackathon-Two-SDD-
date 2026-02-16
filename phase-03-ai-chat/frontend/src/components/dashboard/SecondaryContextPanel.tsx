'use client';

import { useState } from 'react';
import { Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

interface SecondaryContextPanelProps {
  tasks: Task[];
}

const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function SecondaryContextPanel({ tasks }: SecondaryContextPanelProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'insights'>('insights');

  const today = new Date().toISOString().split('T')[0];
  const completedCount = tasks.filter(t => t.completed).length;
  const overdueCount = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length;
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const topTask = tasks
    .filter(t => !t.completed)
    .sort((a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2))[0];

  const upcomingEvents = [
    { title: 'Team Standup', time: '10:00 AM', date: 'Today' },
    { title: 'Client Review', time: '2:30 PM', date: 'Tomorrow' },
    { title: 'Sprint Planning', time: '11:00 AM', date: 'Feb 18' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('insights')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'insights'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <Sparkles className="h-4 w-4" />
          AI Insights
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'calendar'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          <Calendar className="h-4 w-4" />
          Calendar
        </button>
      </div>

      <div className="p-4 flex-1">
        {activeTab === 'insights' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16">
                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${completionRate}, 100`}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900 dark:text-white">
                  {completionRate}%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Productivity Score</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Based on task completion</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{completedCount}</p>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">Completed</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{overdueCount}</p>
                <p className="text-xs text-red-600/70 dark:text-red-400/70">Overdue</p>
              </div>
            </div>

            {topTask ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Suggestion</p>
                    <p className="text-xs text-blue-700 dark:text-blue-400/80 mt-0.5">
                      Focus on &quot;{topTask.title}&quot; &mdash; it&apos;s your highest priority task
                      {topTask.dueDate ? ` due ${topTask.dueDate}` : ''}.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Sparkles className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">All caught up!</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Chat with AI for more insights</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {event.time} &bull; {event.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

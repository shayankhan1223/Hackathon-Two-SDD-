'use client';

import {
  MessageSquare,
  Calendar,
  Zap,
  BarChart3,
  Search,
  Shield,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: MessageSquare,
    title: 'AI Chat Interface',
    description:
      'Create, update, and manage tasks using natural language. Just tell the AI what you need to do.',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    icon: Calendar,
    title: 'Smart Calendar',
    description:
      'Visualize your tasks in month, week, or day views. Navigate time effortlessly with drill-down navigation.',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    icon: Zap,
    title: 'Instant Sync',
    description:
      'Changes made via chat reflect immediately in the UI. No refresh needed, ever.',
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  {
    icon: BarChart3,
    title: 'Task Analytics',
    description:
      'Ask the AI about your productivity. Get insights on task completion, overdue items, and trends.',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    icon: Search,
    title: 'Smart Search & Filters',
    description:
      'Find any task instantly. Filter by status, priority, tags, and date ranges.',
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your data is encrypted and secure. The AI only helps with tasks—nothing else.',
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Everything you need to stay productive
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Powerful features designed to help you manage tasks effortlessly
            with the power of AI.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                variant="bordered"
                className="group hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col h-full">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color} mb-4`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 flex-1">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

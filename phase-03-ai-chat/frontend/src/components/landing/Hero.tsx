'use client';

import Link from 'next/link';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const benefits = [
  'No credit card required',
  'Free plan available',
  '5-minute setup',
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI-Powered Task Management
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
              Manage Tasks with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Natural Language
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
              Simply tell TaskFlow what you need to do. Our AI understands your
              tasks, schedules them intelligently, and keeps you on track.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/sign-up">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Get Started Free
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" leftIcon={<Play className="h-5 w-5" />}>
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Benefits */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              {/* Mock Dashboard Preview */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center text-sm text-gray-500">
                  TaskFlow Dashboard
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Chat Message Mock */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                    AI
                  </div>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300">
                    Sure! I&apos;ve created a task &quot;Buy groceries&quot; for tomorrow with high priority. Would you like me to add any specific items?
                  </div>
                </div>
                {/* Task Preview Mocks */}
                <div className="space-y-2">
                  {[
                    { title: 'Team meeting', time: '10:00 AM', priority: 'high' },
                    { title: 'Review PRs', time: '2:00 PM', priority: 'medium' },
                    { title: 'Buy groceries', time: 'Tomorrow', priority: 'high' },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          task.priority === 'high'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                        {task.title}
                      </span>
                      <span className="text-xs text-gray-500">{task.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    12
                  </div>
                  <div className="text-xs text-gray-500">Tasks completed today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { UserPlus, MessageSquarePlus, CalendarCheck } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Sign Up',
    description:
      'Create your free account in seconds. No credit card required to get started.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: '02',
    icon: MessageSquarePlus,
    title: 'Add Tasks',
    description:
      'Use the chat or UI to create tasks. Say "Add a task to buy groceries tomorrow" and it\'s done.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    number: '03',
    icon: CalendarCheck,
    title: 'Stay Organized',
    description:
      'View your tasks on the calendar, get reminders, and track your progress with analytics.',
    color: 'from-green-500 to-green-600',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Get started in 3 simple steps
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            TaskFlow is designed to be intuitive. Here&apos;s how easy it is to get
            started.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 dark:from-blue-900 dark:via-purple-900 dark:to-green-900 -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step Number Background */}
                  <div className="relative z-10 mb-6">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-sm font-bold text-gray-900 dark:text-white shadow-md">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

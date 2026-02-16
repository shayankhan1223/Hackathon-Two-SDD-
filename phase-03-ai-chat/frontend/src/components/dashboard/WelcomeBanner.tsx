'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface WelcomeBannerProps {
  userName?: string;
  className?: string;
}

const tips = [
  'Try typing "Add a task to buy groceries tomorrow" in the chat!',
  'Use the calendar to see your tasks organized by date.',
  'Mark tasks complete by clicking the checkbox.',
  'Filter tasks by priority to focus on what matters most.',
];

export function WelcomeBanner({ userName, className }: WelcomeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  // Check if banner was previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('welcome_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  // Rotate tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('welcome_banner_dismissed', 'true');
  };

  if (isDismissed) {
    return null;
  }

  const displayName = userName?.split('@')[0] || 'there';

  return (
    <Card
      className={cn(
        'relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600',
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Dismiss welcome banner"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">
              Welcome, {displayName}! 👋
            </h2>
            <p className="mt-1 text-blue-100">
              You&apos;re all set to start managing your tasks with AI.
            </p>

            {/* Quick Tip */}
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
              <Lightbulb className="h-5 w-5 text-yellow-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Quick Tip</p>
                <p className="text-sm text-blue-100">{tips[currentTip]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

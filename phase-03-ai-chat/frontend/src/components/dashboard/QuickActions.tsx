'use client';

import Link from 'next/link';
import { Plus, Calendar, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

interface QuickActionsProps {
  onCreateTask?: () => void;
}

export function QuickActions({ onCreateTask }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      label: 'Add Task',
      icon: <Plus className="h-4 w-4" />,
      onClick: onCreateTask,
      variant: 'primary',
    },
    {
      label: 'View Calendar',
      icon: <Calendar className="h-4 w-4" />,
      href: '/dashboard/calendar',
      variant: 'secondary',
    },
    {
      label: 'Open Chat',
      icon: <MessageSquare className="h-4 w-4" />,
      href: '/dashboard/chat',
      variant: 'secondary',
    },
    {
      label: 'Search Tasks',
      icon: <Search className="h-4 w-4" />,
      href: '/dashboard/tasks',
      variant: 'ghost',
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => {
        const button = (
          <Button
            key={action.label}
            variant={action.variant || 'secondary'}
            leftIcon={action.icon}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        );

        if (action.href) {
          return (
            <Link key={action.label} href={action.href}>
              {button}
            </Link>
          );
        }

        return button;
      })}
    </div>
  );
}

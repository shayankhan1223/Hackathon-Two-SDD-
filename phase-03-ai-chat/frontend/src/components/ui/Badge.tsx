'use client';

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: cn(
      'bg-gray-100 text-gray-700',
      'dark:bg-gray-800 dark:text-gray-300'
    ),
    primary: cn(
      'bg-blue-100 text-blue-700',
      'dark:bg-blue-900/30 dark:text-blue-400'
    ),
    success: cn(
      'bg-green-100 text-green-700',
      'dark:bg-green-900/30 dark:text-green-400'
    ),
    warning: cn(
      'bg-yellow-100 text-yellow-700',
      'dark:bg-yellow-900/30 dark:text-yellow-400'
    ),
    error: cn(
      'bg-red-100 text-red-700',
      'dark:bg-red-900/30 dark:text-red-400'
    ),
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

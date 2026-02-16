'use client';

import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = 'md',
  className,
  label = 'Loading...',
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full',
          'border-blue-600 border-t-transparent',
          sizes[size]
        )}
        role="status"
        aria-label={label}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

// Full page loading spinner
export function PageLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

// Inline loading for buttons or small areas
export function InlineLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-4', className)}>
      <LoadingSpinner size="sm" />
    </div>
  );
}

// Skeleton loader for content placeholders
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        variantClasses[variant],
        className
      )}
      style={{
        width: width,
        height: height,
      }}
      aria-hidden="true"
    />
  );
}

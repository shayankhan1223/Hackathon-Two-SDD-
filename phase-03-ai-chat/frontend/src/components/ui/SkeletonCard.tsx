import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-7 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}

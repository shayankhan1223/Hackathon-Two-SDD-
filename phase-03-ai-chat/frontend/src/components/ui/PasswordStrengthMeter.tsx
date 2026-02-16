'use client';

import { calculatePasswordStrength, type StrengthLevel } from '@/lib/password-strength';
import { cn } from '@/lib/utils';

interface PasswordStrengthMeterProps {
  password: string;
}

const segmentColors: Record<StrengthLevel, string> = {
  weak: 'bg-red-500',
  fair: 'bg-amber-500',
  good: 'bg-lime-500',
  strong: 'bg-green-500',
};

const textColors: Record<StrengthLevel, string> = {
  weak: 'text-red-600 dark:text-red-400',
  fair: 'text-amber-600 dark:text-amber-400',
  good: 'text-lime-600 dark:text-lime-400',
  strong: 'text-green-600 dark:text-green-400',
};

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = calculatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5" role="status" aria-live="polite" aria-label={`Password strength: ${strength.label}`}>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-200',
              segment <= strength.score
                ? segmentColors[strength.level]
                : 'bg-gray-200 dark:bg-gray-700'
            )}
          />
        ))}
      </div>
      {strength.label && (
        <p className={cn('text-xs font-medium', textColors[strength.level])}>
          {strength.label}
        </p>
      )}
    </div>
  );
}

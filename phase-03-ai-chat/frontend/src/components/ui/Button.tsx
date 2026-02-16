'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center font-medium rounded-lg',
      'transition-all duration-150 ease-out',
      'active:scale-[0.98]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      fullWidth && 'w-full'
    );

    const variants = {
      primary: cn(
        'bg-blue-600 text-white',
        'hover:bg-blue-700 active:bg-blue-800',
        'focus-visible:ring-blue-500'
      ),
      secondary: cn(
        'bg-gray-100 text-gray-900',
        'hover:bg-gray-200 active:bg-gray-300',
        'focus-visible:ring-gray-400',
        'dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
      ),
      ghost: cn(
        'bg-transparent text-gray-700',
        'hover:bg-gray-100 active:bg-gray-200',
        'focus-visible:ring-gray-400',
        'dark:text-gray-300 dark:hover:bg-gray-800'
      ),
      danger: cn(
        'bg-red-600 text-white',
        'hover:bg-red-700 active:bg-red-800',
        'focus-visible:ring-red-500'
      ),
      outline: cn(
        'bg-transparent text-gray-700 border-2 border-gray-300',
        'hover:bg-gray-50 active:bg-gray-100',
        'focus-visible:ring-gray-400',
        'dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800'
      ),
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm gap-1.5 min-w-[32px]',
      md: 'h-10 px-4 text-sm gap-2 min-w-[40px]',
      lg: 'h-12 px-6 text-base gap-2.5 min-w-[48px]',
    };

    // Ensure minimum touch target size (44x44px) on mobile
    const touchTarget = cn(
      'min-h-[44px] min-w-[44px]',
      'sm:min-h-0 sm:min-w-0'
    );

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          touchTarget,
          className
        )}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">Loading</span>
            {children}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="inline-flex shrink-0" aria-hidden="true">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className="inline-flex shrink-0" aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
  floatingLabel?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      floatingLabel = false,
      disabled,
      id: propId,
      placeholder,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = propId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const sizes = {
      sm: 'h-8 text-sm',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base',
    };

    const floatingSizes = {
      sm: 'h-12 text-sm pt-5',
      md: 'h-14 text-sm pt-5',
      lg: 'h-16 text-base pt-6',
    };

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    const paddingWithIcon = {
      left: leftIcon ? 'pl-10' : 'pl-3',
      right: rightIcon ? 'pr-10' : 'pr-3',
    };

    if (floatingLabel && label) {
      return (
        <div className="w-full">
          <div className="relative">
            {leftIcon && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className={cn('text-gray-400', iconSizes[inputSize])} aria-hidden="true">
                  {leftIcon}
                </span>
              </div>
            )}
            <input
              ref={ref}
              id={id}
              type={type}
              disabled={disabled}
              placeholder=" "
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error ? errorId : hint ? hintId : undefined
              }
              className={cn(
                'peer w-full rounded-lg border transition-all duration-200',
                'placeholder:text-transparent',
                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                floatingSizes[inputSize],
                paddingWithIcon.left,
                paddingWithIcon.right,
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600',
                disabled && 'bg-gray-50 cursor-not-allowed dark:bg-gray-800',
                !disabled && 'bg-white dark:bg-gray-900',
                'dark:text-white',
                className
              )}
              {...props}
            />
            <label
              htmlFor={id}
              className={cn(
                'absolute pointer-events-none transition-all duration-200 origin-left',
                leftIcon ? 'left-10' : 'left-3',
                'top-1/2 -translate-y-1/2',
                'text-sm text-gray-500 dark:text-gray-400',
                'peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:scale-75 peer-focus:text-blue-600 dark:peer-focus:text-blue-400',
                'peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-75',
                error && 'peer-focus:text-red-500'
              )}
            >
              {label}
            </label>
            {rightIcon && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {rightIcon}
              </div>
            )}
          </div>
          {error && (
            <p
              id={errorId}
              className="mt-1.5 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {error}
            </p>
          )}
          {hint && !error && (
            <p
              id={hintId}
              className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"
            >
              {hint}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className={cn('text-gray-400', iconSizes[inputSize])} aria-hidden="true">
                {leftIcon}
              </span>
            </div>
          )}
          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? errorId : hint ? hintId : undefined
            }
            className={cn(
              'w-full rounded-lg border transition-colors duration-150',
              'placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              sizes[inputSize],
              paddingWithIcon.left,
              paddingWithIcon.right,
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600',
              disabled && 'bg-gray-50 cursor-not-allowed dark:bg-gray-800',
              !disabled && 'bg-white dark:bg-gray-900',
              'dark:text-white',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={hintId}
            className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

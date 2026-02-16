'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
import clsx from 'clsx';

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType>({
  value: '',
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
});

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export function SelectTrigger({ className, children }: SelectTriggerProps) {
  const { open, setOpen } = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={clsx(
        'flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
        'dark:border-gray-600 dark:bg-gray-700 dark:text-white',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
    >
      {children}
      <svg
        className={clsx('ml-2 h-4 w-4 transition-transform', open && 'rotate-180')}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = useContext(SelectContext);

  return (
    <span className={clsx(!value && 'text-gray-400')}>
      {value ? value.replace(/_/g, ' ') : placeholder}
    </span>
  );
}

interface SelectContentProps {
  children: React.ReactNode;
}

export function SelectContent({ children }: SelectContentProps) {
  const { open } = useContext(SelectContext);

  if (!open) return null;

  return (
    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-700">
      {children}
    </div>
  );
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export function SelectItem({ value: itemValue, children }: SelectItemProps) {
  const { value, onValueChange, setOpen } = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => {
        onValueChange(itemValue);
        setOpen(false);
      }}
      className={clsx(
        'w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600',
        value === itemValue && 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
      )}
    >
      {children}
    </button>
  );
}

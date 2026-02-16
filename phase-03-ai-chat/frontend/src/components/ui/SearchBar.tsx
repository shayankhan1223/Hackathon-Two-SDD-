'use client';

import { useState, KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && value) {
      handleClear();
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-center rounded-lg border',
        focused ? 'ring-2 ring-blue-500 ring-offset-1' : 'border-gray-300',
        'bg-white dark:bg-gray-800',
        className
      )}
    >
      <div className="absolute left-3 text-gray-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full py-2 pl-10 pr-8 bg-transparent border-none focus:outline-none text-sm"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

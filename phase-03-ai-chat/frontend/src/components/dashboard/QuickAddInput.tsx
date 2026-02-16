'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAddInputProps {
  onAddTask: (title: string) => void;
  existingTitles: string[];
}

export function QuickAddInput({ onAddTask, existingTitles }: QuickAddInputProps) {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const suggestions = value.trim()
    ? existingTitles.filter(t =>
        t.toLowerCase().startsWith(value.toLowerCase()) && t.toLowerCase() !== value.toLowerCase()
      ).slice(0, 6)
    : [];

  const showDropdown = isOpen && suggestions.length > 0;

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed) {
      onAddTask(trimmed);
      setValue('');
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }, [value, onAddTask]);

  const handleSelect = useCallback((title: string) => {
    onAddTask(title);
    setValue('');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, [onAddTask]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelect(suggestions[activeIndex]);
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest('.quick-add-wrapper')?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const listboxId = 'quick-add-listbox';

  return (
    <div className="quick-add-wrapper relative">
      <div className="relative flex items-center">
        <div className="absolute left-3 pointer-events-none">
          <Plus className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Quick add a task..."
          className={cn(
            'w-full h-11 pl-10 pr-4 rounded-lg border transition-colors',
            'border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
            'text-sm'
          )}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? listboxId : undefined}
          aria-activedescendant={activeIndex >= 0 ? `quick-add-option-${activeIndex}` : undefined}
          aria-autocomplete="list"
        />
      </div>

      {showDropdown && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto"
        >
          {suggestions.map((title, index) => (
            <li
              key={title}
              id={`quick-add-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={cn(
                'px-4 py-2.5 text-sm cursor-pointer transition-colors',
                'text-gray-700 dark:text-gray-300',
                index === activeIndex
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(title);
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

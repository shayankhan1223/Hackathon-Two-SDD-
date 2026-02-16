'use client';

import { useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface TaskFilters {
  status: 'all' | 'active' | 'completed';
  priority: 'all' | 'high' | 'medium' | 'low';
  tags: string[];
}

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  availableTags?: string[];
}

export default function TaskFilters({
  filters,
  onFiltersChange,
  availableTags = [],
}: TaskFiltersProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleStatusChange = (status: TaskFilters['status']) => {
    onFiltersChange({ ...filters, status });
  };

  const handlePriorityChange = (priority: TaskFilters['priority']) => {
    onFiltersChange({ ...filters, priority });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !filters.tags.includes(newTag.trim())) {
      onFiltersChange({
        ...filters,
        tags: [...filters.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onFiltersChange({
      ...filters,
      tags: filters.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: 'all',
      priority: 'all',
      tags: [],
    });
  };

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.tags.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="relative">
          <Button
            variant={filters.status === 'all' ? 'outline' : 'primary'}
            size="sm"
            onClick={() => handleStatusChange(filters.status === 'all' ? 'active' : 'all')}
          >
            {filters.status === 'all' ? 'All Tasks' : filters.status === 'active' ? 'Active' : 'Completed'}
          </Button>
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <Button
            variant={filters.priority === 'all' ? 'outline' : 'primary'}
            size="sm"
            onClick={() => setShowDropdown(!showDropdown)}
            rightIcon={<ChevronDown className="h-4 w-4" />}
          >
            {filters.priority === 'all' ? 'All Priorities' : `Priority: ${filters.priority}`}
          </Button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
                <button
                  key={priority}
                  className={`w-full text-left px-3 py-2 text-sm ${
                    filters.priority === priority
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    handlePriorityChange(priority);
                    setShowDropdown(false);
                  }}
                >
                  {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags Filter */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2">
            {filters.tags.map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <div className="flex gap-1">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Add tag..."
                className="px-2 py-1 text-sm rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            leftIcon={<X className="h-4 w-4" />}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

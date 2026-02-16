import { useState } from 'react';

export interface FilterState {
  status: 'all' | 'active' | 'completed';
  priority: 'all' | 'high' | 'medium' | 'low';
  tags: string[];
  search: string;
  sortBy: 'dueDate' | 'priority' | 'title' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export function useFilters(initialState?: Partial<FilterState>) {
  const [filters, setFilters] = useState<FilterState>({
    status: initialState?.status || 'all',
    priority: initialState?.priority || 'all',
    tags: initialState?.tags || [],
    search: initialState?.search || '',
    sortBy: initialState?.sortBy || 'dueDate',
    sortOrder: initialState?.sortOrder || 'asc',
  });

  const updateFilter = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      tags: [],
      search: '',
      sortBy: 'dueDate',
      sortOrder: 'asc',
    });
  };

  const clearSingleFilter = (filterName: keyof FilterState) => {
    if (filterName === 'tags') {
      setFilters(prev => ({ ...prev, tags: [] }));
    } else if (filterName === 'search') {
      setFilters(prev => ({ ...prev, search: '' }));
    } else if (filterName === 'status') {
      setFilters(prev => ({ ...prev, status: 'all' }));
    } else if (filterName === 'priority') {
      setFilters(prev => ({ ...prev, priority: 'all' }));
    } else if (filterName === 'sortBy') {
      setFilters(prev => ({ ...prev, sortBy: 'dueDate' }));
    } else if (filterName === 'sortOrder') {
      setFilters(prev => ({ ...prev, sortOrder: 'asc' }));
    }
  };

  return {
    filters,
    updateFilter,
    addTag,
    removeTag,
    clearFilters,
    clearSingleFilter,
  };
}

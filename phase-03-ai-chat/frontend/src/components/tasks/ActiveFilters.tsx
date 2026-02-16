import { X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ActiveFilter {
  id: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
}

export function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => (
        <Badge key={filter.id} variant="default" size="sm">
          {filter.label}: {filter.value}
          <button
            type="button"
            onClick={() => onRemove(filter.id)}
            className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.length > 1 && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

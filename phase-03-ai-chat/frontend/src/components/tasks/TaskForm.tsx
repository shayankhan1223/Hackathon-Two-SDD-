'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Tag, Calendar, Flag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// Define the validation schema
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export default function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save Task',
  isLoading = false,
}: TaskFormProps) {
  const [tagsInput, setTagsInput] = useState('');
  const [newTag, setNewTag] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || 'medium',
      dueDate: initialData?.dueDate || '',
      tags: initialData?.tags || [],
    },
  });

  const watchedTags = watch('tags');

  const handleAddTag = () => {
    if (newTag.trim() && watchedTags && watchedTags.length < 5) {
      const newTags = [...watchedTags, newTag.trim()];
      setValue('tags', newTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = watchedTags.filter((_, i) => i !== index);
    setValue('tags', newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleTagsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    // Auto-add tag when comma is pressed
    if (e.target.value.endsWith(',')) {
      const tag = e.target.value.slice(0, -1).trim();
      if (tag && watchedTags && watchedTags.length < 5) {
        const newTags = [...watchedTags, tag];
        setValue('tags', newTags);
        setTagsInput('');
      }
    }
  };

  const onSubmitHandler = (data: TaskFormData) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          {/* Title */}
          <Input
            label="Task Title"
            placeholder="What needs to be done?"
            error={errors.title?.message}
            inputSize="lg"
            {...register('title')}
          />

          {/* Description */}
          <Input
            label="Description (Optional)"
            placeholder="Add more details..."
            error={errors.description?.message}
            inputSize="lg"
            {...register('description')}
          />

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setValue('priority', priority)}
                  className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                    watch('priority') === priority
                      ? priority === 'high'
                        ? 'bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400'
                        : priority === 'medium'
                        ? 'bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-400'
                        : 'bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="capitalize">{priority}</span>
                </button>
              ))}
            </div>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.priority.message}
              </p>
            )}
          </div>

          {/* Due Date */}
          <Input
            label="Due Date (Optional)"
            type="date"
            error={errors.dueDate?.message}
            {...register('dueDate')}
          />

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {watchedTags?.map((tag, index) => (
                <Badge key={index} variant="default" size="sm">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={tagsInput + newTag}
                  onChange={handleTagsInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Add tags (comma separated)..."
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleAddTag}
                disabled={!newTag.trim() || (watchedTags?.length || 0) >= 5}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.tags.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

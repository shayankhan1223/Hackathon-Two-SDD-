'use client';

import { useState } from 'react';
import { createTaskSchema, type CreateTaskFormData } from '@/lib/validation';

interface TaskFormProps {
  onSubmit: (data: CreateTaskFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<CreateTaskFormData>;
  submitLabel?: string;
}

export default function TaskForm({
  onSubmit,
  onCancel,
  initialData = {},
  submitLabel = 'Create Task',
}: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
  });
  const [errors, setErrors] = useState<Partial<CreateTaskFormData>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = createTaskSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<CreateTaskFormData> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof CreateTaskFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Title <span className="text-error">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          className={errors.title ? 'input-error' : 'input'}
          value={formData.title}
          onChange={handleChange}
          disabled={loading}
          placeholder="Enter task title"
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
        <p className="text-xs text-gray-500 mt-1">
          {formData.title.length}/200 characters
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={1000}
          className={errors.description ? 'input-error' : 'input'}
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
          placeholder="Enter task description (optional)"
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
        <p className="text-xs text-gray-500 mt-1">
          {formData.description?.length || 0}/1000 characters
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

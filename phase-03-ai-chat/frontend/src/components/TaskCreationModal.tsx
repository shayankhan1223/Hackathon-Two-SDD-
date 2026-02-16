import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onTaskCreated: () => void;
}

export function TaskCreationModal({
  isOpen,
  onClose,
  selectedDate,
  onTaskCreated
}: TaskCreationModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !title.trim()) {
      toast.error('Please provide a title and date');
      return;
    }

    setLoading(true);

    try {
      // Format the date as YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];

      // Create the task via API
      await api.tasks.create({
        title: title.trim(),
        due_date: formattedDate,
        description: description.trim(),
        priority: priority,
      });

      toast.success('Task created successfully!');
      setTitle('');
      setDescription('');
      setPriority('medium');
      onTaskCreated(); // Refresh the calendar view
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add Task
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <div className="text-gray-900 dark:text-white">
                {selectedDate ? selectedDate.toLocaleDateString() : 'No date selected'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <div className="flex gap-2">
                <Button
                  variant={priority === 'low' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setPriority('low');
                  }}
                >
                  Low
                </Button>
                <Button
                  variant={priority === 'medium' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setPriority('medium');
                  }}
                >
                  Medium
                </Button>
                <Button
                  variant={priority === 'high' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setPriority('high');
                  }}
                >
                  High
                </Button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title.trim() || loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
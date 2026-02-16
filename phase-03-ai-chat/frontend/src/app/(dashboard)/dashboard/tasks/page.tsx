'use client';

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { TaskList } from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import TaskFilters from '@/components/tasks/TaskFilters';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import type { Task } from '@/components/tasks/TaskCard';
import { api } from '@/lib/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'active' | 'completed',
    priority: 'all' as 'all' | 'high' | 'medium' | 'low',
    tags: [] as string[],
  });

  // Load tasks from API
  useEffect(() => {
    loadTasks();
  }, []);

  // Apply filters and search when they change
  useEffect(() => {
    let result = [...tasks];

    // Apply status filter
    if (filters.status === 'active') {
      result = result.filter(task => !task.completed);
    } else if (filters.status === 'completed') {
      result = result.filter(task => task.completed);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }

    // Apply tags filter
    if (filters.tags.length > 0) {
      result = result.filter(task =>
        task.tags?.some(tag => filters.tags.includes(tag))
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredTasks(result);
  }, [tasks, filters, searchQuery]);

  async function loadTasks() {
    try {
      setLoading(true);
      const res = await api.tasks.list();

      // Transform the response to match the Task interface
      const transformedTasks: Task[] = res.tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description ?? undefined,
        completed: task.status === 'completed',
        priority: task.priority as 'high' | 'medium' | 'low',
        dueDate: task.due_date,
        tags: task.tags?.map((t: { name: string }) => t.name) ?? [],
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await api.tasks.update(taskId, { status: task.completed ? 'pending' : 'completed' });
        loadTasks(); // Refresh the list
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleSaveTask = async (formData: any) => {
    try {
      if (editingTask) {
        // Update existing task
        await api.tasks.update(editingTask.id, formData);
      } else {
        // Create new task
        await api.tasks.create(formData);
      }

      loadTasks();
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setShowForm(true);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        // Optimistic update - remove the task immediately
        setTasks(prev => prev.filter(task => task.id !== taskId));

        await api.tasks.delete(taskId);
        // The task is already removed optimistically, so we don't need to reload
      } catch (error) {
        console.error('Error deleting task:', error);
        // If deletion fails, we should reload the tasks to restore the deleted task
        loadTasks();
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (loading) {
    return <PageLoader label="Loading tasks..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tasks
        </h1>

        <Button
          onClick={() => setShowForm(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Task
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableTags={Array.from(
            new Set(tasks.flatMap(task => task.tags || []))
          )}
        />
      </div>

      {/* Task Form */}
      {showForm && (
        <TaskForm
          initialData={editingTask || undefined}
          onSubmit={handleSaveTask}
          onCancel={handleCancelForm}
          submitLabel={editingTask ? 'Update Task' : 'Create Task'}
        />
      )}

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        isLoading={false}
        emptyState={
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No tasks found
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery || filters.status !== 'all' || filters.priority !== 'all' || filters.tags.length > 0
                ? 'Try adjusting your search or filters.'
                : 'Get started by creating a new task.'}
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setShowForm(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Create Task
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}

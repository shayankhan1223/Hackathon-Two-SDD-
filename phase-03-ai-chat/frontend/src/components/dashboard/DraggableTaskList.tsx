'use client';

import { useState, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TaskCardWithActions } from './TaskCardWithActions';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

interface DraggableTaskListProps {
  tasks: Task[];
  onReorder: (reorderedTasks: Task[]) => void;
  onToggleComplete: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export function DraggableTaskList({
  tasks,
  onReorder,
  onToggleComplete,
  onEdit,
  onDelete,
}: DraggableTaskListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const dragCounter = useRef(0);

  // Detect mobile on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    }
  });

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragEnter = useCallback((index: number) => {
    dragCounter.current++;
    setDropIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDropIndex(null);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDropIndex(null);
      dragCounter.current = 0;
      return;
    }

    const newTasks = [...tasks];
    const [removed] = newTasks.splice(dragIndex, 1);
    newTasks.splice(targetIndex, 0, removed);
    onReorder(newTasks);

    setDragIndex(null);
    setDropIndex(null);
    dragCounter.current = 0;
  }, [dragIndex, tasks, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDropIndex(null);
    dragCounter.current = 0;
  }, []);

  // Mobile reorder via buttons
  const moveTask = useCallback((index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tasks.length) return;

    const newTasks = [...tasks];
    [newTasks[index], newTasks[newIndex]] = [newTasks[newIndex], newTasks[index]];
    onReorder(newTasks);
  }, [tasks, onReorder]);

  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          No tasks yet. Add one above!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 px-1">Your Tasks</h3>
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div key={task.id} className="relative">
            {/* Drop indicator line */}
            {dropIndex === index && dragIndex !== null && dragIndex !== index && (
              <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10" />
            )}

            <div className="flex items-center gap-1">
              {/* Mobile reorder buttons */}
              {isMobile && (
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => moveTask(index, 'up')}
                    disabled={index === 0}
                    className="p-0.5 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveTask(index, 'down')}
                    disabled={index === tasks.length - 1}
                    className="p-0.5 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Task card with drag */}
              <div
                className="flex-1"
                draggable={!isMobile}
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                <TaskCardWithActions
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDragging={dragIndex === index}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { TaskCreationModal } from '@/components/TaskCreationModal';
import type { TaskResponse } from '@/lib/types';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.tasks.list();
      setTasks(response.tasks);
    } catch (err) {
      console.error('Failed to fetch tasks for calendar:', err);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const weeks = [];
  let week = Array(7).fill(null);

  // Fill in the days
  for (let i = 0; i < daysInMonth; i++) {
    const dayIndex = (firstDayOfMonth + i) % 7;
    week[dayIndex] = i + 1;

    if (dayIndex === 6 || i === daysInMonth - 1) {
      weeks.push([...week]);
      week = Array(7).fill(null);
    }
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleAddEventClick = (day: number) => {
    const selectedDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selectedDateObj);
    setShowAddEventModal(true);
  };

  const handleTaskCreated = () => {
    fetchTasks();
  };

  const getTasksForDay = (day: number) => {
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      return (
        dueDate.getFullYear() === currentDate.getFullYear() &&
        dueDate.getMonth() === currentDate.getMonth() &&
        dueDate.getDate() === day
      );
    });
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks
      .filter((task) => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= today;
      })
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .slice(0, 10);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const upcomingTasks = getUpcomingTasks();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calendar
        </h1>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatDate(currentDate)}
          </h2>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => handleAddEventClick(new Date().getDate())}>
            Add Event
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekdays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((day, index) => {
            if (day === null) {
              return <div key={index} className="aspect-square" />;
            }

            const dayTasks = getTasksForDay(day);
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={index}
                className={`aspect-square p-1 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  isToday
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => handleAddEventClick(day)}
              >
                <div className="flex justify-between items-start p-1">
                  <span
                    className={`text-sm font-medium ${
                      isToday
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {day}
                  </span>
                </div>

                <div className="space-y-1 mt-1">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="p-1 rounded text-xs truncate bg-gray-100 dark:bg-gray-800"
                    >
                      <div className="font-medium truncate">{task.title}</div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {task.priority}
                      </div>
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upcoming Events
        </h3>
        {upcomingTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CalendarIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No upcoming events. Create a task to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    task.priority === 'high' ? 'error' :
                    task.priority === 'medium' ? 'warning' : 'default'
                  }
                  size="sm"
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Task Creation Modal */}
      <TaskCreationModal
        isOpen={showAddEventModal}
        onClose={() => setShowAddEventModal(false)}
        selectedDate={selectedDate}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}

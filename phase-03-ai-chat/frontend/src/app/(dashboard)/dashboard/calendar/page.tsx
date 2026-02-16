'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock data for the calendar
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

  // Mock tasks for the calendar
  const getTasksForDay = (day: number) => {
    if (day === 15) {
      return [
        { id: '1', title: 'Team Meeting', time: '10:00 AM', priority: 'high' },
        { id: '2', title: 'Project Deadline', time: '5:00 PM', priority: 'high' },
      ];
    }
    if (day === 20) {
      return [
        { id: '3', title: 'Client Call', time: '2:30 PM', priority: 'medium' },
      ];
    }
    if (day === 25) {
      return [
        { id: '4', title: 'Review PRs', time: '9:00 AM', priority: 'low' },
      ];
    }
    return [];
  };

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
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
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

            const tasks = getTasksForDay(day);
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={index}
                className={`aspect-square p-1 border rounded-lg ${
                  isToday
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
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
                  {tasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="p-1 rounded text-xs truncate bg-gray-100 dark:bg-gray-800"
                    >
                      <div className="font-medium truncate">{task.title}</div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {task.time}
                      </div>
                    </div>
                  ))}
                  {tasks.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                      +{tasks.length - 2} more
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
        <div className="space-y-3">
          {[
            { id: '1', title: 'Team Meeting', date: 'Feb 15, 2026', time: '10:00 AM', priority: 'high' },
            { id: '2', title: 'Project Deadline', date: 'Feb 15, 2026', time: '5:00 PM', priority: 'high' },
            { id: '3', title: 'Client Call', date: 'Feb 20, 2026', time: '2:30 PM', priority: 'medium' },
            { id: '4', title: 'Review PRs', date: 'Feb 25, 2026', time: '9:00 AM', priority: 'low' },
          ].map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {event.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {event.date} • {event.time}
                  </div>
                </div>
              </div>
              <Badge
                variant={
                  event.priority === 'high' ? 'error' :
                  event.priority === 'medium' ? 'warning' : 'default'
                }
                size="sm"
              >
                {event.priority}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { TaskResponse } from '@/lib/types';

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

interface NotificationDropdownProps {
  tasks: TaskResponse[];
}

export function NotificationDropdown({ tasks }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate notifications based on tasks
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Overdue tasks
    const overdueTasks = tasks.filter(task => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today && task.status !== 'completed';
    });

    // Recently completed tasks (last 24 hours)
    const recentCompletedTasks = tasks.filter(task => {
      // Since we don't have completed_at timestamps, we'll simulate this
      return false; // Placeholder - would need actual completed_at data
    });

    // Generate notifications
    const newNotifications: Notification[] = [
      ...overdueTasks.map(task => ({
        id: `overdue-${task.id}`,
        title: 'Task Overdue',
        description: `Your task "${task.title}" is overdue`,
        timestamp: 'Just now', // Would calculate actual time
        read: false
      }))
    ];

    setNotifications(newNotifications);
  }, [tasks]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {/* Notification Badge - Show only if there are unread notifications */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {notification.description}
                    </p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {notification.timestamp}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <Bell className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 font-medium text-gray-900 dark:text-white">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
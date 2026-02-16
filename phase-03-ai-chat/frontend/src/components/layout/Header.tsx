'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search, User, LogOut, Settings, Sparkles, X } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { TaskResponse } from '@/lib/types';
import { NotificationDropdown } from '@/components/NotificationDropdown';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
  user?: { email: string; name?: string };
  onSignOut?: () => void;
  onAIToggle?: () => void;
}

export function Header({ title, onMenuClick, user, onSignOut, onAIToggle }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TaskResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch tasks for notifications
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.tasks.list();
        setTasks(response.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input with debouncing
  useEffect(() => {
    if (!isSearchOpen || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await api.tasks.list({ q: searchQuery });
        setSearchResults(response.tasks);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, isSearchOpen]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page Title */}
        {title && (
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          {isSearchOpen ? (
            <div className="absolute right-0 top-10 mt-2 w-80 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full h-10 px-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search Results */}
              {(searchQuery.length >= 2 || isSearching) && (
                <div className="max-h-60 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <ul>
                      {searchResults.map((task) => (
                        <li key={task.id}>
                          <Link
                            href={`/dashboard/tasks?id=${task.id}`}
                            className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                              setSearchResults([]);
                            }}
                          >
                            <div className="font-medium text-gray-900 dark:text-white truncate">
                              {task.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {task.due_date ? `Due: ${new Date(task.due_date).toLocaleDateString()}` : 'No due date'}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : searchQuery.length >= 2 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No results found
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* AI Assistant Toggle */}
        {onAIToggle && (
          <button
            onClick={onAIToggle}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="AI Assistant"
            title="AI Assistant"
          >
            <Sparkles className="h-5 w-5" />
          </button>
        )}

        {/* Notifications */}
        <NotificationDropdown tasks={tasks} />

        {/* User Menu */}
        {user && (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <Avatar name={user.name || user.email} size="sm" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-scale-in">
                {/* User Info */}
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </div>

                {/* Sign Out */}
                {onSignOut && (
                  <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

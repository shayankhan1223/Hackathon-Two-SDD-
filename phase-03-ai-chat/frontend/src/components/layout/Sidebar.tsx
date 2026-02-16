'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  X,
  Sun,
  Moon,
  BarChart3,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  user?: { email: string; name?: string };
  onSignOut?: () => void;
}

const mainNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/dashboard/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/dashboard/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
];

const toolsNavItems = [
  { href: '/dashboard/chat', icon: Sparkles, label: 'AI Insights' },
];

const bottomNavItems = [
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({
  isCollapsed,
  onToggle,
  isMobileOpen = false,
  onMobileClose,
  user,
  onSignOut,
}: SidebarProps) {
  const { theme, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: { href: string; icon: typeof LayoutDashboard; label: string }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        key={item.href + item.label}
        href={item.href}
        onClick={onMobileClose}
        title={isCollapsed ? item.label : undefined}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
          active
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            : 'text-gray-700 dark:text-gray-300',
          isCollapsed && 'justify-center'
        )}
      >
        <Icon className={cn('h-5 w-5 shrink-0', active && 'text-blue-600 dark:text-blue-400')} />
        {!isCollapsed && (
          <span className="font-medium">{item.label}</span>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-gray-900 dark:text-white">
              TaskFlow
            </span>
          )}
        </Link>

        {/* Desktop Toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Mobile Close */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden flex items-center justify-center h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* Main Section */}
        <div>
          {!isCollapsed && (
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 mb-1">
              Main
            </p>
          )}
          <div className="space-y-1">
            {mainNavItems.map(renderNavItem)}
          </div>
        </div>

        {/* Tools Section */}
        <div>
          {!isCollapsed && (
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3 mb-1">
              Tools
            </p>
          )}
          <div className="space-y-1">
            {toolsNavItems.map(renderNavItem)}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        {bottomNavItems.map(renderNavItem)}
      </div>

      {/* Dark Mode Toggle */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors',
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
            isCollapsed && 'justify-center'
          )}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 shrink-0" />
          ) : (
            <Moon className="h-5 w-5 shrink-0" />
          )}
          {!isCollapsed && <span className="font-medium">Toggle Theme</span>}
        </button>
      </div>

      {/* User Section */}
      {user && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg',
              isCollapsed && 'justify-center'
            )}
          >
            <Avatar name={user.name || user.email} size="sm" />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            )}
            {!isCollapsed && onSignOut && (
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
          {isCollapsed && onSignOut && (
            <button
              onClick={onSignOut}
              className="w-full mt-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40',
          'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700',
          'transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl animate-slide-down">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}

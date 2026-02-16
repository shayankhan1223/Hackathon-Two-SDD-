'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AIChatSlideIn } from '@/components/chat/AIChatSlideIn';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { isAuthenticated, getUserEmail, clearAuth } from '@/lib/auth';
import { useAIPanel } from '@/hooks/useAIPanel';
import { cn } from '@/lib/utils';

// Map paths to page titles
const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/tasks': 'Tasks',
  '/dashboard/calendar': 'Calendar',
  '/dashboard/chat': 'Chat',
  '/dashboard/settings': 'Settings',
  '/dashboard/analytics': 'Analytics',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { isOpen: aiPanelOpen, togglePanel: toggleAIPanel, closePanel: closeAIPanel } = useAIPanel();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/sign-in');
      return;
    }

    // Get user email
    setUserEmail(getUserEmail());
    setIsLoading(false);

    // Load sidebar state from localStorage
    const savedState = localStorage.getItem('sidebar_collapsed');
    if (savedState) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, [router]);

  // Persist sidebar state
  const handleSidebarToggle = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', String(newState));
  };

  // Handle sign out
  const handleSignOut = () => {
    clearAuth();
    router.push('/sign-in');
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Auto-collapse sidebar on tablet
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px) and (max-width: 1024px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setSidebarCollapsed(true);
    };
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Close AI panel or mobile sidebar on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (aiPanelOpen) closeAIPanel();
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [aiPanelOpen, closeAIPanel, mobileMenuOpen]);

  // Get page title from pathname
  const pageTitle = pageTitles[pathname] || 'Dashboard';

  if (isLoading) {
    return <PageLoader label="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen min-w-[320px] bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        user={userEmail ? { email: userEmail } : undefined}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300',
          'lg:ml-64',
          sidebarCollapsed && 'lg:ml-16'
        )}
      >
        {/* Header */}
        <Header
          title={pageTitle}
          onMenuClick={() => setMobileMenuOpen(true)}
          user={userEmail ? { email: userEmail } : undefined}
          onSignOut={handleSignOut}
          onAIToggle={toggleAIPanel}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* AI Chat Slide-in Panel */}
      <AIChatSlideIn isOpen={aiPanelOpen} onClose={closeAIPanel} />
    </div>
  );
}

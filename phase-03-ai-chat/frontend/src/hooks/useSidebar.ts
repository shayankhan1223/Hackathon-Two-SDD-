import { useState, useEffect } from 'react';

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebar_collapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', String(newState));
  };

  const collapseSidebar = () => {
    setIsCollapsed(true);
    localStorage.setItem('sidebar_collapsed', 'true');
  };

  const expandSidebar = () => {
    setIsCollapsed(false);
    localStorage.setItem('sidebar_collapsed', 'false');
  };

  return {
    isCollapsed,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
  };
}

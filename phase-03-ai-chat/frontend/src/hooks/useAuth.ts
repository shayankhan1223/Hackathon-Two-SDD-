import { useState, useEffect } from 'react';
import { getAuthToken, getUser, clearAuth } from '@/lib/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      const userData = getUser();

      setIsAuthenticated(!!token);
      setUser(userData);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signOut = () => {
    clearAuth();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    signOut,
  };
}

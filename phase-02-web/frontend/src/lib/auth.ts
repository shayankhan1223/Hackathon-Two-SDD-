// Authentication utilities

export const setAuthToken = (token: string, userId: string, email?: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_id', userId);
    if (email) {
      localStorage.setItem('user_email', email);
    }
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

export const getUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_id');
  }
  return null;
};

export const getUserEmail = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_email');
  }
  return null;
};

export const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && !!getUserId();
};

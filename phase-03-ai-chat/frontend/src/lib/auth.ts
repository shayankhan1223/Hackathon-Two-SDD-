/**
 * Authentication utilities for client-side auth state management
 * Uses localStorage to persist JWT token and user info
 */

const TOKEN_KEY = 'taskflow_token';
const USER_ID_KEY = 'taskflow_user_id';
const USER_EMAIL_KEY = 'taskflow_user_email';

/**
 * Check if running in browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Store authentication token and user info
 */
export function setAuthToken(
  token: string,
  userId: string,
  email?: string
): void {
  if (!isBrowser()) return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, userId);
  if (email) {
    localStorage.setItem(USER_EMAIL_KEY, email);
  }
}

/**
 * Get the stored authentication token
 */
export function getAuthToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get the stored user ID
 */
export function getUserId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(USER_ID_KEY);
}

/**
 * Get the stored user email
 */
export function getUserEmail(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(USER_EMAIL_KEY);
}

/**
 * Check if user is authenticated (has a valid token)
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  // Optionally: Add JWT expiration check here
  // For now, just check if token exists
  return true;
}

/**
 * Clear all authentication data (logout)
 */
export function clearAuth(): void {
  if (!isBrowser()) return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
}

/**
 * Get user info object
 */
export function getUser(): { id: string; email: string } | null {
  const id = getUserId();
  const email = getUserEmail();

  if (!id) return null;

  return {
    id,
    email: email || '',
  };
}

// Authenticated API client for backend requests

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

import {
  getAuthToken,
  setAuthToken as setAuthTokenLib,
  clearAuth,
} from "./auth";

export { getAuthToken };

export function setAuthToken(token: string | null) {
  if (token) {
    setAuthTokenLib(token, "", "");
  } else {
    clearAuth();
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(error.detail || `API error: ${res.status}`);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach the server. Please check your connection and ensure the backend is running.');
    }
    throw error;
  }
}

// Auth endpoints
export const api = {
  auth: {
    register: (email: string, password: string) =>
      apiFetch<{ token: string; user: { id: string; email: string; created_at: string } }>(
        "/api/auth/register",
        { method: "POST", body: JSON.stringify({ email, password }) }
      ),
    login: (email: string, password: string) =>
      apiFetch<{ token: string; user: { id: string; email: string; created_at: string } }>(
        "/api/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) }
      ),
    me: () => apiFetch<{ id: string; email: string; created_at: string }>("/api/auth/me"),
    forgotPassword: (email: string) =>
      apiFetch<{ message: string }>(
        "/api/auth/forgot-password",
        { method: "POST", body: JSON.stringify({ email }) }
      ),
    resetPassword: (token: string, newPassword: string) =>
      apiFetch<{ message: string }>(
        "/api/auth/reset-password",
        { method: "POST", body: JSON.stringify({ token, new_password: newPassword }) }
      ),
    changePassword: (currentPassword: string, newPassword: string) =>
      apiFetch<{ message: string }>(
        "/api/auth/change-password",
        { method: "POST", body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }) }
      ),
  },

  tasks: {
    list: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return apiFetch<{ tasks: import("./types").TaskResponse[]; total: number }>(
        `/api/tasks${query}`
      );
    },
    get: (id: string) =>
      apiFetch<import("./types").TaskResponse>(`/api/tasks/${id}`),
    create: (data: import("./types").TaskCreateRequest) =>
      apiFetch<import("./types").TaskResponse>("/api/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: import("./types").TaskUpdateRequest) =>
      apiFetch<import("./types").TaskResponse>(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiFetch<void>(`/api/tasks/${id}`, { method: "DELETE" }),
    complete: (id: string) =>
      apiFetch<import("./types").TaskResponse>(`/api/tasks/${id}/complete`, {
        method: "POST",
      }),
  },

  tags: {
    list: () =>
      apiFetch<import("./types").TagResponse[]>("/api/tags"),
  },

  calendar: {
    month: (year: number, month: number) =>
      apiFetch<import("./types").CalendarMonthResponse>(
        `/api/calendar/month?year=${year}&month=${month}`
      ),
    day: (date: string) =>
      apiFetch<import("./types").CalendarDayResponse>(
        `/api/calendar/day?date=${date}`
      ),
  },

  chat: {
    send: (message: string, threadId?: string) =>
      apiFetch<import("./types").ChatResponse>("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message, thread_id: threadId }),
      }),
    history: (limit = 50) =>
      apiFetch<{ messages: import("./types").ChatMessage[] }>(
        `/api/chat/history?limit=${limit}`
      ),
  },

  user: {
    preferences: {
      get: () => apiFetch<import("./types").UserPreferences>("/api/user/preferences"),
      update: (data: Partial<import("./types").UserPreferences>) =>
        apiFetch<import("./types").UserPreferences>("/api/user/preferences", {
          method: "PATCH",
          body: JSON.stringify(data),
        }),
    },
  },
};

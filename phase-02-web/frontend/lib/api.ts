import { Task, CreateTaskRequest, UpdateTaskRequest, ApiError } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
          error_code: 'UNKNOWN_ERROR',
          status_code: response.status,
        }));
        throw new Error(errorData.detail);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTasks(): Promise<Task[]> {
    const response = await this.request<{ tasks: Task[]; count: number }>('/tasks', {
      method: 'GET',
    });
    return response.tasks;
  }

  async getTask(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'GET',
    });
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskCompletion(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  }
}

export const apiClient = new ApiClient();

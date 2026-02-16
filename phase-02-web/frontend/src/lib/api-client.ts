import axios, { AxiosInstance } from 'axios';
import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  UserProfile,
  Task,
  TaskListResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to sign-in
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API (T013, T014, T015)
export const authAPI = {
  // T013: Renamed from signUp to register, calling /api/auth/register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  // T014: Renamed from signIn to login, calling /api/auth/login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  // T015: New method to get current user profile
  me: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/api/auth/me');
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  listTasks: async (userId: string): Promise<TaskListResponse> => {
    const response = await apiClient.get<TaskListResponse>(`/api/${userId}/tasks`);
    return response.data;
  },

  getTask: async (userId: string, taskId: string): Promise<Task> => {
    const response = await apiClient.get<Task>(`/api/${userId}/tasks/${taskId}`);
    return response.data;
  },

  createTask: async (userId: string, data: CreateTaskRequest): Promise<Task> => {
    const response = await apiClient.post<Task>(`/api/${userId}/tasks`, data);
    return response.data;
  },

  updateTask: async (userId: string, taskId: string, data: UpdateTaskRequest): Promise<Task> => {
    const response = await apiClient.put<Task>(`/api/${userId}/tasks/${taskId}`, data);
    return response.data;
  },

  deleteTask: async (userId: string, taskId: string): Promise<void> => {
    await apiClient.delete(`/api/${userId}/tasks/${taskId}`);
  },

  toggleComplete: async (userId: string, taskId: string, currentCompleted: boolean): Promise<Task> => {
    // Use PUT to update the completed field
    const response = await apiClient.put<Task>(`/api/${userId}/tasks/${taskId}`, {
      completed: !currentCompleted,
    });
    return response.data;
  },
};

export default apiClient;

// TypeScript types for the application

export interface User {
  id: string;
  email: string;
  created_at: string;
}

// T012: UserProfile interface matching spec v1.2
export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// T011: Updated AuthResponse to match spec v1.2 contract
export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// Request types for registration and login
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Legacy aliases for backward compatibility during transition
export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
}

export interface TaskListResponse {
  tasks: Task[];
  count: number;
}

export interface ErrorResponse {
  detail: string;
  error_code: string;
  status_code: number;
}

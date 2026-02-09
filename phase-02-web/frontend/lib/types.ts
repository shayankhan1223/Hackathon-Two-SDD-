export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
}

export interface ApiError {
  detail: string;
  error_code: string;
  status_code: number;
}

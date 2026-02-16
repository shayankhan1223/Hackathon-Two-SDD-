// TypeScript types matching OpenAPI schema

export type Priority = "high" | "medium" | "low";
export type TaskStatus = "pending" | "completed";

export interface TagResponse {
  id: string;
  name: string;
}

export interface TaskResponse {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string;
  priority: Priority;
  status: TaskStatus;
  tags: TagResponse[];
  created_at: string;
  updated_at: string;
}

export interface TaskListResponse {
  tasks: TaskResponse[];
  total: number;
}

export interface TaskCreateRequest {
  title: string;
  description?: string | null;
  due_date: string;
  priority?: Priority;
  tag_ids?: string[];
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string | null;
  due_date?: string;
  priority?: Priority;
  status?: TaskStatus;
  tag_ids?: string[];
}

export interface CalendarMonthResponse {
  year: number;
  month: number;
  dates_with_tasks: string[];
}

export interface CalendarDayResponse {
  date: string;
  pending_tasks: TaskResponse[];
  completed_tasks: TaskResponse[];
}

export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatResponse {
  response: string;
  thread_id: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  tag_ids?: string[];
  search?: string;
  due_date_from?: string;
  due_date_to?: string;
  sort_by?: "due_date" | "priority" | "title";
  sort_order?: "asc" | "desc";
}

export interface UserPreferences {
  id: number;
  user_id: string;
  display_name: string | null;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  email_notifications: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}

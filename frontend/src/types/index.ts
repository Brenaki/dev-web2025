export interface User {
  usr_id: number;
  usr_email: string;
  usr_username: string;
  usr_created_at: Date;
  usr_updated_at: Date | null;
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Subtask {
  stb_id: number;
  stb_title: string;
  stb_done: boolean;
  stb_fk_task?: number;
}

export interface Task {
  tks_id: number;
  tks_title: string;
  tks_done: boolean;
  tks_priority: Priority;
  subtasks: Subtask[];
  tks_user: User;
  tks_created_at: Date;
  tks_updated_at: Date | null;
}

export interface CreateTaskDto {
  tks_title: string;
  tks_done: boolean;
  tks_fk_user: number;
  tks_priority?: Priority;
  subtasks?: { stb_title: string; stb_done?: boolean }[];
}

export interface UpdateTaskDto {
  tks_title?: string;
  tks_done?: boolean;
  tks_priority?: Priority;
  subtasks?: { stb_title: string; stb_done?: boolean }[];
}

export interface CreateUserDto {
  usr_email: string;
  usr_username: string;
  usr_password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

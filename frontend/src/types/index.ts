export interface User {
  usr_id: number;
  usr_email: string;
  usr_username: string;
  usr_created_at: Date;
  usr_updated_at: Date | null;
}

export interface Task {
  tks_id: number;
  tks_title: string;
  tks_done: boolean;
  tks_user: User;
  tks_created_at: Date;
  tks_updated_at: Date | null;
}

export interface CreateTaskDto {
  tks_title: string;
  tks_done: boolean;
  tks_fk_user: number;
}

export interface UpdateTaskDto {
  tks_title?: string;
  tks_done?: boolean;
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

import { createContext } from 'react';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  monthlyChange: number;
}

export interface TaskContextType {
  tasks: Task[];
  stats: TaskStats;
  isLoading: boolean;
  error: string | null;
  isSyncing: boolean;
  lastSync: Date | null;
  loadTasks: () => Promise<void>;
  createTask: (taskData: CreateTaskDto) => Promise<Task>;
  updateTask: (id: number, taskData: UpdateTaskDto) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  refreshStats: () => void;
  manualSync: () => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

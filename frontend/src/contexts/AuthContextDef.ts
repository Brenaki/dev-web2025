import { createContext } from 'react';
import type { User } from '../types';
import { StorageService } from '../services/storage.service';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  sessionInfo: ReturnType<typeof StorageService.getSessionInfo>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

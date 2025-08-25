import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/api';
import { StorageService } from '../services/storage.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  sessionInfo: ReturnType<typeof StorageService.getSessionInfo>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(StorageService.getSessionInfo());

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar se há dados salvos com hash
        const savedUser = StorageService.getUser();
        
        if (savedUser) {
          setUser(savedUser);
          
          // Verificar se precisa renovar a sessão
          if (StorageService.shouldRenewSession()) {
            try {
              const userData = await authService.getProfile();
              StorageService.saveUser(userData, StorageService.getToken()!);
              setUser(userData);
            } catch (error) {
              console.warn('Falha ao renovar sessão, mantendo dados locais');
            }
          }
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        StorageService.clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Atualizar informações da sessão periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionInfo(StorageService.getSessionInfo());
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      StorageService.saveUser(response.user, response.access_token);
      setUser(response.user);
      setSessionInfo(StorageService.getSessionInfo());
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      await authService.register({ usr_email: email, usr_username: username, usr_password: password });
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      StorageService.clearUser();
      setUser(null);
      setSessionInfo(StorageService.getSessionInfo());
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    sessionInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

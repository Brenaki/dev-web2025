import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/api';
import { StorageService } from '../services/storage.service';
import { AuthContext, type AuthContextType } from './AuthContextDef';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
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
            } catch {
              // Falha ao renovar sessão, mantendo dados locais
            }
          }
        }
      } catch (_error) {
        console.error('Erro na inicialização da autenticação:', _error);
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
    const response = await authService.login({ email, password });
    StorageService.saveUser(response.user, response.access_token);
    setUser(response.user);
    setSessionInfo(StorageService.getSessionInfo());
  };

  const register = async (email: string, username: string, password: string) => {
    await authService.register({ usr_email: email, usr_username: username, usr_password: password });
    await login(email, password);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (_error) {
      console.error('Erro ao fazer logout:', _error);
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

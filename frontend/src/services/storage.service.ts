import { createUserHash, verifyUserDataIntegrity } from '../lib/utils';
import type { User } from '../types';

interface StoredUserData {
  user: User;
  hash: string;
  timestamp: number;
  expiresAt: number;
}

export class StorageService {
  private static readonly USER_KEY = 'user_data';
  private static readonly TOKEN_KEY = 'access_token';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas em ms

  // Salvar dados do usuário com hash
  static saveUser(user: User, token: string): void {
    try {
      const hash = createUserHash(user);
      const timestamp = Date.now();
      const expiresAt = timestamp + this.SESSION_DURATION;

      const userData: StoredUserData = {
        user,
        hash,
        timestamp,
        expiresAt
      };

      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      localStorage.setItem(this.TOKEN_KEY, token);

      console.log('Usuário salvo com hash:', hash);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      throw new Error('Falha ao salvar dados do usuário');
    }
  }

  // Recuperar dados do usuário com verificação de integridade
  static getUser(): User | null {
    try {
      const userDataStr = localStorage.getItem(this.USER_KEY);
      const token = localStorage.getItem(this.TOKEN_KEY);

      if (!userDataStr || !token) {
        return null;
      }

      const userData: StoredUserData = JSON.parse(userDataStr);

      // Verificar se a sessão expirou
      if (Date.now() > userData.expiresAt) {
        console.log('Sessão expirada, limpando dados');
        this.clearUser();
        return null;
      }

      // Verificar integridade dos dados
      if (!verifyUserDataIntegrity(userData.user, userData.hash)) {
        console.warn('Dados do usuário foram modificados, limpando');
        this.clearUser();
        return null;
      }

      return userData.user;
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      this.clearUser();
      return null;
    }
  }

  // Recuperar token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Verificar se o usuário está autenticado
  static isAuthenticated(): boolean {
    const user = this.getUser();
    const token = this.getToken();
    return !!(user && token);
  }

  // Verificar se a sessão está ativa
  static isSessionActive(): boolean {
    try {
      const userDataStr = localStorage.getItem(this.USER_KEY);
      if (!userDataStr) return false;

      const userData: StoredUserData = JSON.parse(userDataStr);
      return Date.now() <= userData.expiresAt;
    } catch {
      return false;
    }
  }

  // Renovar sessão
  static renewSession(): void {
    try {
      const userDataStr = localStorage.getItem(this.USER_KEY);
      if (!userDataStr) return;

      const userData: StoredUserData = JSON.parse(userDataStr);
      const newExpiresAt = Date.now() + this.SESSION_DURATION;

      const updatedUserData: StoredUserData = {
        ...userData,
        expiresAt: newExpiresAt
      };

      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUserData));
      console.log('Sessão renovada até:', new Date(newExpiresAt));
    } catch (error) {
      console.error('Erro ao renovar sessão:', error);
    }
  }

  // Limpar dados do usuário
  static clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    console.log('Dados do usuário limpos');
  }

  // Obter informações da sessão
  static getSessionInfo(): { isActive: boolean; expiresAt: Date | null; timeLeft: number | null } {
    try {
      const userDataStr = localStorage.getItem(this.USER_KEY);
      if (!userDataStr) {
        return { isActive: false, expiresAt: null, timeLeft: null };
      }

      const userData: StoredUserData = JSON.parse(userDataStr);
      const now = Date.now();
      const isActive = now <= userData.expiresAt;
      const timeLeft = isActive ? userData.expiresAt - now : null;

      return {
        isActive,
        expiresAt: new Date(userData.expiresAt),
        timeLeft
      };
    } catch {
      return { isActive: false, expiresAt: null, timeLeft: null };
    }
  }

  // Verificar se precisa renovar a sessão (renovar se faltar menos de 1 hora)
  static shouldRenewSession(): boolean {
    const sessionInfo = this.getSessionInfo();
    if (!sessionInfo.isActive || !sessionInfo.timeLeft) return false;
    
    const oneHour = 60 * 60 * 1000; // 1 hora em ms
    return sessionInfo.timeLeft < oneHour;
  }
}

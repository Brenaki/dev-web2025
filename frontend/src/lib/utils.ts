import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para criar uma hash simples dos dados do usuário
export function createUserHash(userData: any): string {
  const userString = JSON.stringify(userData);
  let hash = 0;
  
  if (userString.length === 0) return hash.toString();
  
  for (let i = 0; i < userString.length; i++) {
    const char = userString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString();
}

// Função para verificar se os dados do usuário foram modificados
export function verifyUserDataIntegrity(userData: any, storedHash: string): boolean {
  const currentHash = createUserHash(userData);
  return currentHash === storedHash;
}

// Função para gerar um ID único para o usuário
export function generateUserId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const SYNC_CONFIG = {
  // Intervalo de sincronização automática (em milissegundos)
  AUTO_SYNC_INTERVAL: 30000, // 30 segundos
  
  // Intervalo de verificação de sessão (em milissegundos)
  SESSION_CHECK_INTERVAL: 60000, // 1 minuto
  
  // Timeout para requisições de sincronização (em milissegundos)
  SYNC_TIMEOUT: 10000, // 10 segundos
  
  // Número máximo de tentativas de sincronização
  MAX_SYNC_RETRIES: 3,
  
  // Delay entre tentativas de sincronização (em milissegundos)
  RETRY_DELAY: 2000, // 2 segundos
} as const;

export type SyncConfig = typeof SYNC_CONFIG;

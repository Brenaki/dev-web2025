import React from 'react';
import { RefreshCw } from 'lucide-react';

interface SyncIndicatorProps {
  isSyncing: boolean;
  lastSync?: Date | null;
}

const SyncIndicator: React.FC<SyncIndicatorProps> = ({ isSyncing, lastSync }) => {
  return (
    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
      <RefreshCw 
        className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} 
      />
      <span>
        {isSyncing ? 'Sincronizando...' : 'Sincronizado'}
      </span>
      {lastSync && !isSyncing && (
        <span>
          • {lastSync.toLocaleTimeString('pt-BR')}
        </span>
      )}
    </div>
  );
};

export default SyncIndicator;

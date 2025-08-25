import { useMemo } from 'react';
import { useTask } from '../contexts/TaskContext';

export const useTaskStats = () => {
  const { tasks, stats, isLoading, error, isSyncing, lastSync } = useTask();

  const enhancedStats = useMemo(() => {
    const total = stats.total;
    const completed = stats.completed;
    const pending = stats.pending;
    const completionRate = stats.completionRate;
    
    // Calcular tendências
    const isImproving = completionRate > 50;
    const needsAttention = pending > completed;
    const isProductive = completed > 0;
    
    // Calcular progresso
    const progress = total > 0 ? (completed / total) * 100 : 0;
    
    // Status geral
    const status = total === 0 ? 'empty' : 
                   completionRate === 100 ? 'completed' :
                   completionRate > 75 ? 'excellent' :
                   completionRate > 50 ? 'good' :
                   completionRate > 25 ? 'fair' : 'needs-improvement';

    return {
      ...stats,
      progress,
      isImproving,
      needsAttention,
      isProductive,
      status,
      // Formatação para exibição
      formattedStats: {
        total: total.toLocaleString('pt-BR'),
        completed: completed.toLocaleString('pt-BR'),
        pending: pending.toLocaleString('pt-BR'),
        completionRate: `${completionRate}%`,
        progress: `${progress.toFixed(1)}%`
      }
    };
  }, [stats]);

  return {
    tasks,
    stats: enhancedStats,
    isLoading,
    error,
    isSyncing,
    lastSync,
    // Helpers
    hasTasks: tasks.length > 0,
    isEmpty: tasks.length === 0,
    hasCompletedTasks: stats.completed > 0,
    hasPendingTasks: stats.pending > 0,
  };
};

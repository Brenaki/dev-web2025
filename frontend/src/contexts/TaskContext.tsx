import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types';
import { taskService } from '../services/api';
import { SYNC_CONFIG } from '../config/sync.config';
import { TaskContext, type TaskContextType, type TaskStats } from './TaskContextDef';

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
    monthlyChange: 0,
  });

  // Função para calcular estatísticas
  const calculateStats = useCallback((taskList: Task[]) => {
    const total = taskList.length;
    const completed = taskList.filter(task => task.tks_done).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calcular mudança mensal (simulado por enquanto)
    const monthlyChange = 0; // TODO: Implementar cálculo real baseado em dados históricos
    
    return {
      total,
      completed,
      pending,
      completionRate,
      monthlyChange,
    };
  }, []);

  // Função para carregar tarefas com retry
  const loadTasksWithRetry = useCallback(async (retryCount = 0): Promise<void> => {
    try {
      setIsSyncing(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SYNC_CONFIG.SYNC_TIMEOUT);
      
      const tasksData = await taskService.getAllTasks();
      clearTimeout(timeoutId);
      
      setTasks(tasksData);
      
      // Calcular estatísticas
      const newStats = calculateStats(tasksData);
      setStats(newStats);
      
      // Atualizar timestamp da última sincronização
      setLastSync(new Date());
    } catch (error: unknown) {
      const err = error as { name?: string };
      console.error(`Erro ao carregar tarefas (tentativa ${retryCount + 1}):`, error);
      
      if (retryCount < SYNC_CONFIG.MAX_SYNC_RETRIES && err.name !== 'AbortError') {
        // Tentar novamente após um delay
        setTimeout(() => {
          loadTasksWithRetry(retryCount + 1);
        }, SYNC_CONFIG.RETRY_DELAY);
        return;
      }
      
      setError('Erro ao carregar tarefas');
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [calculateStats]);

  // Função para carregar tarefas
  const loadTasks = useCallback(async () => {
    await loadTasksWithRetry();
  }, [loadTasksWithRetry]);

  // Função para sincronização manual
  const manualSync = useCallback(async () => {
    await loadTasksWithRetry();
  }, [loadTasksWithRetry]);

  // Função para criar tarefa
  const createTask = useCallback(async (taskData: CreateTaskDto) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      
      // Recalcular estatísticas
      const newStats = calculateStats([newTask, ...tasks]);
      setStats(newStats);
      
      return newTask;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  }, [tasks, calculateStats]);

  // Função para atualizar tarefa
  const updateTask = useCallback(async (id: number, taskData: UpdateTaskDto) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks(prev => prev.map(task => 
        task.tks_id === id ? updatedTask : task
      ));
      
      // Recalcular estatísticas
      const updatedTasks = tasks.map(task => 
        task.tks_id === id ? updatedTask : task
      );
      const newStats = calculateStats(updatedTasks);
      setStats(newStats);
      
      return updatedTask;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  }, [tasks, calculateStats]);

  // Função para deletar tarefa
  const deleteTask = useCallback(async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.tks_id !== id));
      
      // Recalcular estatísticas
      const updatedTasks = tasks.filter(task => task.tks_id !== id);
      const newStats = calculateStats(updatedTasks);
      setStats(newStats);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    }
  }, [tasks, calculateStats]);

  // Função para atualizar estatísticas
  const refreshStats = useCallback(() => {
    const newStats = calculateStats(tasks);
    setStats(newStats);
  }, [tasks, calculateStats]);

  // Carregar tarefas na inicialização
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Atualizar dados automaticamente a cada intervalo configurado
  useEffect(() => {
    const interval = setInterval(() => {
      loadTasks();
    }, SYNC_CONFIG.AUTO_SYNC_INTERVAL);

    return () => clearInterval(interval);
  }, [loadTasks]);

  // Atualizar estatísticas sempre que as tarefas mudarem
  useEffect(() => {
    const newStats = calculateStats(tasks);
    setStats(newStats);
  }, [tasks, calculateStats]);

  const value: TaskContextType = {
    tasks,
    stats,
    isLoading,
    error,
    isSyncing,
    lastSync,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    refreshStats,
    manualSync,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

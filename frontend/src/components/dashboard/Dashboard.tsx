import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTask } from '../../contexts/TaskContext';
import { useTaskStats } from '../../hooks/useTaskStats';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { CheckSquare, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import TaskList from '../tasks/TaskList';
import SyncIndicator from '../ui/SyncIndicator';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isSyncing, lastSync, manualSync } = useTask();
  const { stats, isLoading, hasTasks, hasPendingTasks } = useTaskStats();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">
          Bem-vindo, {user?.usr_username}! 👋
        </h1>
        <p className="text-xl text-muted-foreground">
          Gerencie suas tarefas de forma simples e eficiente
        </p>
        
        {/* Sync Indicator */}
        <div className="mt-4 flex items-center justify-center">
          <SyncIndicator isSyncing={isSyncing} lastSync={lastSync} />
          <button
            onClick={manualSync}
            disabled={isSyncing}
            className="ml-2 p-1 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
            title="Sincronizar manualmente"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.formattedStats.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.monthlyChange >= 0 ? '+' : ''}{stats.monthlyChange}% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.formattedStats.completed}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.formattedStats.completionRate} de conclusão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.formattedStats.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              {hasPendingTasks ? 'Requerem sua atenção' : 'Nenhuma pendente'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {hasTasks && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso Geral</span>
                <span>{stats.formattedStats.progress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stats.status === 'excellent' ? 'bg-green-500' :
                    stats.status === 'good' ? 'bg-blue-500' :
                    stats.status === 'fair' ? 'bg-yellow-500' :
                    stats.status === 'needs-improvement' ? 'bg-red-500' :
                    'bg-gray-300'
                  }`}
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {stats.status === 'empty' && 'Comece criando sua primeira tarefa!'}
                {stats.status === 'completed' && 'Parabéns! Todas as tarefas foram concluídas!'}
                {stats.status === 'excellent' && 'Excelente progresso! Continue assim!'}
                {stats.status === 'good' && 'Bom trabalho! Você está no caminho certo!'}
                {stats.status === 'fair' && 'Continue focado! Você pode melhorar!'}
                {stats.status === 'needs-improvement' && 'Hora de focar nas tarefas pendentes!'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Section */}
      <TaskList />
    </div>
  );
};

export default Dashboard;

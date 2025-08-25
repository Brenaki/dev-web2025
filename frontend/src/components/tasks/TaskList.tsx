import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTask } from '../../contexts/TaskContext';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import TaskItem from './TaskItem';
import CreateTaskModal from './CreateTaskModal';

const TaskList: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();
  const { tasks, isLoading, error } = useTask();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando tarefas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Minhas Tarefas</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Nova Tarefa
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhuma tarefa encontrada. Crie sua primeira tarefa!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.tks_id}
              task={task}
            />
          ))}
        </div>
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        userId={user?.usr_id || 0}
      />
    </div>
  );
};

export default TaskList;

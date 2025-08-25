import React, { useState } from 'react';
import { useTask } from '../../contexts/TaskContext';
import type { Task } from '../../types';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Check, Edit, Trash2, X, Save } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.tks_title);
  const [isLoading, setIsLoading] = useState(false);
  const { updateTask, deleteTask } = useTask();

  const handleToggleDone = async () => {
    try {
      setIsLoading(true);
      await updateTask(task.tks_id, {
        tks_done: !task.tks_done
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (title.trim() === '') return;
    
    try {
      setIsLoading(true);
      await updateTask(task.tks_id, {
        tks_title: title.trim()
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    
    try {
      setIsLoading(true);
      await deleteTask(task.tks_id);
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.tks_title);
    setIsEditing(false);
  };

  return (
    <Card className={`transition-all ${task.tks_done ? 'opacity-75' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleDone}
            disabled={isLoading}
            className={`h-6 w-6 rounded-full border-2 ${
              task.tks_done 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'border-gray-300'
            }`}
          >
            {task.tks_done && <Check className="h-4 w-4" />}
          </Button>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                autoFocus
              />
            ) : (
              <h3 className={`text-lg font-medium ${
                task.tks_done ? 'line-through text-muted-foreground' : ''
              }`}>
                {task.tks_title}
              </h3>
            )}
            
            <p className="text-sm text-muted-foreground">
              Criada em {new Date(task.tks_created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="h-8 w-8"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;

import React, { useState, useMemo, useEffect } from 'react';
import { useTask } from '../../contexts/useTask';
import type { Task } from '../../types';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Check, Edit, Trash2, X, Save } from 'lucide-react';
import { CongratulationsModal } from './CongratulationsModal';

interface TaskItemProps {
  task: Task;
}

const priorityStyle: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW: 'bg-green-100 text-green-700 border-green-200',
};

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.tks_title);
  const [isLoading, setIsLoading] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const { updateTask, deleteTask } = useTask();
  const [localSubtasks, setLocalSubtasks] = useState(task.subtasks || []);
  const [areAllSubtasksDone, setAreAllSubtasksDone] = useState(false);

  useEffect(() => {
    setLocalSubtasks(task.subtasks || []);
  }, [task.subtasks]);

  useEffect(() => {
    setAreAllSubtasksDone(localSubtasks.length > 0 && localSubtasks.every(s => s.stb_done));
  }, [localSubtasks]);

  const { total, done, percent } = useMemo(() => {
    const total = task.subtasks?.length || 0;
    const done = task.subtasks?.filter(s => s.stb_done).length || 0;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [task.subtasks]);

  const handleToggleDone = async () => {
    try {
      setIsLoading(true);
      const wasCompleted = task.tks_done;
      await updateTask(task.tks_id, {
        tks_done: !task.tks_done
      });

      // Mostra o modal apenas quando a tarefa é marcada como completa
      if (!wasCompleted) {
        setShowCongratulations(true);
      }
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

  const persistSubtasks = async (next: typeof localSubtasks) => {
    try {
      setIsLoading(true);
      setLocalSubtasks(next);
      const hasAnySubtasks = next.length > 0;
      const allDone = hasAnySubtasks && next.every((s) => s.stb_done);
      await updateTask(task.tks_id, {
        subtasks: next.map((s) => ({ stb_title: s.stb_title, stb_done: s.stb_done })),
        ...(task.tks_done !== allDone ? { tks_done: allDone } : {}),
      });
      if (!task.tks_done && allDone) {
        setShowCongratulations(true);
      }
    } catch (error) {
      console.error('Erro ao atualizar subtarefas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubtask = async (subtaskId: number) => {
    const next = localSubtasks.map((s) =>
      s.stb_id === subtaskId ? { ...s, stb_done: !s.stb_done } : s
    );
    await persistSubtasks(next);
  };

  const changeSubtaskTitle = (subtaskId: number, value: string) => {
    setLocalSubtasks((prev) => prev.map((s) => (s.stb_id === subtaskId ? { ...s, stb_title: value } : s)));
  };

  const saveSubtaskTitle = async () => {
    await persistSubtasks(localSubtasks);
  };

  const removeSubtask = async (subtaskId: number) => {
    const next = localSubtasks.filter((s) => s.stb_id !== subtaskId);
    await persistSubtasks(next);
  };

  const addSubtask = async () => {
    const next = [
      ...localSubtasks,
      { stb_id: Date.now(), stb_title: '', stb_done: false },
    ];
    setLocalSubtasks(next);
  };

  return (
    <>
      <Card className={`transition-all ${task.tks_done ? 'opacity-75' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleDone}
              disabled={isLoading}
              className={`h-6 w-6 rounded-full border-2 ${task.tks_done || areAllSubtasksDone
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-gray-300'
                }`}
            >
              {(task.tks_done || areAllSubtasksDone) && <Check className="h-4 w-4" />}
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
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
                  <h3 className={`text-lg font-medium ${task.tks_done || areAllSubtasksDone ? 'line-through text-muted-foreground' : ''
                    }`}>
                    {task.tks_title}
                  </h3>
                )}

                {/* Badge de prioridade */}
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${priorityStyle[task.tks_priority] || ''}`}>
                  {task.tks_priority === 'URGENT' && 'Urgente'}
                  {task.tks_priority === 'HIGH' && 'Alta'}
                  {task.tks_priority === 'MEDIUM' && 'Média'}
                  {task.tks_priority === 'LOW' && 'Baixa'}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                Criada em {new Date(task.tks_created_at).toLocaleDateString('pt-BR')}
              </p>

              {/* Barra de progresso por subtasks */}
              { (task.subtasks && task.subtasks.length > 0) && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progresso</span>
                    <span>{done}/{total} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Lista de subtarefas com edição e conclusão */}
              <div className="mt-8 space-y-2">
                <div className="flex flex-col gap-2 items-start">
                  <span className="text-sm font-medium">Subtarefas</span>
                  <Button type="button" variant="outline" size="sm" onClick={addSubtask} disabled={isLoading}>
                    Adicionar
                  </Button>
                </div>
                {localSubtasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nenhuma subtarefa. Adicione a primeira.</p>
                ) : (
                  <div className="space-y-2">
                    {localSubtasks.map((s) => (
                      <div key={s.stb_id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={!!s.stb_done}
                          onChange={() => toggleSubtask(s.stb_id)}
                          disabled={isLoading}
                        />
                        <Input
                          value={s.stb_title}
                          onChange={(e) => changeSubtaskTitle(s.stb_id, e.target.value)}
                          onBlur={saveSubtaskTitle}
                          placeholder="Título da subtarefa"
                          className="flex-1 h-8"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeSubtask(s.stb_id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
      <CongratulationsModal
        isOpen={showCongratulations}
        onClose={() => setShowCongratulations(false)}
        taskTitle={task.tks_title} />
    </>
  );
};

export default TaskItem;

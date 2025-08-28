import React, { useState } from 'react';
import { useTask } from '../../contexts/useTask';
import type { CreateTaskDto, Priority } from '../../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { X } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { createTask } = useTask();
  const [subtasks, setSubtasks] = useState<{ id: number; title: string; done: boolean }[]>([]);

  const addSubtask = () => {
    setSubtasks((prev) => [
      ...prev,
      { id: Date.now(), title: '', done: false },
    ]);
  };

  const removeSubtask = (id: number) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSubtaskTitle = (id: number, value: string) => {
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, title: value } : s)));
  };

  const toggleSubtaskDone = (id: number) => {
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;

    try {
      setIsLoading(true);
      setError('');
      
      const taskData: CreateTaskDto = {
        tks_title: title.trim(),
        tks_done: false,
        tks_fk_user: userId,
        tks_priority: priority,
        ...(subtasks.length > 0
          ? {
              subtasks: subtasks
                .filter((s) => s.title.trim() !== '')
                .map((s) => ({ stb_title: s.title.trim(), stb_done: s.done })),
            }
          : {}),
      };

      await createTask(taskData);
      setTitle('');
      setPriority('MEDIUM');
      setSubtasks([]);
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao criar tarefa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setPriority('MEDIUM');
    setSubtasks([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Nova Tarefa</CardTitle>
            <CardDescription>
              Crie uma nova tarefa para sua lista
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <Input
              label="Título da Tarefa"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              required
              autoFocus
            />

            <div className="space-y-1">
              <label className="text-sm font-medium">Prioridade</label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>

            {/* Subtasks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Subtarefas</label>
                <Button type="button" variant="outline" size="sm" onClick={addSubtask}>
                  Adicionar subtarefa
                </Button>
              </div>

              {subtasks.length > 0 && (
                <div className="space-y-2">
                  {subtasks.map((s) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={s.done}
                        onChange={() => toggleSubtaskDone(s.id)}
                        className="h-4 w-4"
                      />
                      <Input
                        value={s.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSubtaskTitle(s.id, e.target.value)}
                        placeholder="Título da subtarefa"
                        className="flex-1 h-8"
                      />
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSubtask(s.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || title.trim() === ''}
            >
              {isLoading ? 'Criando...' : 'Criar Tarefa'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateTaskModal;

import { CreateTask, Task, TaskFilters, UpdateTask } from '../types.js';
import { BaseFetchAgent } from './BaseFetchAgent.js';

export class TasksFetchAgent extends BaseFetchAgent {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  getTasks = async (taskFilters?: TaskFilters): Promise<Task[]> => {
    let url = '/tasks';

    if (taskFilters) {
      const params = new URLSearchParams();

      for (const key in taskFilters) {
        const value = taskFilters[key as keyof TaskFilters];
        if (value !== undefined) params.append(key, String(value));
      }

      url += `?${params.toString()}`;
    }

    return this.fetchRequest(url);
  };

  createTask = async (newTask: CreateTask): Promise<Task> => {
    return this.fetchRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(newTask),
    });
  };

  getTask = async (taskId: number): Promise<Task> => {
    return this.fetchRequest(`/tasks/${taskId}`);
  };

  updateTask = async (id: number, updateTask: UpdateTask): Promise<Task> => {
    return this.fetchRequest(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateTask),
    });
  };

  deleteTask = async (taskId: number): Promise<Task> => {
    return this.fetchRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  };
}

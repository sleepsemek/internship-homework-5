const API_URL = 'https://tasks-service-maks1394.amvera.io';

type TaskFilters = {
  isImportant?: boolean;
  name_like?: string;
  isCompleted?: boolean;
};

type Task = {
  readonly id: number;
  name: string;
  info?: string;
  isImportant?: boolean;
  isCompleted?: boolean;
};

type CreateTask = Omit<Task, 'id'> & Required<Pick<Task, 'name'>>;

type UpdateTask = Partial<Omit<Task, 'id'>>;

type ApiError = {
  error: string;
};

function isApiError(responseBody: unknown): responseBody is ApiError {
  if (typeof responseBody !== 'object' || responseBody === null) return false;

  const responseBodyObject = responseBody as Record<string, unknown>;
  return typeof responseBodyObject.error === 'string';
}

class BaseFetchAgent {
  constructor(private _apiUrl: string) {}

  protected fetchRequest = async <ReturnDataType>(url: string, config: RequestInit = {}): Promise<ReturnDataType> => {
    const response = await fetch(`${this._apiUrl}${url}`, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
      },
    });

    let responseBody: unknown;

    try {
      responseBody = await response.json();
    } catch (error) {
      throw new Error('Ошибка при парсинге JSON'); // Вроде как невозможная ситуация, но мало ли
    }

    if (response.ok) {
      return responseBody as ReturnDataType;
    }

    if (isApiError(responseBody)) {
      throw new Error(`${response.status}: ${responseBody.error}`);
    }

    throw new Error('Неизвестная ошибка');
  };
}

class TasksFetchAgent extends BaseFetchAgent {
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

const taskFetchAgentInstance = new TasksFetchAgent(API_URL);

taskFetchAgentInstance.getTasks().then((data) => console.log(data));

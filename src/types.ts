export type TaskFilters = {
  isImportant?: boolean;
  name_like?: string;
  isCompleted?: boolean;
};

export type Task = {
  readonly id: number;
  name: string;
  info?: string;
  isImportant?: boolean;
  isCompleted?: boolean;
};

export type CreateTask = Omit<Task, 'id'> & Required<Pick<Task, 'name'>>;

export type UpdateTask = Partial<Omit<Task, 'id'>>;

export type ApiError = {
  error: string;
};

export function isApiError(responseBody: unknown): responseBody is ApiError {
  if (typeof responseBody !== 'object' || responseBody === null) return false;

  const responseBodyObject = responseBody as Record<string, unknown>;
  return typeof responseBodyObject.error === 'string';
}

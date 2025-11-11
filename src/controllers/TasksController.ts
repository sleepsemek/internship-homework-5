import { createTaskItem } from '../ui/taskItem.js';
import { TasksFetchAgent } from '../api/TasksFetchAgent.js';
import { CreateTask, Task, TaskFilters } from '../types.js';
import { debounceVoid } from '../helpers/debounceVoid.js';

export class TasksController {
  private tasks: Task[] = [];
  private filters: TaskFilters = {};

  private nameInput: HTMLInputElement | null;
  private importantCheckbox: HTMLInputElement | null;
  private completedCheckbox: HTMLInputElement | null;
  private readonly createTaskForm: HTMLFormElement | null;
  private readonly tasksListElement: HTMLElement | null;

  constructor(rootElement: HTMLElement | null, private tasksFetchAgent: TasksFetchAgent) {
    if (!rootElement) throw new Error('Сломана разметка');

    this.nameInput = rootElement.querySelector('[data-filter-name]');
    this.importantCheckbox = rootElement.querySelector('[data-filter-important]');
    this.completedCheckbox = rootElement.querySelector('[data-filter-completed]');
    this.createTaskForm = rootElement.querySelector('[data-create-task-form]');
    this.tasksListElement = rootElement.querySelector('[data-tasks-list]');

    this.bindEvents();
    void this.loadTasks();
  }

  private bindEvents(): void {
    this.nameInput?.addEventListener('input', this.debouncedHandleFiltersChange);
    this.importantCheckbox?.addEventListener('change', () => this.handleFiltersChange());
    this.completedCheckbox?.addEventListener('change', () => this.handleFiltersChange());
    this.createTaskForm?.addEventListener('submit', (e) => this.handleFormSubmit(e));
    this.tasksListElement?.addEventListener('click', (e) => this.handleTaskClick(e));
  }

  private async loadTasks(): Promise<void> {
    try {
      this.tasks = await this.tasksFetchAgent.getTasks(this.filters);
      this.renderTasks();
    } catch (error) {
      console.log(error);
    }
  }

  private debouncedHandleFiltersChange = debounceVoid(() => this.handleFiltersChange(), 500);

  private handleFiltersChange(): void {
    this.filters = {
      name_like: this.nameInput?.value.trim() || undefined,
      isImportant: this.importantCheckbox?.checked || undefined,
      isCompleted: this.completedCheckbox?.checked || undefined,
    };
    void this.loadTasks();
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.createTaskForm) throw new Error('Сломана разметка');

    const formData = new FormData(this.createTaskForm);
    const newTask: CreateTask = {
      name: formData.get('name') as string,
      info: (formData.get('info') as string) || undefined,
      isImportant: Boolean(formData.get('isImportant')),
      isCompleted: false,
    };

    try {
      await this.tasksFetchAgent.createTask(newTask);
      this.createTaskForm?.reset();
      await this.loadTasks();
    } catch (error) {
      console.log(error);
    }
  }

  private async handleTaskClick(event: Event): Promise<void> {
    const target = event.target as HTMLElement;
    const taskElement = target.closest('[data-task-id]') as HTMLElement;

    if (!taskElement) return;

    const taskId = Number(taskElement.dataset.taskId);

    if (target.matches('[data-delete-button]')) {
      await this.deleteTask(taskId);
      return;
    }

    if (target.matches('[data-important-checkbox]')) {
      event.preventDefault();

      await this.updateTask(taskId, {
        isImportant: (target as HTMLInputElement).checked,
      });
      return;
    }

    if (target.matches('[data-complete-checkbox]')) {
      event.preventDefault();

      await this.updateTask(taskId, {
        isCompleted: (target as HTMLInputElement).checked,
      });
    }
  }

  private async deleteTask(id: number): Promise<void> {
    try {
      await this.tasksFetchAgent.deleteTask(id);
      await this.loadTasks();
    } catch (error) {
      console.log(error);
    }
  }

  private async updateTask(id: number, updates: Partial<Task>): Promise<void> {
    try {
      await this.tasksFetchAgent.updateTask(id, updates);
      await this.loadTasks();
    } catch (error) {
      console.log(error);
    }
  }

  private renderTasks(): void {
    if (!this.tasksListElement) return;

    this.tasksListElement.innerHTML = '';
    this.tasks.forEach((task) => {
      this.tasksListElement?.appendChild(createTaskItem(task));
    });
  }
}

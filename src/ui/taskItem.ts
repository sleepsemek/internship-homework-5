import { Task } from '../types.js';

export function createTaskItem({ id, name, info, isImportant, isCompleted }: Task): HTMLLIElement {
  const li = Object.assign(document.createElement('li'), {
    className: `tasks__item task ${isCompleted ? 'task--completed' : ''}`,
  });

  li.dataset.taskId = id.toString();
  li.innerHTML = `
    <h3 class="task__title">#${id} ${name}</h3>
    <p class="task__description">${info ?? ''}</p>

    <div class="task__controls">
      <label class="task__controls-label label label--inline">
        <input
          class="task__controls-input input"
          type="checkbox"
          aria-label="Пометить задачу '${name}' как важную"
          ${isImportant ? 'checked' : ''}
          data-important-checkbox
        >
        Важная
      </label>
      <label class="task__controls-label label label--inline">
        <input
          class="task__controls-input input"
          type="checkbox"
          aria-label="Пометить задачу '${name}' как завершенную"
          ${isCompleted ? 'checked' : ''}
          data-complete-checkbox
        >
        Выполнена
      </label>
    </div>
    <button
      class="task__controls-button button"
      type="button"
      aria-label="Удалить задачу '${name}'"
      data-delete-button
    >Удалить</button>
  `;

  return li;
}

import { TasksFetchAgent } from './api/TasksFetchAgent.js';
import { TasksController } from './controllers/TasksController.js';

const API_URL = 'https://tasks-service-maks1394.amvera.io';

const tasksRootElement = document.querySelector<HTMLElement>('[data-tasks]');
const tasksFetchAgent = new TasksFetchAgent(API_URL);

new TasksController(tasksRootElement, tasksFetchAgent);

import { Task, TaskGroup } from '../types';
import { mockTasks } from '../data/mock';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const todayStr = () => new Date().toISOString().split('T')[0];



export function getTaskGroup(task: Task): TaskGroup {
  if (task.completed) return 'completed';
  const today = todayStr();
  if (task.dueDate < today) return 'overdue';
  if (task.dueDate === today) return 'today';
  return 'week';
}

// In-memory state for Phase 1 (replaced by API calls in Phase 2)
let _tasks: Task[] = [...mockTasks];

export const tasksService = {
  async getTasks(): Promise<Task[]> {
    await delay(200);
    return [..._tasks].sort((a, b) => {
      // Overdue first, then today, then upcoming
      const groupOrder: Record<TaskGroup, number> = { overdue: 0, today: 1, week: 2, completed: 3 };
      return groupOrder[getTaskGroup(a)] - groupOrder[getTaskGroup(b)];
    });
  },

  async completeTask(id: string): Promise<void> {
    await delay(100);
    _tasks = _tasks.map((t) => (t.id === id ? { ...t, completed: true } : t));
  },

  async uncompleteTask(id: string): Promise<void> {
    await delay(100);
    _tasks = _tasks.map((t) => (t.id === id ? { ...t, completed: false } : t));
  },

  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'completed'>): Promise<Task> {
    await delay(100);
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      completed: false,
      createdAt: todayStr(),
    };
    _tasks = [newTask, ..._tasks];
    return newTask;
  },

  async getTodayTasksPreview(): Promise<Task[]> {
    await delay(150);
    const today = todayStr();
    return _tasks
      .filter((t) => !t.completed && (t.dueDate <= today))
      .slice(0, 3);
  },

  async deleteTask(id: string): Promise<void> {
    await delay(100);
    _tasks = _tasks.filter((t) => t.id !== id);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    await delay(100);
    _tasks = _tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
  },
};

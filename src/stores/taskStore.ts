import { create } from 'zustand';
import { Task } from '../types';
import { tasksService } from '../services/tasks.service';

interface TaskState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'success' | 'error';
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  uncompleteTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  status: 'idle',

  fetchTasks: async () => {
    set({ status: 'loading' });
    try {
      const tasks = await tasksService.getTasks();
      set({ tasks, status: 'success' });
    } catch {
      set({ status: 'error' });
    }
  },

  addTask: async (task) => {
    await tasksService.addTask(task);
    // Re-fetch to get the sorted list with the new task
    await get().fetchTasks();
  },

  completeTask: async (id) => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: true } : t)),
    }));
    try {
      await tasksService.completeTask(id);
    } catch {
      await get().fetchTasks(); // Rollback on failure
    }
  },

  uncompleteTask: async (id) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: false } : t)),
    }));
    try {
      await tasksService.uncompleteTask(id);
    } catch {
      await get().fetchTasks();
    }
  },

  deleteTask: async (id) => {
    const prev = get().tasks;
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
    try {
      await tasksService.deleteTask(id);
    } catch {
      set({ tasks: prev }); // Rollback
    }
  },

  updateTask: async (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    try {
      await tasksService.updateTask(id, updates);
    } catch {
      await get().fetchTasks();
    }
  },
}));

import { create } from "zustand";
import type { Task } from "./types";

const initialTasks: Task[] = [
  {
    id: 1,
    title: "API integration",
    description: "Connect frontend to REST API endpoints",
    column: "backlog",
    priority: "high",
  },
  {
    id: 2,
    title: "Unit tests",
    description: "Write tests for utility functions and hooks",
    column: "backlog",
    priority: "medium",
  },
  {
    id: 3,
    title: "Performance audit",
    description: "Lighthouse scores and bundle analysis",
    column: "backlog",
    priority: "low",
  },
  {
    id: 4,
    title: "Authentication flow",
    description: "Implement login, signup, and password reset screens",
    column: "in_progress",
    priority: "medium",
  },
  {
    id: 5,
    title: "File upload component",
    description: "Drag and drop file upload with preview",
    column: "in_progress",
    priority: "high",
  },
  {
    id: 6,
    title: "Dark mode support",
    description: "Add theme toggle and CSS variable switching",
    column: "review",
    priority: "medium",
  },
  {
    id: 7,
    title: "Dashboard layout",
    description: "Build responsive sidebar and main content area",
    column: "review",
    priority: "medium",
  },
  {
    id: 8,
    title: "Design system tokens",
    description: "Set up color palette, typography, and spacing scales",
    column: "done",
    priority: "low",
  },
  {
    id: 9,
    title: "Notification system",
    description: "Toast notifications and in-app alerts",
    column: "backlog",
    priority: "high",
  },
  {
    id: 10,
    title: "User settings page",
    description: "Profile editing, preferences, and account management",
    column: "backlog",
    priority: "high",
  },
  {
    id: 11,
    title: "Error boundary setup",
    description: "Global error handling with fallback UI",
    column: "in_progress",
    priority: "medium",
  },
  {
    id: 12,
    title: "CI/CD pipeline",
    description: "GitHub Actions for testing and deployment",
    column: "done",
    priority: "medium",
  },
];

interface TaskStore {
  tasks: Task[];
  searchQuery: string;
  setSearchQuery: (search: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  searchTasks: () => Task[];
}

const useTasksStore = create<TaskStore>((set, get) => ({
  tasks: initialTasks,
  searchQuery: "",
  addTask: (task: Task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (task: Task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  deleteTask: (id: number) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  setSearchQuery: (search: string) => set({ searchQuery: search }),
  searchTasks: () =>
    get().tasks.filter((t) =>
      t.title.toLowerCase().includes(get().searchQuery.toLowerCase()),
    ),
}));

export default useTasksStore;

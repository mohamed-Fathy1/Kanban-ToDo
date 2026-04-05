import { create } from "zustand"
import type { ColumnType, Task } from "./types"

const initialTasks: Task[] = [
  { id: 1, title: "API integration", description: "Connect frontend to REST API endpoints", column: "backlog", priority: "high" },
  { id: 2, title: "Unit tests", description: "Write tests for utility functions and hooks", column: "backlog", priority: "medium" },
  { id: 3, title: "Performance audit", description: "Lighthouse scores and bundle analysis", column: "backlog", priority: "low" },
  { id: 4, title: "Authentication flow", description: "Implement login, signup, and password reset screens", column: "in_progress", priority: "medium" },
  { id: 5, title: "File upload component", description: "Drag and drop file upload with preview", column: "in_progress", priority: "high" },
  { id: 6, title: "Dark mode support", description: "Add theme toggle and CSS variable switching", column: "review", priority: "medium" },
  { id: 7, title: "Dashboard layout", description: "Build responsive sidebar and main content area", column: "review", priority: "medium" },
  { id: 8, title: "Design system tokens", description: "Set up color palette, typography, and spacing scales", column: "done", priority: "low" },
  { id: 9, title: "Notification system", description: "Toast notifications and in-app alerts", column: "backlog", priority: "high" },
  { id: 10, title: "User settings page", description: "Profile editing, preferences, and account management", column: "backlog", priority: "high" },
  { id: 11, title: "Error boundary setup", description: "Global error handling with fallback UI", column: "in_progress", priority: "medium" },
  { id: 12, title: "CI/CD pipeline", description: "GitHub Actions for testing and deployment", column: "done", priority: "medium" },
]

type TaskStore = {
  tasks: Task[]
  searchQuery: string
  setSearchQuery: (q: string) => void
  addTask: (task: Task) => void
  updateTask: (task: Task) => void
  deleteTask: (id: number) => void
  moveTask: (id: number, column: ColumnType) => void
  reorderTask: (id: number, column: ColumnType, index: number) => void
}

const useTasksStore = create<TaskStore>((set) => ({
  tasks: initialTasks,
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  addTask: (task) => set(({ tasks }) => ({ tasks: [...tasks, task] })),
  updateTask: (task) => set(({ tasks }) => ({ tasks: tasks.map((t) => (t.id === task.id ? task : t)) })),
  deleteTask: (id) => set(({ tasks }) => ({ tasks: tasks.filter((t) => t.id !== id) })),

  moveTask: (id, column) =>
    set(({ tasks }) => ({ tasks: tasks.map((t) => (t.id === id ? { ...t, column } : t)) })),

  reorderTask: (id, column, index) =>
    set(({ tasks }) => {
      const task = tasks.find((t) => t.id === id)
      if (!task) return { tasks }
      const rest = tasks.filter((t) => t.id !== id)
      const col = rest.filter((t) => t.column === column)
      const others = rest.filter((t) => t.column !== column)
      col.splice(index, 0, { ...task, column })
      return { tasks: [...others, ...col] }
    }),
}));

export default useTasksStore;

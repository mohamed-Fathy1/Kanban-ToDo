import { API_URL } from "./config"
import type { Task } from "../types"

export type CreateTaskPayload = Omit<Task, "id">

export const tasksApi = {
    getAll: async (): Promise<Task[]> => {
        const res = await fetch(`${API_URL}/tasks`)
        if (!res.ok) throw new Error("Failed to fetch tasks")
        return res.json()
    },

    create: async (task: CreateTaskPayload): Promise<Task> => {
        const res = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        })
        if (!res.ok) throw new Error("Failed to create task")
        return res.json()
    },

    update: async (id: number, updates: Partial<Task>): Promise<Task> => {
        const res = await fetch(`${API_URL}/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        })
        if (!res.ok) throw new Error("Failed to update task")
        return res.json()
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" })
        if (!res.ok) throw new Error("Failed to delete task")
    },
}

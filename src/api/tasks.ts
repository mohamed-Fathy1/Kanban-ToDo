import type { ColumnType, Task } from "../types"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export type CreateTaskPayload = Omit<Task, "id">

export type TasksPage = {
    tasks: Task[]
    total: number
    page: number
    limit: number
}

export const tasksApi = {
    getByColumn: async (column: ColumnType, page = 1, limit = 10): Promise<TasksPage> => {
        const params = new URLSearchParams({ column, _page: String(page), _per_page: String(limit), _sort: 'position' })
        const res = await fetch(`${API_URL}/tasks?${params}`)
        if (!res.ok) throw new Error("Failed to fetch tasks")
        const data = await res.json()
        if (Array.isArray(data)) {
            return { tasks: data, total: data.length, page, limit }
        }
        return { tasks: data.data, total: data.items, page, limit }
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

    bulkUpdate: async (updates: Array<{ id: number } & Partial<Task>>): Promise<void> => {
        await Promise.all(updates.map(({ id, ...data }) =>
            fetch(`${API_URL}/tasks/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
        ))
    },
}

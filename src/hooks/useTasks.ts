import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { tasksApi, type CreateTaskPayload } from "../api/tasks"
import type { Task } from "../types"

export function useTasks() {
    return useQuery({
        queryKey: ["tasks"],
        queryFn: tasksApi.getAll,
    })
}

export function useCreateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (task: CreateTaskPayload) => tasksApi.create(task),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
    })
}

export function useUpdateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...updates }: Partial<Task> & { id: number }) =>
            tasksApi.update(id, updates),
        onSuccess: (data) => {
            // patch the task in cache without refetching — preserves DnD ordering
            qc.setQueryData<Task[]>(["tasks"], (old) =>
                old?.map((t) => (t.id === data.id ? data : t)) ?? []
            )
        },
    })
}

export function useDeleteTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => tasksApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
    })
}

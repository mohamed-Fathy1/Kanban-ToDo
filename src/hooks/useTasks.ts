import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { tasksApi, type CreateTaskPayload } from "../api/tasks"
import type { ColumnType, Task } from "../types"

export function useColumnTasks(column: ColumnType) {
    return useInfiniteQuery({
        queryKey: ["tasks", column],
        queryFn: ({ pageParam }) => tasksApi.getByColumn(column, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const loaded = lastPage.page * lastPage.limit
            return loaded < lastPage.total ? lastPage.page + 1 : undefined
        },
    })
}

export function useCreateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (task: CreateTaskPayload) => tasksApi.create(task),
        onSuccess: (data) => qc.invalidateQueries({ queryKey: ["tasks", data.column] }),
    })
}

export function useUpdateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...updates }: Partial<Task> & { id: number }) =>
            tasksApi.update(id, updates),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
    })
}

export function useDragMoveTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (updates: Array<Partial<Task> & { id: number }>) =>
            tasksApi.bulkUpdate(updates),
        onError: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
    })
}

export function useDeleteTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => tasksApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
    })
}

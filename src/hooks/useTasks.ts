import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query"
import { tasksApi, type CreateTaskPayload, type TasksPage } from "../api/tasks"
import type { ColumnType, Task } from "../types"
import { COLUMNS } from "../types"

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
        onSuccess: (data) => {
            for (const col of COLUMNS) {
                qc.setQueryData<InfiniteData<TasksPage, number>>(["tasks", col], (old) => {
                    if (!old) return old
                    if (col === data.column) {
                        const exists = old.pages.some(p => p.tasks.some(t => t.id === data.id))
                        if (exists) {
                            return {
                                ...old,
                                pages: old.pages.map(page => ({
                                    ...page,
                                    tasks: page.tasks.map(t => t.id === data.id ? data : t),
                                })),
                            }
                        }
                        const lastPage = old.pages[old.pages.length - 1]
                        return {
                            ...old,
                            pages: [
                                ...old.pages.slice(0, -1),
                                { ...lastPage, tasks: [...lastPage.tasks, data], total: lastPage.total + 1 },
                            ],
                        }
                    }
                    const had = old.pages.some(p => p.tasks.some(t => t.id === data.id))
                    if (!had) return old
                    return {
                        ...old,
                        pages: old.pages.map(page => ({
                            ...page,
                            tasks: page.tasks.filter(t => t.id !== data.id),
                            total: page.total - 1,
                        })),
                    }
                })
            }
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

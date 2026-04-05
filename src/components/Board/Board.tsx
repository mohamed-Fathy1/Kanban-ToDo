import { Box } from "@mui/material"
import type { ColumnType, Task } from "../../types"
import { COLUMNS } from "../../types"
import { Column } from "../Column"
import { useState } from "react"
import { DndContext, type DragEndEvent, type DragOverEvent, DragOverlay, type DragStartEvent, closestCenter } from "@dnd-kit/core"
import { useQueryClient, type InfiniteData } from "@tanstack/react-query"
import { useUpdateTask } from "../../hooks/useTasks"
import type { TasksPage } from "../../api/tasks"
import { TaskCard } from "../TaskCard"

function Board() {
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [overId, setOverId] = useState<string | number | null>(null)
    const updateTask = useUpdateTask()
    const qc = useQueryClient()

    function getColumnTasks(column: ColumnType): Task[] {
        const data = qc.getQueryData<InfiniteData<TasksPage, number>>(["tasks", column])
        return data?.pages.flatMap(p => p.tasks) ?? []
    }

    function findTask(id: number | string): Task | undefined {
        for (const col of COLUMNS) {
            const task = getColumnTasks(col).find(t => t.id === Number(id))
            if (task) return task
        }
    }

    function updateColumnCache(column: ColumnType, tasks: Task[], totalDelta = 0) {
        qc.setQueryData<InfiniteData<TasksPage, number>>(["tasks", column], (old) => {
            if (!old) return old
            const limit = old.pages[0]?.limit ?? 10
            return {
                ...old,
                pages: old.pages.map((page, i) => ({
                    ...page,
                    tasks: i === old.pages.length - 1 ? tasks.slice(i * limit) : tasks.slice(i * limit, (i + 1) * limit),
                    total: page.total + totalDelta,
                })),
            }
        })
    }

    function onDragStart({ active }: DragStartEvent) {
        setActiveTask(findTask(active.id) ?? null)
    }

    function onDragOver({ over }: DragOverEvent) {
        setOverId(over?.id ?? null)
    }

    function onDragEnd({ active, over }: DragEndEvent) {
        setActiveTask(null)
        setOverId(null)
        if (!over) return

        const id = active.id as number
        const task = findTask(id)
        if (!task) return

        const overId = String(over.id)
        const isColumnDrop = COLUMNS.includes(overId as ColumnType)
        const isDropEnd = overId.startsWith("drop-end:")

        if (isColumnDrop || isDropEnd) {
            const targetCol = (isDropEnd ? overId.replace("drop-end:", "") : overId) as ColumnType
            if (task.column !== targetCol) {
                const sourceTasks = getColumnTasks(task.column).filter(t => t.id !== id)
                updateColumnCache(task.column, sourceTasks, -1)

                const targetTasks = getColumnTasks(targetCol)
                targetTasks.push({ ...task, column: targetCol })
                updateColumnCache(targetCol, targetTasks, 1)

                updateTask.mutate({ id, column: targetCol })
            }
            return
        }

        const target = findTask(over.id)
        if (!target) return

        if (task.column !== target.column) {
            const sourceTasks = getColumnTasks(task.column).filter(t => t.id !== id)
            updateColumnCache(task.column, sourceTasks, -1)

            const targetTasks = getColumnTasks(target.column)
            const overIdx = targetTasks.findIndex(t => t.id === Number(over.id))
            targetTasks.splice(overIdx, 0, { ...task, column: target.column })
            updateColumnCache(target.column, targetTasks, 1)

            updateTask.mutate({ id, column: target.column })
        } else if (task.id !== target.id) {
            const tasks = getColumnTasks(task.column)
            const fromIdx = tasks.findIndex(t => t.id === id)
            const toIdx = tasks.findIndex(t => t.id === Number(over.id))
            const [moved] = tasks.splice(fromIdx, 1)
            tasks.splice(toIdx, 0, moved)
            updateColumnCache(task.column, tasks)
        }
    }

    return (
        <DndContext onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} collisionDetection={closestCenter}>
            <Box display="flex" gap={2} px={8} py={4} sx={{ flex: 1, minHeight: 0, overflowX: "auto" }}>
                {COLUMNS.map((col) => (
                    <Column key={col} type={col} activeTask={activeTask} overId={overId} />
                ))}
            </Box>
            <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
                {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>
        </DndContext>
    )
}

export default Board

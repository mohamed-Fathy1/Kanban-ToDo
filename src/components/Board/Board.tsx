import { Box } from "@mui/material"
import type { ColumnType, Task } from "../../types"
import { COLUMNS } from "../../types"
import { Column } from "../Column"
import { useState } from "react"
import { DndContext, type DragEndEvent, type DragOverEvent, DragOverlay, type DragStartEvent, closestCenter } from "@dnd-kit/core"
import { useQueryClient, type InfiniteData } from "@tanstack/react-query"
import { useDragMoveTask } from "../../hooks/useTasks"
import type { TasksPage } from "../../api/tasks"
import { TaskCard } from "../TaskCard"

function Board() {
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [overId, setOverId] = useState<string | number | null>(null)
    const dragMoveTask = useDragMoveTask()
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

    function computeInsertPosition(tasks: Task[], insertIndex: number): number {
        const prev = insertIndex > 0 ? tasks[insertIndex - 1] : null
        const next = insertIndex < tasks.length - 1 ? tasks[insertIndex + 1] : null
        if (prev && next) return (prev.position + next.position) / 2
        if (prev) return prev.position + 1
        if (next) return next.position - 1
        return 0
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
                const sourceTasks = getColumnTasks(task.column)
                const targetTasks = getColumnTasks(targetCol)

                const lastPos = targetTasks.length > 0 ? targetTasks[targetTasks.length - 1].position + 1 : 0
                const movedTask = { ...task, column: targetCol, position: lastPos }

                updateColumnCache(task.column, sourceTasks.filter(t => t.id !== id), -1)
                updateColumnCache(targetCol, [...targetTasks, movedTask], 1)

                dragMoveTask.mutate([{ id, column: targetCol, position: lastPos }])
            }
            return
        }

        const target = findTask(over.id)
        if (!target) return

        if (task.column !== target.column) {
            const sourceTasks = getColumnTasks(task.column)
            const targetTasks = getColumnTasks(target.column)
            const overIdx = targetTasks.findIndex(t => t.id === Number(over.id))

            const newTargetArr = [...targetTasks]
            newTargetArr.splice(overIdx, 0, { ...task, column: target.column })
            const newPos = computeInsertPosition(newTargetArr, overIdx)
            newTargetArr[overIdx] = { ...task, column: target.column, position: newPos }

            updateColumnCache(task.column, sourceTasks.filter(t => t.id !== id), -1)
            updateColumnCache(target.column, newTargetArr, 1)

            dragMoveTask.mutate([{ id, column: target.column, position: newPos }])
        } else if (task.id !== target.id) {
            const tasks = getColumnTasks(task.column)
            const fromIdx = tasks.findIndex(t => t.id === id)
            const toIdx = tasks.findIndex(t => t.id === Number(over.id))

            const reordered = [...tasks]
            const [moved] = reordered.splice(fromIdx, 1)
            reordered.splice(toIdx, 0, moved)
            const newPos = computeInsertPosition(reordered, toIdx)
            reordered[toIdx] = { ...moved, position: newPos }

            updateColumnCache(task.column, reordered)

            dragMoveTask.mutate([{ id, position: newPos }])
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

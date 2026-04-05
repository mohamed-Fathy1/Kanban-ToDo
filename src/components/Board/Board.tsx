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

    function withPositions(tasks: Task[]): Task[] {
        return tasks.map((t, i) => ({ ...t, position: i }))
    }

    function positionDiff(oldTasks: Task[], newTasks: Task[], movedId?: number): Array<Partial<Task> & { id: number }> {
        const updates: Array<Partial<Task> & { id: number }> = []
        for (const t of newTasks) {
            if (t.id === movedId) continue
            const old = oldTasks.find(ot => ot.id === t.id)
            if (!old || old.position !== t.position) {
                updates.push({ id: t.id, position: t.position })
            }
        }
        return updates
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
                const oldSourceTasks = getColumnTasks(task.column)
                const oldTargetTasks = getColumnTasks(targetCol)

                const newSourceTasks = withPositions(oldSourceTasks.filter(t => t.id !== id))
                const newTargetTasks = withPositions([...oldTargetTasks, { ...task, column: targetCol }])

                updateColumnCache(task.column, newSourceTasks, -1)
                updateColumnCache(targetCol, newTargetTasks, 1)

                dragMoveTask.mutate([
                    { id, column: targetCol, position: newTargetTasks.length - 1 },
                    ...positionDiff(oldSourceTasks, newSourceTasks, id),
                ])
            }
            return
        }

        const target = findTask(over.id)
        if (!target) return

        if (task.column !== target.column) {
            const oldSourceTasks = getColumnTasks(task.column)
            const oldTargetTasks = getColumnTasks(target.column)

            const newSourceTasks = withPositions(oldSourceTasks.filter(t => t.id !== id))
            const overIdx = oldTargetTasks.findIndex(t => t.id === Number(over.id))
            const newTargetArr = [...oldTargetTasks]
            newTargetArr.splice(overIdx, 0, { ...task, column: target.column })
            const newTargetTasks = withPositions(newTargetArr)

            updateColumnCache(task.column, newSourceTasks, -1)
            updateColumnCache(target.column, newTargetTasks, 1)

            dragMoveTask.mutate([
                { id, column: target.column, position: overIdx },
                ...positionDiff(oldTargetTasks, newTargetTasks, id),
                ...positionDiff(oldSourceTasks, newSourceTasks, id),
            ])
        } else if (task.id !== target.id) {
            const oldTasks = getColumnTasks(task.column)
            const fromIdx = oldTasks.findIndex(t => t.id === id)
            const toIdx = oldTasks.findIndex(t => t.id === Number(over.id))
            const reordered = [...oldTasks]
            const [moved] = reordered.splice(fromIdx, 1)
            reordered.splice(toIdx, 0, moved)
            const positioned = withPositions(reordered)

            updateColumnCache(task.column, positioned)

            dragMoveTask.mutate(positionDiff(oldTasks, positioned))
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

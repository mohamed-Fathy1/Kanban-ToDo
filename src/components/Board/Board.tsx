import { Box } from "@mui/material"
import type { ColumnType, Task } from "../../types"
import { COLUMNS } from "../../types"
import Column from "../Column"
import useTasksStore from "../../store"
import { useMemo, useState } from "react"
import { DndContext, type DragEndEvent, type DragOverEvent, DragOverlay, type DragStartEvent, closestCorners } from "@dnd-kit/core"
import TaskCard from "../TaskCard"

function Board() {
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [overId, setOverId] = useState<string | number | null>(null)
    const tasks = useTasksStore((s) => s.tasks)
    const searchQuery = useTasksStore((s) => s.searchQuery)
    const reorderTask = useTasksStore((s) => s.reorderTask)

    const filteredTasks = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return tasks
        return tasks.filter((t) =>
            t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
        )
    }, [tasks, searchQuery])

    function onDragStart({ active }: DragStartEvent) {
        setActiveTask(tasks.find((t) => t.id === active.id) ?? null)
    }

    function onDragOver({ over }: DragOverEvent) {
        setOverId(over?.id ?? null)
    }

    function onDragEnd({ active, over }: DragEndEvent) {
        setActiveTask(null)
        setOverId(null)
        if (!over) return

        const id = active.id as number
        const task = tasks.find((t) => t.id === id)
        if (!task) return

        const overId = String(over.id)
        const isColumnDrop = COLUMNS.includes(overId as ColumnType)
        const isDropEnd = overId.startsWith("drop-end:")

        if (isColumnDrop || isDropEnd) {
            const targetCol = (isDropEnd ? overId.replace("drop-end:", "") : overId) as ColumnType
            if (task.column !== targetCol) {
                const endIdx = tasks.filter((t) => t.column === targetCol).length
                reorderTask(id, targetCol, endIdx)
            }
            return
        }

        const target = tasks.find((t) => t.id === over.id)
        if (!target) return

        const colTasks = tasks.filter((t) => t.column === target.column)
        const overIdx = colTasks.findIndex((t) => t.id === over.id)
        reorderTask(id, target.column, overIdx)
    }

    return (
        <DndContext onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} collisionDetection={closestCorners}>
            <Box display="flex" gap={2} px={8} py={4} sx={{ overflowX: "auto", minHeight: "calc(100vh - 100px)" }}>
                {COLUMNS.map((col) => (
                    <Column key={col} type={col} tasks={filteredTasks.filter((t) => t.column === col)} activeTask={activeTask} overId={overId} />
                ))}
            </Box>
            <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
                {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>
        </DndContext>
    )
}

export default Board

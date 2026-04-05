import { Box, CircularProgress, Typography } from "@mui/material"
import type { ColumnType, Task } from "../../types"
import { COLUMNS } from "../../types"
import Column from "../Column"
import useStore from "../../store"
import { useMemo, useState } from "react"
import { DndContext, type DragEndEvent, type DragOverEvent, DragOverlay, type DragStartEvent, closestCorners } from "@dnd-kit/core"
import { useQueryClient } from "@tanstack/react-query"
import { useTasks, useUpdateTask } from "../../hooks/useTasks"
import TaskCard from "../TaskCard"

function Board() {
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [overId, setOverId] = useState<string | number | null>(null)
    const { data: tasks = [], isLoading, error } = useTasks()
    const searchQuery = useStore((s) => s.searchQuery)
    const updateTask = useUpdateTask()
    const qc = useQueryClient()

    const filteredTasks = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return tasks
        return tasks.filter((t) =>
            t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
        )
    }, [tasks, searchQuery])

    function reorderInCache(taskId: number, column: ColumnType, index: number) {
        qc.setQueryData<Task[]>(["tasks"], (old) => {
            if (!old) return []
            const task = old.find((t) => t.id === taskId)
            if (!task) return old
            const rest = old.filter((t) => t.id !== taskId)
            const col = rest.filter((t) => t.column === column)
            const others = rest.filter((t) => t.column !== column)
            col.splice(index, 0, { ...task, column })
            return [...others, ...col]
        })
    }

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
                reorderInCache(id, targetCol, endIdx)
                updateTask.mutate({ id, column: targetCol })
            }
            return
        }

        const target = tasks.find((t) => t.id === over.id)
        if (!target) return

        const colTasks = tasks.filter((t) => t.column === target.column)
        const overIdx = colTasks.findIndex((t) => t.id === over.id)
        reorderInCache(id, target.column, overIdx)

        if (task.column !== target.column) {
            updateTask.mutate({ id, column: target.column })
        }
    }

    if (isLoading) return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
    if (error) return <Typography color="error" textAlign="center" py={8}>Failed to load tasks</Typography>

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

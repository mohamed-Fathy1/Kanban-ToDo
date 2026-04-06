import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Box, Button, CircularProgress, Paper } from "@mui/material"
import { lightGray } from "../../theme"
import { AddOutlined } from "@mui/icons-material"
import { COLUMN_COLORS, type ColumnType, type Task } from "../../types"
import { TaskCard } from "../TaskCard"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useColumnTasks } from "../../hooks/useTasks"
import useStore from "../../store"
import { TaskDialog } from "../TaskDialog"
import TaskCardSkeleton from "../Skeleton/TaskCardSkeleton/TaskCardSkeleton"
import ColumnHeader from "./ColumnHeader"
import { DropIndicator, DropZone } from "../DndHelpers/DndHelpers"

type ColumnProps = {
    type: ColumnType
    activeTask: Task | null
    overId: string | number | null
}

function Column({ type, activeTask, overId }: ColumnProps) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useColumnTasks(type)
    const searchQuery = useStore((s) => s.searchQuery)

    const color = COLUMN_COLORS[type]

    const scrollRef = useRef<HTMLDivElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    const total = data?.pages[0]?.total ?? 0
    const allTasks = useMemo(() => data?.pages.flatMap(p => p.tasks ?? []) ?? [], [data])

    const tasks = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return allTasks
        return allTasks.filter(t =>
            t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
        )
    }, [allTasks, searchQuery])

    // fetch next page when the sentinel is in view
    useEffect(() => {
        const sentinel = sentinelRef.current
        const container = scrollRef.current
        if (!sentinel || !hasNextPage || isFetchingNextPage) return

        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) fetchNextPage() },
            { root: container, threshold: 0.1 },
        )
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])


    // calculate is dragging
    const isDragging = activeTask !== null
    const dropEndId = `drop-end:${type}`
    const dropZoneActive = isDragging && (overId === type || overId === dropEndId)
    const hoverTaskId = isDragging && overId != null && overId !== type && overId !== dropEndId
        ? tasks.find((t) => t.id === Number(overId) && t.id !== activeTask!.id)?.id ?? null
        : null

    // generate random tasks for skeleton
    const getRandomTasks = useCallback(() => {
        return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => i + 1) as number[]
    }, [])
    const randomTasks = useMemo(() => {
        return getRandomTasks()
    }, [getRandomTasks])

    return (
        <Paper sx={{ width: 380, minWidth: 380, p: 2, bgcolor: lightGray, display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
            <ColumnHeader count={total} type={type} />
            <Box ref={scrollRef} display="flex" flexDirection="column" gap={1.5} sx={{ minHeight: 0, overflowY: "auto" }}>
                {isLoading ? (
                    <>
                        {randomTasks.map((i: number) => (
                            <TaskCardSkeleton key={i} />
                        ))}
                    </>
                ) : (
                    <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                        {tasks.map((t) => (
                            <Fragment key={t.id}>
                                {hoverTaskId === t.id && <DropIndicator color={color} />}
                                <TaskCard task={t} onEdit={(task) => { setEditingTask(task); setDialogOpen(true) }} />
                            </Fragment>
                        ))}
                    </SortableContext>
                )}
                {isDragging && activeTask?.column !== type && <DropZone color={color} active={dropZoneActive} type={type} />}
                <div ref={sentinelRef} style={{ padding: 1 }} />
                {isFetchingNextPage && (
                    <Box display="flex" justifyContent="center" py={1}>
                        <CircularProgress size={20} />
                    </Box>
                )}
            </Box>
            {activeTask === null && (
                <Button variant="outlined" startIcon={<AddOutlined />} onClick={() => { setEditingTask(null); setDialogOpen(true) }} sx={{ color: "#7C818D", borderColor: "#7C818D", borderStyle: "dashed", py: 1 }}>
                    Add Task
                </Button>
            )}
            <TaskDialog open={dialogOpen} onClose={() => setDialogOpen(false)} task={editingTask} defaultColumn={type} />
        </Paper>
    )
}

export default Column

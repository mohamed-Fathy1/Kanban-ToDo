import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material"
import { columnColors, darkGray, fontFamilyMono, lightGray } from "../../theme"
import { AddOutlined } from "@mui/icons-material"
import type { ColumnType, Task } from "../../types"
import { COLUMNS_CONFIG } from "../../types"
import TaskCard from "../TaskCard"
import { useDroppable } from "@dnd-kit/core"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useColumnTasks } from "../../hooks/useTasks"
import useStore from "../../store"
import TaskDialog from "../TaskDialog"

function ColumnHeader({ count, type }: { count: number; type: ColumnType }) {
    const { label } = COLUMNS_CONFIG[type]
    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Box bgcolor={columnColors[type]} width={10} height={10} borderRadius="50%" />
            <Typography color={darkGray} variant="h6" component="h2" fontSize={15} fontWeight="bold" textTransform="uppercase" sx={{ fontFamily: fontFamilyMono }}>
                {label}
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" bgcolor="#E8E9ED" color={darkGray} borderRadius="50%" fontSize={12} fontWeight="bold" sx={{ width: 20, height: 20 }}>
                {count}
            </Box>
        </Box>
    )
}

function DropIndicator({ color }: { color: string }) {
    return <Box sx={{ height: 3, bgcolor: color, borderRadius: 1, flexShrink: 0 }} />
}

function DropZone({ color, active, type }: { color: string; active?: boolean; type: ColumnType }) {
    const { setNodeRef } = useDroppable({ id: `drop-end:${type}` })
    return (
        <Box ref={setNodeRef} sx={{ border: "2px dashed", borderColor: color, borderRadius: 2.5, py: 3, display: "flex", alignItems: "center", justifyContent: "center", opacity: active ? 0.6 : 0.3, transition: "opacity 150ms ease" }}>
            <Typography fontSize={13} fontWeight={600} color={color} sx={{ fontFamily: fontFamilyMono, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Drop here
            </Typography>
        </Box>
    )
}

type ColumnProps = {
    type: ColumnType
    activeTask: Task | null
    overId: string | number | null
}

function Column({ type, activeTask, overId }: ColumnProps) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useColumnTasks(type)
    const searchQuery = useStore((s) => s.searchQuery)
    const color = columnColors[type]
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

    const isDragging = activeTask !== null
    const crossColumn = isDragging && activeTask.column !== type
    const dropEndId = `drop-end:${type}`
    const dropZoneActive = isDragging && (overId === type || overId === dropEndId)
    const hoverTaskId = isDragging && overId != null && overId !== type && overId !== dropEndId
        ? tasks.find((t) => t.id === Number(overId) && t.id !== activeTask!.id)?.id ?? null
        : null

    if (isLoading) {
        return (
            <Paper sx={{ width: 380, p: 2, bgcolor: lightGray, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
                <CircularProgress size={24} />
            </Paper>
        )
    }

    return (
        <Paper sx={{ width: 380, minWidth: 380, p: 2, bgcolor: lightGray, display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
            <ColumnHeader count={total} type={type} />
            <Box ref={scrollRef} display="flex" flexDirection="column" gap={1.5} sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((t) => (
                        <Fragment key={t.id}>
                            {hoverTaskId === t.id && <DropIndicator color={color} />}
                            <TaskCard task={t} onEdit={(task) => { setEditingTask(task); setDialogOpen(true) }} />
                        </Fragment>
                    ))}
                </SortableContext>
                {isDragging && <DropZone color={color} active={dropZoneActive} type={type} />}
                <div ref={sentinelRef} />
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

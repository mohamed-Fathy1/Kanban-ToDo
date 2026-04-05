import { Fragment } from "react"
import { Box, Button, Paper, Typography } from "@mui/material"
import { columnColors, darkGray, fontFamilyMono, lightGray } from "../../theme"
import { AddOutlined } from "@mui/icons-material"
import type { ColumnType, Task } from "../../types"
import { COLUMNS_CONFIG } from "../../types"
import TaskCard from "../TaskCard"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

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
    return <Box sx={{ height: 2, bgcolor: color, borderRadius: 1 }} />
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
    tasks: Task[]
    activeTask: Task | null
    overId: string | number | null
}

function Column({ type, tasks, activeTask, overId }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id: type })
    const color = columnColors[type]

    const crossColumn = activeTask !== null && activeTask.column !== type
    const dropEndId = `drop-end:${type}`
    const dropZoneActive = crossColumn && (overId === type || overId === dropEndId)
    const hoverTaskId = crossColumn && overId != null && overId !== type && overId !== dropEndId
        ? tasks.find((t) => t.id === overId)?.id ?? null
        : null

    return (
        <Paper sx={{ width: 380, p: 2, bgcolor: lightGray, display: "flex", flexDirection: "column", gap: 2 }}>
            <ColumnHeader count={tasks.length} type={type} />
            <Box ref={setNodeRef} display="flex" flexDirection="column" gap={1.5} sx={{ minHeight: 40 }}>
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((t) => (
                        <Fragment key={t.id}>
                            {hoverTaskId === t.id && <DropIndicator color={color} />}
                            <TaskCard task={t} />
                        </Fragment>
                    ))}
                </SortableContext>
                {crossColumn && <DropZone color={color} active={dropZoneActive} type={type} />}
            </Box>
            {activeTask === null && (
                <Button variant="outlined" startIcon={<AddOutlined />} sx={{ color: "#7C818D", borderColor: "#7C818D", borderStyle: "dashed", py: 1 }}>
                    Add Task
                </Button>
            )}
        </Paper>
    )
}

export default Column

import type { Task } from "../../types"
import { PRIORITY_CHIP_COLORS } from "../../types"
import { fontFamilyMono } from "../../theme"
import { Card, CardContent, Chip, Typography } from "@mui/material"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function TaskCard({ task }: { task: Task }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
    const color = PRIORITY_CHIP_COLORS[task.priority]

    return (
        <Card
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, cursor: "grab" }}
            {...attributes}
            {...listeners}
            sx={isDragging ? { border: "1px dashed", borderColor: "divider", boxShadow: "none" } : undefined}
        >
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="h6" component="h3" fontSize={18} fontWeight={600} sx={{ fontFamily: fontFamilyMono }}>
                    {task.title}
                </Typography>
                <Typography variant="body1" lineHeight={1.3} color="#5F6573">
                    {task.description}
                </Typography>
                <Chip label={task.priority} sx={{ fontFamily: fontFamilyMono, bgcolor: `${color}50`, color, py: 0.5, mt: 1, "& .MuiChip-label": { px: 1 } }} />
            </CardContent>
        </Card>
    )
}

export default TaskCard

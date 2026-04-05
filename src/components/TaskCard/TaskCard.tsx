import type { Priority, Task } from "../../types"
import { PRIORITY_CHIP_COLORS } from "../../types"
import { Card, CardContent, Chip, Typography } from "@mui/material"

/**
 * Task card
 * @description Task/ticket card component
 * @param {Task} task - Task to display
 * @returns {React.ReactNode}
 */
function TaskCard({ task }: { task: Task }) {

    const priorityColor = PRIORITY_CHIP_COLORS[task.priority as Priority]
    const priorityLabel = task.priority
    const chipBgColor = `${priorityColor}50`

    return (
        <Card>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="h6" component="h3" fontSize={20} fontWeight="semibold">{task.title}</Typography>
                <Typography variant="body1" component="p" lineHeight={1.3} color="#5F6573">{task.description}</Typography>
                <Chip label={priorityLabel} sx={{
                    backgroundColor: chipBgColor, color: priorityColor, py: 0.5, mt: 1
                    , "& .MuiChip-label": {
                        px: 1
                    }
                }} />
            </CardContent>
        </Card>
    )
}

export default TaskCard
import { Box, Button, Paper, Typography } from "@mui/material"
import { darkGray, fontFamilyMono, lightGray } from "../../theme"
import { AddOutlined } from "@mui/icons-material"
import type { ColumnType, Task } from "../../types"
import { COLUMNS_CONFIG } from "../../types"
import { columnColors } from "../../theme"
import TaskCard from "../TaskCard"

/**
 * Column header
 * @description Header for the column
 * @param {number} count - Number of tasks in the column
 * @param {ColumnType} type - Type of the column
 * @returns {React.ReactNode}
 */
function ColumnHeader({ count, type }: { count: number, type: ColumnType }) {
    const { label } = COLUMNS_CONFIG[type]
    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Box bgcolor={columnColors[type as ColumnType]} width={10} height={10} borderRadius="50%" />
            <Typography color={darkGray} variant="h6" component="h2" fontSize={15} fontWeight="bold" textTransform="uppercase" sx={{ fontFamily: fontFamilyMono }}>{label}</Typography>
            <Box display="flex" alignItems="center" gap={1} bgcolor="#E8E9ED" color={darkGray} borderRadius="50%" p={1} fontSize={12} fontWeight="bold"
                sx={{ aspectRatio: 1, width: 20, height: 20 }}
            >{count}</Box>
        </Box>
    )
}

/**
 * Add task button
 * @description Button to add a task to the column
 * @returns {React.ReactNode}
 */
function AddTaskButton() {
    return (
        <Button variant="outlined" startIcon={<AddOutlined />}
            sx={{ width: "100%", justifyContent: "center", color: "#7C818D", borderColor: "#7C818D", borderStyle: "dashed", py: 1 }}
        >Add Task</Button>
    )
}

/**
 * Column
 * @description Column component
 * @param {ColumnType} type - Type of the column
 * @param {Task[]} tasks - Tasks in the column
 * @returns {React.ReactNode}
 */
function Column({ type, tasks }: { type: ColumnType, tasks: Task[] }) {

    return (
        <Paper sx={{ width: 380, p: 2, bgcolor: lightGray, display: "flex", flexDirection: "column", gap: 2 }}>
            <ColumnHeader count={tasks.length} type={type} />
            <Box display="flex" flexDirection="column" gap={2}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </Box>
            <AddTaskButton />
        </Paper>
    )
}

export default Column

import { Box } from "@mui/material"
import type { ColumnType, Task } from "../../types"
import { COLUMNS } from "../../types"
import Column from "../Column"

/**
 * Board
 * @description Board component
 * @param {Task[]} tasks - Tasks in the board
 * @returns {React.ReactNode}
 */
function Board({ tasks }: { tasks: Task[] }) {
    return (
        <Box display="flex" gap={2} px={8} py={4} sx={{ overflowX: "auto", minHeight: "calc(100vh - 100px)" }}>
            {/* Render columns based on the columns configuration */}
            {COLUMNS.map((column) => (
                <Column key={column} type={column as ColumnType} tasks={tasks.filter((task) => task.column === column)} />
            ))}
        </Box>
    )
}

export default Board
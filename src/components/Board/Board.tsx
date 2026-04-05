import { Box } from "@mui/material"
import type { ColumnType, Task } from "../../types"
import { COLUMNS } from "../../types"
import Column from "../Column"

function Board({ tasks }: { tasks: Task[] }) {
    return (
        <Box display="flex" gap={2} px={8} py={4} sx={{ overflowX: "auto", minHeight: "calc(100vh - 100px)" }}>
            {COLUMNS.map((column) => (
                <Column key={column} type={column as ColumnType} tasks={tasks.filter((task) => task.column === column)} />
            ))}
        </Box>
    )
}

export default Board
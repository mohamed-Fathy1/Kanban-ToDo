import { Box } from "@mui/material"
import type { Task } from "../../types"
import { COLUMNS } from "../../types"
import Column from "../Column"

function Board({ tasks }: { tasks: Task[] }) {
    return (
        <Box display="flex" gap={2} px={8} py={4} sx={{ overflowX: "auto", minHeight: "calc(100vh - 100px)" }}>
            {COLUMNS.map((column) => (
                <Column />
            ))}
        </Box>
    )
}

export default Board
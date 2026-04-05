import { Box } from "@mui/material"
import type { ColumnType, Task } from "../../types"
import { COLUMNS } from "../../types"
import Column from "../Column"
import useTasksStore from "../../store"
import { useMemo } from "react"

/**
 * Board
 * @description Board component
 * @returns {React.ReactNode}
 */
function Board() {

    const tasks = useTasksStore((state) => state.tasks)
    const searchQuery = useTasksStore((state) => state.searchQuery)

    const filteredTasks = useMemo(() => {
        if (searchQuery.trim() === "") {
            return tasks
        }
        return tasks.filter((task: Task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [tasks, searchQuery])

    return (
        <Box display="flex" gap={2} px={8} py={4} sx={{ overflowX: "auto", minHeight: "calc(100vh - 100px)" }}>
            {/* Render columns based on the columns configuration */}
            {COLUMNS.map((column) => (
                <Column key={column} type={column as ColumnType} tasks={filteredTasks.filter((task) => task.column === column)} />
            ))}
        </Box>
    )
}

export default Board
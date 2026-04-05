import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import { ViewKanbanOutlined } from '@mui/icons-material';
import { Search } from '../Search';
import { useColumnTasks } from "../../hooks/useTasks"

function Header() {
    const backlog = useColumnTasks("backlog")
    const inProgress = useColumnTasks("in_progress")
    const review = useColumnTasks("review")
    const done = useColumnTasks("done")

    const total = (backlog.data?.pages[0]?.total ?? 0) +
        (inProgress.data?.pages[0]?.total ?? 0) +
        (review.data?.pages[0]?.total ?? 0) +
        (done.data?.pages[0]?.total ?? 0)

    return (
        <AppBar position="static" color="transparent" elevation={0} component="header" sx={{ borderBottom: "2px solid", borderColor: "divider", padding: 1 }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Box display="flex" alignItems="center" gap={1} bgcolor="#4167CA" color="white" borderRadius={1} p={1}>
                        <ViewKanbanOutlined fontSize="medium" />
                    </Box>
                    <Box display="flex" flexDirection="column">
                        <Typography variant="h1" fontWeight="bold" fontSize={20}>Kanban Board</Typography>
                        <Typography variant="body1" fontSize={14} color="text.secondary">{total} tasks</Typography>
                    </Box>
                </Box>
                <Search />
            </Toolbar>
        </AppBar>
    )
}

export default Header
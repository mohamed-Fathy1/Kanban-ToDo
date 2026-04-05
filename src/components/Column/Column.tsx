import { Box, Paper, Typography } from "@mui/material"
import { columnColors, darkGray, lightGray } from "../../theme"

function ColumnHeader({ label, count }: { label: string, count: number }) {
    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Box bgcolor={columnColors.backlog} width={10} height={10} borderRadius="50%" />
            <Typography color={darkGray} variant="h6" component="h2" fontSize={15} fontWeight="bold" textTransform="uppercase">{label}</Typography>
            <Box display="flex" alignItems="center" gap={1} bgcolor="#E8E9ED" color={darkGray} borderRadius="50%" p={1} fontSize={12} fontWeight="bold"
                sx={{ aspectRatio: 1, width: 20, height: 20 }}
            >{count}</Box>
        </Box>
    )
}

function Column() {
    return (
        <Paper sx={{ width: 350, height: "100%", py: 2, px: 3, bgcolor: lightGray }}>
            <ColumnHeader label="To Do" count={1} />
            <Box display="flex" flexDirection="column" gap={2}>
                {/* <Task /> */}
            </Box>
        </Paper>
    )
}

export default Column

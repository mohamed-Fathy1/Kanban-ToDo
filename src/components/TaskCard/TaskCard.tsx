import { useState, type MouseEvent } from "react"
import { PRIORITY_CHIP_COLORS, type Task } from "../../types"
import { fontFamilyMono } from "../../theme"
import { Box, Card, CardContent, Chip, IconButton, ListItemIcon, ListItemText, MenuItem, Popover, Typography } from "@mui/material"
import { DeleteOutline, EditOutlined, MoreVert } from "@mui/icons-material"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useDeleteTask } from "../../hooks/useTasks"

const stopPropagation = (e: React.SyntheticEvent) => e.stopPropagation()

function TaskCard({ task, onEdit }: { task: Task; onEdit?: (task: Task) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
    const color = PRIORITY_CHIP_COLORS[task.priority]
    const deleteTask = useDeleteTask()
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const menuOpen = Boolean(anchorEl)

    function openMenu(e: MouseEvent<HTMLElement>) {
        e.stopPropagation()
        setAnchorEl(e.currentTarget)
    }

    function closeMenu() {
        setAnchorEl(null)
    }

    function handleEdit() {
        closeMenu()
        onEdit?.(task)
    }

    function handleDelete() {
        closeMenu()
        deleteTask.mutate(task.id)
    }

    return (
        <Card
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, cursor: "grab" }}
            {...attributes}
            {...listeners}
            sx={{
                flexShrink: 0,
                position: "relative",
                "&:hover .task-menu-btn": { opacity: 1 },
                ...(isDragging ? { border: "1px dashed", borderColor: "divider", boxShadow: "none" } : undefined),
            }}
        >
            <Box
                className="task-menu-btn"
                sx={{ position: "absolute", top: 6, right: 6, opacity: menuOpen ? 1 : 0, transition: "opacity 150ms ease" }}
            >
                <IconButton size="small" onPointerDown={stopPropagation} onClick={openMenu}>
                    <MoreVert fontSize="small" />
                </IconButton>
            </Box>
            <Popover
                open={menuOpen}
                anchorEl={anchorEl}
                onClose={closeMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                onPointerDown={stopPropagation}
                onKeyDown={stopPropagation}
                slotProps={{ paper: { sx: { borderRadius: 2, minWidth: 140, py: 0.5 } } }}
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon><EditOutlined fontSize="small" /></ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                    <ListItemIcon><DeleteOutline fontSize="small" sx={{ color: "error.main" }} /></ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Popover>
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

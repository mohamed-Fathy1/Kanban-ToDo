import { useState, useEffect } from "react"
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material"
import { COLUMNS_CONFIG, type ColumnType, type Priority, type Task } from "../../types"
import { fontFamilyMono } from "../../theme"
import { useCreateTask, useUpdateTask } from "../../hooks/useTasks"

const PRIORITIES: Priority[] = ["high", "medium", "low"]

type Props = {
    open: boolean
    onClose: () => void
    task?: Task | null
    defaultColumn?: ColumnType
}

function TaskDialog({ open, onClose, task, defaultColumn = "backlog" }: Props) {
    const createTask = useCreateTask()
    const updateTask = useUpdateTask()
    const isEdit = Boolean(task)
    const loading = createTask.isPending || updateTask.isPending

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [column, setColumn] = useState<ColumnType>(defaultColumn)
    const [priority, setPriority] = useState<Priority>("medium")

    useEffect(() => {
        if (open) {
            setTitle(task?.title ?? "")
            setDescription(task?.description ?? "")
            setColumn(task?.column ?? defaultColumn)
            setPriority(task?.priority ?? "medium")
            createTask.reset()
            updateTask.reset()
        }
    }, [open, task, defaultColumn])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!title.trim() || loading) return

        if (isEdit && task) {
            updateTask.mutate({ id: task.id, title, description, column, priority }, { onSuccess: onClose })
        } else {
            createTask.mutate({ title, description, column, priority }, { onSuccess: onClose })
        }
    }

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ fontFamily: fontFamilyMono, fontWeight: 600 }}>
                    {isEdit ? "Edit Task" : "Add Task"}
                </DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
                    <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus disabled={loading} />
                    <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} disabled={loading} />
                    <TextField label="Column" value={column} onChange={(e) => setColumn(e.target.value as ColumnType)} select disabled={loading}>
                        {Object.entries(COLUMNS_CONFIG).map(([key, { label }]) => (
                            <MenuItem key={key} value={key}>{label}</MenuItem>
                        ))}
                    </TextField>
                    <TextField label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} select disabled={loading}>
                        {PRIORITIES.map((p) => (
                            <MenuItem key={p} value={p} sx={{ textTransform: "capitalize" }}>{p}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}>
                        {isEdit ? "Save" : "Add"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default TaskDialog

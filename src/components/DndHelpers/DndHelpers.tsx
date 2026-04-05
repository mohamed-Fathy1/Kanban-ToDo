import { useDroppable } from "@dnd-kit/core";
import { Box, Typography } from "@mui/material";
import { fontFamilyMono } from "../../theme";
import { type ColumnType } from "../../types";

export function DropIndicator({ color }: { color: string }) {
    return <Box sx={{ height: 3, bgcolor: color, borderRadius: 1, flexShrink: 0 }} />
}

export function DropZone({ color, active, type }: { color: string; active?: boolean; type: ColumnType }): React.ReactNode {
    const { setNodeRef } = useDroppable({ id: `drop-end:${type}` })
    return (
        <Box ref={setNodeRef} sx={{ border: "2px dashed", borderColor: color, borderRadius: 2.5, py: 3, display: "flex", alignItems: "center", justifyContent: "center", opacity: active ? 0.6 : 0.3, transition: "opacity 150ms ease" }}>
            <Typography fontSize={13} fontWeight={600} color={color} sx={{ fontFamily: fontFamilyMono, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Drop here
            </Typography>
        </Box>
    )
}
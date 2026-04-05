import { Box, Typography } from "@mui/material";
import { darkGray } from "../../theme";
import { COLUMN_COLORS, COLUMNS_CONFIG, type ColumnType } from "../../types";
import { fontFamilyMono } from "../../theme";

function ColumnHeader({ count, type }: { count: number; type: ColumnType }) {
    const { label } = COLUMNS_CONFIG[type]
    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Box bgcolor={COLUMN_COLORS[type]} width={10} height={10} borderRadius="50%" />
            <Typography color={darkGray} variant="h6" component="h2" fontSize={15} fontWeight="bold" textTransform="uppercase" sx={{ fontFamily: fontFamilyMono }}>
                {label}
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" bgcolor="#E8E9ED" color={darkGray} borderRadius="50%" fontSize={12} fontWeight="bold" sx={{ width: 20, height: 20 }}>
                {count}
            </Box>
        </Box>
    )
}

export default ColumnHeader
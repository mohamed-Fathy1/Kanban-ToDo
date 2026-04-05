import { CardContent, Skeleton, Card } from "@mui/material";


function TaskCardSkeleton() {
    return (
        <Card sx={{ flexShrink: 0 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Skeleton variant="text" width="70%" height={28} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="85%" height={20} />
                <Skeleton variant="rectangular" width={45} height={24} sx={{ mt: 1, borderRadius: ".3rem" }} />
            </CardContent>
        </Card>
    )
}

export default TaskCardSkeleton
export type ColumnType = "backlog" | "in_progress" | "review" | "done"
export type Priority = "high" | "medium" | "low"

export interface Task {
  id: number
  title: string
  description: string
  column: ColumnType
  priority: Priority
  position: number
}

export const COLUMNS: ColumnType[] = ["backlog", "in_progress", "review", "done"]

export const COLUMN_COLORS: Record<ColumnType, string> = {
  backlog: "#3E66D7",
  in_progress: "#DD882D",
  review: "#904ABF",
  done: "#469A76",
}

export const PRIORITY_CHIP_COLORS: Record<Priority, string> = {
  high: "#CC4343",
  medium: "#DD882D",
  low: "#6E7480",
}

export const COLUMNS_CONFIG: Record<ColumnType, { label: string; color: string }> = {
  backlog: { label: "To Do", color: COLUMN_COLORS.backlog },
  in_progress: { label: "In Progress", color: COLUMN_COLORS.in_progress },
  review: { label: "In Review", color: COLUMN_COLORS.review },
  done: { label: "Done", color: COLUMN_COLORS.done },
}

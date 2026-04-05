import { columnColors } from "./theme"

export type ColumnType = "backlog" | "in_progress" | "review" | "done"
export type Priority = "high" | "medium" | "low"

export interface Task {
  id: number
  title: string
  description: string
  column: ColumnType
  priority: Priority
}

export const COLUMNS: ColumnType[] = ["backlog", "in_progress", "review", "done"]

export const PRIORITY_CHIP_COLORS: Record<Priority, string> = {
  high: "#CC4343",
  medium: "#DD882D",
  low: "#6E7480",
}

export const COLUMNS_CONFIG: Record<ColumnType, { label: string; color: string }> = {
  backlog: { label: "To Do", color: columnColors.backlog },
  in_progress: { label: "In Progress", color: columnColors.in_progress },
  review: { label: "In Review", color: columnColors.review },
  done: { label: "Done", color: columnColors.done },
}

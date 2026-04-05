import { columnColors } from "./theme";

export type ColumnType = "backlog" | "in_progress" | "review" | "done";
export type Priority = "high" | "medium" | "low";

export interface Task {
  id: number;
  title: string;
  description: string;
  column: ColumnType;
  priority: Priority;
}

export interface ColumnConfig {
  type: ColumnType;
  label: string;
  color: string;
}

export const COLUMNS: ColumnConfig[] = [
  { type: "backlog", label: "To Do", color: columnColors.backlog },
  {
    type: "in_progress",
    label: "In Progress",
    color: columnColors.in_progress,
  },
  { type: "review", label: "In Review", color: columnColors.review },
  { type: "done", label: "Done", color: columnColors.done },
];

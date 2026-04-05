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

export const COLUMNS: ColumnType[] = [
  "backlog",
  "in_progress",
  "review",
  "done",
];

export const PRIORITY_CHIP_COLORS: Record<Priority, string> = {
  high: "#CC4343",
  medium: "#DD882D",
  low: "#6E7480",
} as const;

/**
 * Columns configuration
 * @description Configuration for the columns in the board
 * @example
 * {
 *   "backlog": { label: "To Do", color: "#3E66D7" },
 *   "in_progress": { label: "In Progress", color: "#DD882D" },
 *   "review": { label: "In Review", color: "#904ABF" },
 *   "done": { label: "Done", color: "#469A76" },
 */
export const COLUMNS_CONFIG: Record<
  ColumnType,
  { label: string; color: string }
> = {
  backlog: {
    label: "To Do",
    color: columnColors.backlog,
  },
  in_progress: {
    label: "In Progress",
    color: columnColors.in_progress,
  },
  review: {
    label: "In Review",
    color: columnColors.review,
  },
  done: {
    label: "Done",
    color: columnColors.done,
  },
} as const;

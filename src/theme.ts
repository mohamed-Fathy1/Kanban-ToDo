import { createTheme } from "@mui/material/styles";
import type { ColumnType } from "./types";

export const columnColors: Record<ColumnType, string> = {
  backlog: "#3E66D7",
  in_progress: "#DD882D",
  review: "#904ABF",
  done: "#469A76",
} as const;

export const lightGray = "#EDF0F3";
export const darkGray = "#4F576A";

const theme = createTheme({
  palette: {
    primary: { main: "#3E66D7" },
    background: { default: "#F5F6F8", paper: "#FFFFFF" },
    divider: "#E8E9ED",
    text: { primary: "#1A1D23", secondary: "#6B6F7B" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0, variant: "outlined" },
      styleOverrides: {
        root: {
          borderColor: "#E8E9ED",
          "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: 14, "&:last-child": { paddingBottom: 14 } },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiTextField: {
      defaultProps: { size: "small", variant: "outlined" },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: "0.725rem",
          letterSpacing: "0.05em",
          borderRadius: 5,
          textTransform: "uppercase",
          width: "fit-content",
          height: "fit-content",
          p: 3,
        },
      },
    },
  },
});

export default theme;

import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#1a2744",
      light: "#243562",
      dark: "#0d1630",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#009c3b",
      light: "#00c44a",
      dark: "#007a2f",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444",
      light: "#fee2e2",
      dark: "#dc2626",
    },
    warning: {
      main: "#f59e0b",
      light: "#fef3c7",
      dark: "#d97706",
    },
    success: {
      main: "#10b981",
      light: "#d1fae5",
      dark: "#059669",
    },
    info: {
      main: "#3b82f6",
      light: "#dbeafe",
      dark: "#1d4ed8",
    },
    background: {
      default: "#f4f5f7",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a2e",
      secondary: "#6b7280",
    },
    divider: "#d1d5db",
  },
  typography: {
    fontFamily: "Inter, system-ui, Helvetica, Arial, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          cursor: "pointer",
          borderRadius: 4,
          padding: "10px 20px",
          fontSize: "0.875rem",
        },
        contained: {
          "&.MuiButton-colorPrimary:hover": { backgroundColor: "#243562" },
          "&.MuiButton-colorSecondary:hover": { backgroundColor: "#007a2f" },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { cursor: "pointer", borderRadius: 4 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          cursor: "pointer",
          fontSize: "0.875rem",
          transition: "all 0.2s ease-in-out",
          "&.Mui-selected:not(.Mui-disabled)": {
            backgroundColor: "rgba(0, 156, 59, 0.1) !important",
            color: "#009c3b",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "rgba(0, 156, 59, 0.15) !important",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(26, 39, 68, 0.05)",
          },
        },
      },
    },
    MuiMenu: {
      defaultProps: {
        disableScrollLock: true,
        slotProps: {
          paper: {
            elevation: 0,
            sx: {
              border: "1px solid #d1d5db",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              mt: 0.5,
            },
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        fullWidth: true,
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 4,
            backgroundColor: "#ffffff",
            "& fieldset": { borderColor: "#d1d5db" },
            "&:hover fieldset": { borderColor: "#1a2744" },
            "&.Mui-focused fieldset": { borderColor: "#009c3b" },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#009c3b" },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontSize: "0.875rem",
          alignItems: "flex-start",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 4 },
      },
    },
    MuiDialog: {
      defaultProps: {
        disableScrollLock: true,
      },
      styleOverrides: {
        paper: { borderRadius: 4 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4, fontWeight: 600, fontSize: "0.75rem" },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#6b7280",
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: { cursor: "pointer" },
      },
    },
  },
});

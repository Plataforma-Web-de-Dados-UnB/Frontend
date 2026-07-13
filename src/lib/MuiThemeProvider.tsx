import { useMemo, type ReactNode } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { useAccessibility } from "@/features/accessibility/useAccessibility";

const baseTypography = {
  fontFamily: "Inter, system-ui, Helvetica, Arial, sans-serif",
  button: {
    textTransform: "none" as const,
    fontWeight: 600,
  },
};

const baseShape = {
  borderRadius: 4,
};

function getComponentOverrides(
  mode: "light" | "dark" | "high-contrast",
  palette: Record<string, string>,
) {
  const isHighContrast = mode === "high-contrast";
  const isDark = mode === "dark";
  const secondaryMain = palette.secondaryMain;
  const textSecondary = palette.textSecondary;
  const divider = palette.divider;

  return {
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
          "&.MuiButton-colorPrimary:hover": {
            backgroundColor: isHighContrast ? "#a3c2ff" : isDark ? "#36649c" : "#243562",
          },
          "&.MuiButton-colorSecondary:hover": {
            backgroundColor: isHighContrast ? "#80ffaa" : "#007a2f",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { cursor: "pointer", borderRadius: 4 },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: { cursor: "pointer" },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          cursor: "pointer",
          fontSize: "0.875rem",
          transition: "all 0.2s ease-in-out",
          "&.Mui-selected:not(.Mui-disabled)": {
            backgroundColor: isHighContrast
              ? "#00ff55 !important"
              : "rgba(0, 156, 59, 0.1) !important",
            color: isHighContrast ? "#000000" : secondaryMain,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: isHighContrast
                ? "#80ffaa !important"
                : "rgba(0, 156, 59, 0.15) !important",
            },
          },
          "&:hover": {
            backgroundColor: isHighContrast
              ? "#5c93ff"
              : isDark
              ? "rgba(59, 130, 246, 0.08)"
              : "rgba(26, 39, 68, 0.05)",
            color: isHighContrast ? "#000000 !important" : undefined,
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
              border: `1px solid ${divider}`,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              mt: 0.5,
            },
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small" as const,
        fullWidth: true,
        variant: "outlined" as const,
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 4,
            backgroundColor: "var(--color-fundo-superficie)",
            color: "var(--color-texto-principal)",
            "& fieldset": { borderWidth: "1px", borderColor: divider },
            "&:hover fieldset": {
              borderWidth: "1px",
              borderColor: divider,
            },
            "&.Mui-focused fieldset": {
              borderWidth: "1px",
              borderColor: secondaryMain,
            },
            "& .MuiOutlinedInput-notchedOutline": { borderWidth: "1px" },
          },
          "& .MuiInputLabel-root": { color: "var(--color-texto-secundario)" },
          "& .MuiInputLabel-root.Mui-focused": { color: secondaryMain },
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
          color: textSecondary,
        },
      },
    },
  };
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme, highContrast } = useAccessibility();

  const muiTheme = useMemo(() => {
    const isDark = theme === "dark";

    if (highContrast) {
      const palette = {
        secondaryMain: "#00ff55",
        textPrimary: "#ffffff",
        textSecondary: "#f1f5f9",
        divider: "#ffffff",
      };
      return createTheme({
        typography: baseTypography,
        shape: baseShape,
        palette: {
          mode: "dark",
          primary: { main: "#5c93ff", contrastText: "#000000" },
          secondary: { main: "#00ff55", contrastText: "#000000" },
          background: { default: "#000000", paper: "#0a0f1d" },
          text: { primary: "#ffffff", secondary: "#f1f5f9" },
          divider: "#ffffff",
          error: { main: "#ff4d4d" },
          warning: { main: "#ffea00" },
          info: { main: "#5c93ff" },
          success: { main: "#00ff55" },
        },
        components: getComponentOverrides("high-contrast", palette),
      });
    }

    if (isDark) {
      const palette = {
        secondaryMain: "#00c44a",
        textPrimary: "#f8fafc",
        textSecondary: "#cbd5e1",
        divider: "#374151",
      };
      return createTheme({
        typography: baseTypography,
        shape: baseShape,
        palette: {
          mode: "dark",
          primary: {
            main: "#4f86c6",
            light: "#729fcf",
            dark: "#36649c",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#00c44a",
            light: "#22d35d",
            dark: "#009c3b",
            contrastText: "#ffffff",
          },
          background: { default: "#0a0f1a", paper: "#111827" },
          text: { primary: "#f8fafc", secondary: "#cbd5e1" },
          divider: "#374151",
          error: { main: "#f87171", light: "#450a0a", dark: "#ef4444" },
          warning: { main: "#fbbf24", light: "#451a03", dark: "#f59e0b" },
          info: { main: "#60a5fa", light: "#0c1a3a", dark: "#3b82f6" },
          success: { main: "#4ade80", light: "#052e16", dark: "#10b981" },
        },
        components: getComponentOverrides("dark", palette),
      });
    }

    const palette = {
      secondaryMain: "#009c3b",
      textPrimary: "#1a1a2e",
      textSecondary: "#6b7280",
      divider: "#d1d5db",
    };
    return createTheme({
      typography: baseTypography,
      shape: baseShape,
      palette: {
        mode: "light",
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
        background: { default: "#f4f5f7", paper: "#ffffff" },
        text: { primary: "#1a1a2e", secondary: "#6b7280" },
        divider: "#d1d5db",
        error: { main: "#ef4444", light: "#fee2e2", dark: "#dc2626" },
        warning: { main: "#f59e0b", light: "#fef3c7", dark: "#d97706" },
        info: { main: "#3b82f6", light: "#dbeafe", dark: "#1d4ed8" },
        success: { main: "#10b981", light: "#d1fae5", dark: "#059669" },
      },
      components: getComponentOverrides("light", palette),
    });
  }, [theme, highContrast]);

  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
};

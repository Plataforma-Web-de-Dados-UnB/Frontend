import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import CssBaseline from "@mui/material/CssBaseline";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/lib/MuiThemeProvider";
import { AccessibilityProvider } from "@/features/accessibility/AccessibilityProvider";
import { AuthProvider } from "@/features/auth/AuthContext";
import "./index.css";
import "./features/tour/tour.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AccessibilityProvider>
      <ThemeProvider>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  </StrictMode>,
);

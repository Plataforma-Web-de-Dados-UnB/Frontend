import React, { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  AccessibilityContext,
  FONT_SIZE_LEVELS,
  type Theme,
  type FontSizeLevel,
} from "./AccessibilityContext";

const STORAGE_KEYS = {
  theme: "theme",
  highContrast: "high-contrast",
  fontSizeLevel: "font-size-level",
} as const;

const FONT_SIZE_MAP: Record<FontSizeLevel, string> = {
  "100": "100%",
  "106.25": "106.25%",
  "112.5": "112.5%",
  "118.75": "118.75%",
  "125": "125%",
  "131.25": "131.25%",
  "137.5": "137.5%",
  "143.75": "143.75%",
  "150": "150%",
};

function isFontSizeLevel(value: string): value is FontSizeLevel {
  return (FONT_SIZE_LEVELS as readonly string[]).includes(value);
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEYS.theme);
  if (stored === "dark" || stored === "light") return stored;
  return "light";
}

function getInitialBoolean(key: string): boolean {
  return localStorage.getItem(key) === "true";
}

function getInitialFontSizeLevel(): FontSizeLevel {
  const stored = localStorage.getItem(STORAGE_KEYS.fontSizeLevel);
  if (stored && isFontSizeLevel(stored)) return stored;
  return "100";
}

export function AccessibilityProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme());
  const [highContrast, setHighContrastState] = useState<boolean>(() =>
    getInitialBoolean(STORAGE_KEYS.highContrast),
  );
  const [fontSizeLevel, setFontSizeLevelState] = useState<FontSizeLevel>(() =>
    getInitialFontSizeLevel(),
  );

  const applyTheme = useCallback((value: Theme) => {
    const root = document.documentElement;
    if (value === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEYS.theme, value);
  }, []);

  const applyHighContrast = useCallback((value: boolean) => {
    const root = document.documentElement;
    if (value) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    localStorage.setItem(STORAGE_KEYS.highContrast, String(value));
  }, []);

  const applyFontSize = useCallback((value: FontSizeLevel) => {
    document.documentElement.style.fontSize = FONT_SIZE_MAP[value];
    localStorage.setItem(STORAGE_KEYS.fontSizeLevel, value);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    applyHighContrast(highContrast);
  }, [highContrast, applyHighContrast]);

  useEffect(() => {
    applyFontSize(fontSizeLevel);
  }, [fontSizeLevel, applyFontSize]);

  const setTheme = useCallback(
    (value: Theme) => {
      setThemeState(value);
      applyTheme(value);
    },
    [applyTheme],
  );

  const toggleHighContrast = useCallback(() => {
    setHighContrastState((prev) => {
      const next = !prev;
      applyHighContrast(next);
      return next;
    });
  }, [applyHighContrast]);

  const setFontSizeLevel = useCallback(
    (value: FontSizeLevel) => {
      setFontSizeLevelState(value);
      applyFontSize(value);
    },
    [applyFontSize],
  );

  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        setTheme,
        highContrast,
        toggleHighContrast,
        fontSizeLevel,
        setFontSizeLevel,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

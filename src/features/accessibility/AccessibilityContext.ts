import { createContext } from "react";

export type Theme = "light" | "dark";

const FONT_SIZE_LEVELS = [
  "100",
  "106.25",
  "112.5",
  "118.75",
  "125",
  "131.25",
  "137.5",
  "143.75",
  "150",
] as const;

export type FontSizeLevel = (typeof FONT_SIZE_LEVELS)[number];

export interface AccessibilityContextProps {
  theme: Theme;
  setTheme: (value: Theme) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSizeLevel: FontSizeLevel;
  setFontSizeLevel: (value: FontSizeLevel) => void;
}

export const AccessibilityContext = createContext<
  AccessibilityContextProps | undefined
>(undefined);

export { FONT_SIZE_LEVELS };

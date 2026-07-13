import { createContext } from "react";

export interface AccessibilityDrawerContextValue {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const AccessibilityDrawerContext = createContext<
  AccessibilityDrawerContextValue | undefined
>(undefined);

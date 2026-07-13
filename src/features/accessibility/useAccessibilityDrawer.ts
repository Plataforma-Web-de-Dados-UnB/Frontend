import { useContext } from "react";
import { AccessibilityDrawerContext } from "./AccessibilityDrawerContext";

export const useAccessibilityDrawer = () => {
  const context = useContext(AccessibilityDrawerContext);
  if (!context) {
    throw new Error(
      "useAccessibilityDrawer must be used within AccessibilityDrawerProvider",
    );
  }
  return context;
};

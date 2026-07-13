import { useState, type ReactNode } from "react";
import { AccessibilityDrawerContext } from "./AccessibilityDrawerContext";

export const AccessibilityDrawerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <AccessibilityDrawerContext.Provider
      value={{
        open,
        openDrawer: () => setOpen(true),
        closeDrawer: () => setOpen(false),
      }}
    >
      {children}
    </AccessibilityDrawerContext.Provider>
  );
};

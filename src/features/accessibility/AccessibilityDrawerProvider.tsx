import { useState, useEffect, type ReactNode } from "react";
import { AccessibilityDrawerContext } from "./AccessibilityDrawerContext";
import {
  registerOpenDrawer,
  registerCloseDrawer,
} from "./accessibilityDrawerRef";

export const AccessibilityDrawerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    registerOpenDrawer(() => setOpen(true));
    registerCloseDrawer(() => setOpen(false));
  }, []);

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

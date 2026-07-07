import { useEffect, useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { requestTracker } from "@/services/requestTracker";

export const GlobalRequestIndicator = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const [active, setActive] = useState(requestTracker.getCount());

  useEffect(() => {
    return requestTracker.subscribe(setActive);
  }, []);

  if (isFetching === 0 && isMutating === 0 && active === 0) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[9999]">
      <div className="h-0.5 w-full animate-pulse bg-destaque" />
    </div>
  );
};

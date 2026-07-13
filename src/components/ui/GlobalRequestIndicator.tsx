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
    <div className="fixed left-0 right-0 top-0 z-[9999] pointer-events-none">
      <div
        className="h-[3px] w-full animate-pulse"
        style={{
          background:
            "linear-gradient(90deg, var(--color-destaque), var(--color-azul-unb), var(--color-destaque))",
          backgroundSize: "200% 100%",
          animation:
            "pulse 1.5s ease-in-out infinite, slide 2s linear infinite",
          boxShadow: "0 0 6px var(--color-destaque)",
        }}
      />
      <style>{`
        @keyframes slide {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

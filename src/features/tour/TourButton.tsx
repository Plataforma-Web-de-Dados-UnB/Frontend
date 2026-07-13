import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { HelpCircle } from "lucide-react";
import type { DriveStep } from "driver.js";
import { startTour } from "./useTour";

interface TourButtonProps {
  page: string;
  steps: DriveStep[];
  tooltipText?: string;
}

export const TourButton = ({
  page,
  steps,
  tooltipText = "Ver tutorial desta página",
}: TourButtonProps) => {
  return (
    <Tooltip
      title={tooltipText}
      arrow
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: "var(--color-azul-unb-hover)",
            color: "#ffffff",
            fontSize: "0.8rem",
            fontWeight: 600,
            borderRadius: "4px",
            "& .MuiTooltip-arrow": { color: "var(--color-azul-unb-hover)" },
          },
        },
      }}
    >
      <IconButton
        onClick={() => startTour(page, steps, true)}
        size="small"
        aria-label="Iniciar tutorial"
        sx={{
          color: "var(--color-titulo-destaque)",
          opacity: 0.65,
          "&:hover": { opacity: 1, bgcolor: "var(--color-azul-unb-suave)" },
          borderRadius: "6px",
          p: 0.75,
        }}
      >
        <HelpCircle className="h-4.5 w-4.5" />
      </IconButton>
    </Tooltip>
  );
};

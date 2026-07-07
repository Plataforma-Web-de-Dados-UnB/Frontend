import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";

type Severity = "error" | "warning" | "success" | "info";

type AlertBannerProps = {
  message?: string | null;
  severity?: Severity;
  title?: string;
};

export const AlertBanner = ({
  message,
  severity = "error",
  title,
}: AlertBannerProps) => (
  <Collapse in={!!message} unmountOnExit>
    <Alert severity={severity} variant="outlined" sx={{ mb: 1 }}>
      {title && (
        <AlertTitle sx={{ fontWeight: 700, mb: 0.25 }}>
          {title}
        </AlertTitle>
      )}
      {message}
    </Alert>
  </Collapse>
);

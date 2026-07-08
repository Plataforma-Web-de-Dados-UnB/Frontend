import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { AlertTriangle, Info, CheckCircle2, OctagonX } from "lucide-react";

interface MuiConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmTone?: "primary" | "danger" | "success" | "warning";
  isLoading?: boolean;
  onConfirm: () => void;
  requireTextInput?: boolean;
  textInputExpectedValue?: string;
}

export const MuiConfirmDialog: React.FC<MuiConfirmDialogProps> = ({
  open,
  onClose,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmTone = "primary",
  isLoading = false,
  onConfirm,
  requireTextInput = false,
  textInputExpectedValue = "",
}): React.JSX.Element => {
  const [inputValue, setInputValue] = useState("");

  // Reset input when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  const isConfirmDisabled =
    isLoading ||
    (requireTextInput && inputValue !== textInputExpectedValue);

  const getToneColor = () => {
    switch (confirmTone) {
      case "danger":
        return "error";
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "primary":
      default:
        return "primary";
    }
  };

  const getIcon = () => {
    switch (confirmTone) {
      case "danger":
        return <OctagonX className="h-5.5 w-5.5 text-vermelho-escuro shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5.5 w-5.5 text-amber-500 shrink-0" />;
      case "success":
        return <CheckCircle2 className="h-5.5 w-5.5 text-emerald-500 shrink-0" />;
      case "primary":
      default:
        return <Info className="h-5.5 w-5.5 text-azul-unb shrink-0" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "4px",
            bgcolor: "var(--color-fundo-superficie)",
            color: "var(--color-texto-principal)",
            backgroundImage: "none",
            border: "1px solid var(--color-borda-padrao)",
            p: 1.5,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1.5, px: 3, pt: 2, fontWeight: 800 }}>
        {getIcon()}
        <span className="font-sans text-lg font-extrabold text-texto-principal">{title}</span>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, py: 1 }}>
        <DialogContentText
          lang="pt-BR"
          sx={{
            color: "var(--color-texto-secundario)",
            fontSize: "0.875rem",
            mb: requireTextInput ? 2.5 : 0,
            fontFamily: "inherit",
            textAlign: "justify",
            hyphens: "auto",
            wordBreak: "break-word",
            lineHeight: 1.6,
          }}
        >
          {description}
        </DialogContentText>

        {requireTextInput && (
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-[0.875rem] leading-[2rem] font-semibold text-texto-secundario">
              Para confirmar, digite <span className="text-[0.875rem] text-texto-principal bg-borda-padrao px-1.5 py-1.5 rounded">{textInputExpectedValue}</span> abaixo:
            </p>
            <TextField
              fullWidth
              size="small"
              placeholder={textInputExpectedValue}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              variant="outlined"
              sx={{
                input: {
                  color: "var(--color-texto-principal)",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  "& fieldset": { borderColor: "var(--color-borda-padrao)" },
                  "&:hover fieldset": { borderColor: "var(--color-borda-padrao) !important" },
                  "&.Mui-focused fieldset": { borderColor: "var(--color-destaque) !important" },
                },
              }}
            />
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 2, display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          variant="text"
          sx={{
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "var(--color-borda-padrao)",
            color: "var(--color-texto-principal)",
            "&:hover": {
              bgcolor: "var(--color-fundo-superficie-suave)",
              color: "var(--color-texto-secundario)"
            },
            px: 2.5,
            py: 1,
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isConfirmDisabled}
          variant="contained"
          color={getToneColor()}
          startIcon={
            isLoading ? <CircularProgress size={16} color="inherit" /> : null
          }
          sx={{
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 700,
            boxShadow: "none",
            px: 2.5,
            py: 1,
            color: "#ffffff !important",
            "&:hover": { boxShadow: "none" },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

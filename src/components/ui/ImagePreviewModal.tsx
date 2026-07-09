import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { X } from "lucide-react";

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageAlt?: string;
}

export const ImagePreviewModal = ({
  open,
  onClose,
  imageUrl,
  imageAlt,
}: ImagePreviewModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            maxWidth: "60vw",
            maxHeight: "70vh",
            width: "auto",
            height: "auto",
            borderRadius: "4px",
            bgcolor: "var(--color-fundo-superficie)",
            color: "var(--color-texto-principal)",
            border: "1px solid var(--color-borda-padrao)",
            backgroundImage: "none",
            p: 0,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      {/* Top Header Bar for Close Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "12px 16px 4px 16px",
          width: "100%",
          backgroundColor: "var(--color-fundo-superficie)",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            color: "var(--color-erro)",
            bgcolor: "transparent",
            borderRadius: "50%",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "var(--color-vermelho-claro)",
              color: "var(--color-vermelho-escuro)",
            },
          }}
        >
          <X className="h-5 w-5" />
        </IconButton>
      </div>

      <DialogContent
        sx={{
          p: 2.5,
          pt: 0.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={imageAlt || "Visualização da Imagem"}
            style={{
              maxWidth: "calc(60vw - 40px)",
              maxHeight: "calc(70vh - 84px)",
              display: "block",
              width: "auto",
              height: "auto",
              objectFit: "contain",
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

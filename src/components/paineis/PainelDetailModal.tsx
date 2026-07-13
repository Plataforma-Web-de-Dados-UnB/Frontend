import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { X, Calendar, Clock, Info } from "lucide-react";
import type { PainelGetDto } from "@/types/dtos";

export interface PainelDetailModalProps {
  open: boolean;
  onClose: () => void;
  painel: PainelGetDto | null;
  formatData: (dt: string) => string;
}

export const PainelDetailModal = ({
  open,
  onClose,
  painel,
  formatData,
}: PainelDetailModalProps) => {
  if (!painel) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "4px",
            bgcolor: "var(--color-fundo-superficie)",
            color: "var(--color-texto-principal)",
            border: "1px solid var(--color-borda-padrao)",
            backgroundImage: "none",
            maxHeight: "85vh",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          px: 4,
          pt: 2.5,
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--color-borda-padrao)",
        }}
      >
        <span className="text-xl font-extrabold tracking-tight font-sans text-texto-principal truncate pr-4">
          {painel.nome}
        </span>
        <IconButton
          onClick={onClose}
          sx={{
            color: "var(--color-erro)",
            bgcolor: "transparent",
            borderRadius: "50%",
            transition: "all 0.2s ease-in-out",
            flexShrink: 0,
            "&:hover": {
              bgcolor: "var(--color-vermelho-claro)",
              color: "var(--color-vermelho-escuro)",
            },
          }}
        >
          <X className="h-5 w-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: 4,
          pt: 3,
          pb: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3.5,
        }}
      >
        {/* Description & Metadata Card */}
        <div className="w-full rounded p-5 bg-borda-padrao/40 min-w-0 flex flex-col justify-between mt-4">
          <div>
            <div className="flex justify-between items-start gap-4 mb-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario">
                Descrição do Painel
              </h4>
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-fundo-superficie text-texto-secundario select-none border border-borda-padrao/40">
                  Ordem: {painel.sortOrdem}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-azul-unb text-white select-none">
                  {painel.categoriaNome || "Sem Categoria"}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold select-none ${
                    painel.active
                      ? "bg-[#16a34a] text-white"
                      : "bg-[#dc2626] text-white"
                  }`}
                >
                  {painel.active ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
            <p className="text-sm text-texto-principal leading-relaxed whitespace-pre-wrap break-words">
              {painel.descricao || (
                <span className="italic text-texto-secundario/50">
                  Nenhuma descrição informada para este painel.
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-4 pt-4 border-t border-borda-padrao/55 text-xs text-texto-secundario">
            <div className="flex items-center gap-1.5 min-w-0">
              <Calendar className="h-4 w-4 text-texto-secundario/80 shrink-0" />
              <span className="truncate">
                <strong>Criado em:</strong> {formatData(painel.createdAt)}
              </span>
            </div>
            {painel.updatedAt && (
              <div className="flex items-center sm:justify-end gap-1.5 min-w-0">
                <Clock className="h-4 w-4 text-texto-secundario/80 shrink-0" />
                <span className="truncate">
                  <strong>Atualizado em:</strong> {formatData(painel.updatedAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Superset Integration Parameters */}
        <div className="w-full rounded p-5 bg-borda-padrao/40 min-w-0 flex flex-col mt-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario flex items-center gap-1.5 pb-2 mb-3">
            <Info className="h-4 w-4 text-destaque" />
            Apache Superset
          </h4>

          <div className="flex flex-col gap-3.5 text-sm">
            <div className="flex flex-col gap-1.5 items-start">
              <span className="text-sm font-bold text-texto-secundario">
                Link de Incorporação (Embed Link):
              </span>
              <Button
                component="a"
                href={painel.graphEmbedLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "var(--color-azul-unb)",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  padding: "4px 4px 2px 4px",
                  minWidth: "auto",
                  borderRadius: "2px",
                  position: "relative",
                  lineHeight: 1.2,
                  maxWidth: "100%",
                  display: "inline-block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "left",
                  justifyContent: "flex-start",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "4px",
                    right: "4px",
                    height: "2px",
                    backgroundColor: "var(--color-azul-unb)",
                    transform: "scaleX(0)",
                    transition: "transform 0.2s ease-in-out",
                  },
                  "&:hover::after": {
                    transform: "scaleX(1)",
                  },
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                {painel.graphEmbedLink}
              </Button>
            </div>

            {painel.embedDashboardUuid && (
              <div className="flex flex-col gap-1.5 mt-1.5 items-start">
                <span className="text-sm font-bold text-texto-secundario">
                  UUID do Dashboard:
                </span>
                <code className="font-mono text-sm font-semibold text-texto-principal tracking-wide">
                  {painel.embedDashboardUuid}
                </code>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

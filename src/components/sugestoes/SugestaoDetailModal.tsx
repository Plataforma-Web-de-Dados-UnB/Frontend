import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { X, Calendar, Clock, User } from "lucide-react";
import type {
  SugestaoGetDto,
  StatusSugestao,
  TipoSugestao,
} from "@/types/dtos";
import { TipoSugestaoLabel, StatusSugestaoLabel } from "@/types/dtos";

export interface SugestaoDetailModalProps {
  open: boolean;
  onClose: () => void;
  sugestao: SugestaoGetDto | null;
  isLoading: boolean;
}

export const SugestaoDetailModal = ({
  open,
  onClose,
  sugestao,
  isLoading,
}: SugestaoDetailModalProps) => {
  const formatDataLocal = (dataStr?: string | null) => {
    if (!dataStr) return "-";
    try {
      return new Date(dataStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const getTipoBadgeClass = (tipo?: TipoSugestao) => {
    switch (tipo) {
      case 0:
      case "Sugestao":
        return "bg-azul-unb text-white";
      case 1:
      case "Erro":
        return "bg-[#dc2626] text-white";
      case 2:
      case "Relato":
        return "bg-[#7c3aed] text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getStatusBadgeClass = (status?: StatusSugestao) => {
    switch (status) {
      case 0:
      case "Pendente":
        return "bg-[#d97706] text-white";
      case 1:
      case "Analisado":
        return "bg-[#16a34a] text-white";
      case 2:
      case "Descartado":
        return "bg-[#dc2626] text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

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
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <CircularProgress color="primary" />
        </div>
      ) : (
        sugestao && (
          <>
            {/* Header with Title only */}
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
              <span className="text-xl font-extrabold tracking-tight font-sans text-texto-principal truncate pr-4 select-none">
                {sugestao.titulo}
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

            {/* Main Information */}
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
              {/* Card 1: Description & Badges & Dates (matching PainelDetailModal) */}
              <div className="w-full rounded p-5 bg-borda-padrao/40 min-w-0 flex flex-col justify-between mt-4">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario select-none">
                      Descrição
                    </h4>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold select-none ${getTipoBadgeClass(sugestao.tipo)}`}
                      >
                        {TipoSugestaoLabel[sugestao.tipo]}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold select-none ${getStatusBadgeClass(sugestao.status)}`}
                      >
                        {StatusSugestaoLabel[sugestao.status]}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-texto-principal leading-relaxed whitespace-pre-wrap break-words">
                    {sugestao.descricao || (
                      <span className="italic text-texto-secundario/50 select-none">
                        Nenhuma descrição informada.
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-4 pt-4 border-t border-borda-padrao/55 text-xs text-texto-secundario">
                  <div className="flex items-center gap-1.5 min-w-0 select-none">
                    <Calendar className="h-4 w-4 text-texto-secundario/80 shrink-0" />
                    <span className="truncate">
                      <strong>Criada em:</strong>{" "}
                      {formatDataLocal(sugestao.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5 min-w-0 select-none">
                    <Clock className="h-4 w-4 text-texto-secundario/80 shrink-0" />
                    <span className="truncate">
                      <strong>Atualizada em:</strong>{" "}
                      {formatDataLocal(sugestao.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Contact Information */}
              <div className="w-full rounded p-5 bg-borda-padrao/40 min-w-0 flex flex-col mt-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario flex items-center gap-1.5 pb-2 mb-3 select-none">
                  <User className="h-4 w-4 text-destaque" />
                  Informações de Contato
                </h4>

                <div className="flex flex-col gap-3.5 text-sm">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-sm font-bold text-texto-secundario select-none">
                      Remetente:
                    </span>
                    <span className="text-sm font-semibold text-texto-principal">
                      {sugestao.nomeContato || (
                        <span className="italic text-texto-secundario/50 font-normal select-none">
                          Anônimo
                        </span>
                      )}
                    </span>
                  </div>

                  {sugestao.emailContato && (
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-sm font-bold text-texto-secundario select-none">
                        E-mail:
                      </span>
                      <Button
                        component="a"
                        href={`mailto:${sugestao.emailContato}`}
                        sx={{
                          color: "var(--color-titulo-destaque)",
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
                            backgroundColor: "var(--color-titulo-destaque)",
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
                        {sugestao.emailContato}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </>
        )
      )}
    </Dialog>
  );
};

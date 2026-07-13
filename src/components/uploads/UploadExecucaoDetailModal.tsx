import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { X, Database, ExternalLink, Hash } from "lucide-react";
import type { PipelineExecucaoGetDto } from "@/types/dtos";

export interface UploadExecucaoDetailModalProps {
  open: boolean;
  onClose: () => void;
  execucao: PipelineExecucaoGetDto | null;
  isLoading: boolean;
  onViewPipeline?: (pipelineId: number) => void;
}

export const UploadExecucaoDetailModal = ({
  open,
  onClose,
  execucao,
  isLoading,
  onViewPipeline,
}: UploadExecucaoDetailModalProps) => {
  const formatDataLocal = (dataStr?: string | null) => {
    if (!dataStr) return "-";
    try {
      return new Date(dataStr).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const getStatusBadgeClass = (status: string | number) => {
    const s = String(status).toLowerCase();
    switch (s) {
      case "0":
      case "pendente":
        return "bg-[#d97706] text-white";
      case "1":
      case "processando":
        return "bg-[#2563eb] text-white";
      case "2":
      case "sucesso":
        return "bg-[#16a34a] text-white";
      case "3":
      case "erro":
        return "bg-[#dc2626] text-white";
      case "4":
      case "cancelado":
        return "bg-[#64748b] text-white";
      case "5":
      case "rollback":
        return "bg-[#991b1b] text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getStatusLabel = (status: string | number) => {
    const s = String(status).toLowerCase();
    if (s === "0" || s === "pendente") return "Pendente";
    if (s === "1" || s === "processando") return "Processando";
    if (s === "2" || s === "sucesso") return "Sucesso";
    if (s === "3" || s === "erro") return "Erro";
    if (s === "4" || s === "cancelado") return "Cancelado";
    if (s === "5" || s === "rollback") return "Rollback";
    return String(status);
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
            minHeight: "60vh",
          },
        },
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <CircularProgress color="primary" />
        </div>
      ) : (
        execucao && (
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
              <span
                className="text-xl font-extrabold tracking-tight font-sans text-texto-principal truncate pr-4 select-none flex items-center gap-1"
                title={`Execução ${execucao.id}`}
              >
                <span>Execução</span>
                <div className="flex items-center gap-0">
                  <Hash className="h-5 w-5 text-destaque" />
                  <span>{execucao.id}</span>
                </div>
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
                gap: 2,
                overflow: "hidden",
              }}
            >
              {/* Card único: Pipeline, Arquivo, Batch, Destinos, Status e Histórico */}
              <div className="rounded p-5 bg-borda-padrao/40 min-w-0 flex flex-col gap-4 mt-6 relative">
                {/* Status badge no canto superior direito */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold select-none ${getStatusBadgeClass(execucao.status)}`}
                  >
                    {getStatusLabel(execucao.status)}
                  </span>
                </div>

                {/* Título */}
                <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario mb-1 select-none">
                  Informações da Pipeline
                </h4>

                {/* Pipeline */}
                <div>
                  {onViewPipeline ? (
                    <Button
                      onClick={() => onViewPipeline(execucao.pipelineId)}
                      endIcon={
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      }
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
                        display: "inline-flex",
                        overflow: "hidden",
                        justifyContent: "flex-start",
                        "& .MuiButton-endIcon": {
                          marginLeft: "4px",
                          flexShrink: 0,
                        },
                        "& .btn-label": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        },
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
                        "&:hover::after": { transform: "scaleX(1)" },
                        "&:hover": { backgroundColor: "transparent" },
                      }}
                    >
                      <span className="btn-label">{execucao.pipelineNome}</span>
                    </Button>
                  ) : (
                    <span className="text-sm font-bold text-texto-principal">
                      {execucao.pipelineNome}
                    </span>
                  )}
                </div>

                {/* Arquivo */}
                {execucao.nomeArquivo && (
                  <div>
                    <span className="text-xs text-texto-secundario block select-none">
                      Arquivo:
                    </span>
                    <span
                      className="text-sm font-mono text-texto-principal truncate block"
                      title={execucao.nomeArquivo}
                    >
                      {execucao.nomeArquivo}
                    </span>
                  </div>
                )}

                {/* Batch ID */}
                <div>
                  <span className="text-xs text-texto-secundario block select-none">
                    Batch ID:
                  </span>
                  <span className="text-sm font-mono text-texto-principal break-all">
                    {execucao.batchId}
                  </span>
                </div>

                {/* Destinos */}
                <div className="mt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario mb-3 select-none">
                    Camadas de Destino
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-500">
                        <Database className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-bold text-texto-principal">
                        {execucao.tabelaSilver}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-amber-100 text-amber-600">
                        <Database className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-bold text-texto-principal">
                        {execucao.tabelaGold}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-borda-padrao/50" />

                {/* Histórico Temporal */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs text-texto-secundario">
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold block select-none text-sm">
                        Criado em:
                      </span>
                      <span>{formatDataLocal(execucao.createdAt)}</span>
                    </div>
                    <div>
                      <span className="font-semibold block select-none text-sm">
                        Iniciado em:
                      </span>
                      <span>
                        {execucao.iniciadoEm ? (
                          formatDataLocal(execucao.iniciadoEm)
                        ) : (
                          <span className="italic text-texto-secundario/40 select-none">
                            Ainda não iniciado
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-left sm:text-right">
                    <div>
                      <span className="font-semibold block select-none text-sm">
                        Atualizado em:
                      </span>
                      <span>{formatDataLocal(execucao.updatedAt)}</span>
                    </div>
                    <div>
                      <span className="font-semibold block select-none text-sm">
                        Finalizado em:
                      </span>
                      <span>
                        {execucao.finalizadoEm ? (
                          formatDataLocal(execucao.finalizadoEm)
                        ) : (
                          <span className="italic text-texto-secundario/40 select-none">
                            Em andamento
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Mensagem de Retorno — full width, flex-1 to fill remaining height */}
              <div className="rounded p-5 bg-borda-padrao/40 flex flex-col flex-1 min-h-0">
                <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario mb-3 select-none">
                  Mensagem de Retorno
                </h4>
                {execucao.mensagem ? (
                  <div className="flex-1 min-h-0 overflow-y-auto rounded bg-borda-padrao/30 px-3 py-2">
                    <p className="text-sm font-semibold text-texto-principal leading-relaxed break-words whitespace-pre-wrap">
                      {execucao.mensagem}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs italic text-texto-secundario/50 select-none">
                    Sem mensagem de retorno.
                  </p>
                )}
              </div>
            </DialogContent>
          </>
        )
      )}
    </Dialog>
  );
};

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Calendar, Clock, RotateCcw, Eye, Hash } from "lucide-react";
import type { PipelineExecucaoGetDto } from "@/types/dtos";

export interface UploadExecucaoCardProps {
  exec: PipelineExecucaoGetDto;
  onView: (exec: PipelineExecucaoGetDto) => void;
  onRollbackClick: (exec: PipelineExecucaoGetDto) => void;
  formatDataHora: (dateStr: string | null | undefined) => string;
}

const tooltipSlotProps = {
  tooltip: {
    sx: {
      bgcolor: "var(--color-azul-unb-hover)",
      color: "#ffffff",
      fontSize: "0.875rem",
      fontWeight: "600",
      boxShadow:
        "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      padding: "6px 12px",
      borderRadius: "6px",
      "& .MuiTooltip-arrow": { color: "var(--color-azul-unb-hover)" },
    },
  },
};

// Database SVG icon (inline, to avoid lucide sizing constraints)
const DbIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

export const UploadExecucaoCard = ({
  exec,
  onView,
  onRollbackClick,
  formatDataHora,
}: UploadExecucaoCardProps) => {
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

  const isSucesso =
    exec.status === 2 || String(exec.status).toLowerCase() === "sucesso";

  return (
    <div
      onClick={() => onView(exec)}
      className="group flex flex-col md:grid md:grid-cols-12 items-center gap-4 bg-fundo-superficie p-5 transition hover:bg-fundo-superficie-suave cursor-pointer rounded shadow-sm"
    >
      {/* Column 1: Execution id & File Name (col-span-5) */}
      <div className="col-span-5 min-w-0 w-full">
        <h3 className="font-bold text-texto-principal text-base group-hover:text-destaque transition-colors flex items-center gap-1">
          <span>Execução</span>
          <div className="flex items-center gap-0">
            <Hash className="h-4 w-4 text-destaque" />
            <span>{exec.id}</span>
          </div>
        </h3>
        <p
          className="text-sm text-texto-secundario/70 mt-1 truncate font-normal h-5 leading-normal"
          title={exec.nomeArquivo ?? undefined}
        >
          {exec.nomeArquivo ? (
            exec.nomeArquivo
          ) : (
            <span className="italic text-texto-secundario/40 select-none">
              Arquivo não registrado
            </span>
          )}
        </p>
      </div>

      {/* Column 2: Status Badge (col-span-2) */}
      <div className="col-span-2 flex items-center justify-start w-full select-none">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold ${getStatusBadgeClass(exec.status)}`}
        >
          {getStatusLabel(exec.status)}
        </span>
      </div>

      {/* Column 3: Tabela Silver e Gold (col-span-2) */}
      <div className="col-span-2 min-w-0 w-full flex flex-col gap-1.5">
        <div className="flex items-center gap-2 truncate">
          <Tooltip title="Tabela Prata" arrow slotProps={tooltipSlotProps}>
            <span
              className="flex h-6 w-6 items-center justify-center rounded shrink-0"
              style={{ backgroundColor: "#e2e8f0", color: "#64748b" }}
            >
              <DbIcon />
            </span>
          </Tooltip>
          <span className="text-sm font-light text-texto-secundario truncate">
            {exec.tabelaSilver}
          </span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <Tooltip title="Tabela Ouro" arrow slotProps={tooltipSlotProps}>
            <span
              className="flex h-6 w-6 items-center justify-center rounded shrink-0"
              style={{ backgroundColor: "#fef3c7", color: "#b45309" }}
            >
              <DbIcon />
            </span>
          </Tooltip>
          <span className="text-sm font-light text-texto-secundario truncate">
            {exec.tabelaGold}
          </span>
        </div>
      </div>

      {/* Column 4: Timestamps (col-span-2) */}
      <div className="col-span-2 flex flex-col gap-1 w-full text-xs text-texto-secundario">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-texto-secundario/65 shrink-0" />
          <span>Criada: {formatDataHora(exec.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-texto-secundario/65 shrink-0" />
          <span>Início: {formatDataHora(exec.iniciadoEm)}</span>
        </div>
      </div>

      {/* Column 5: Actions (col-span-1) */}
      <div
        className="col-span-1 flex items-center justify-end gap-1 w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Eye button: shown when status is NOT Sucesso */}
        {!isSucesso && (
          <Tooltip title="Ver detalhes" arrow slotProps={tooltipSlotProps}>
            <IconButton
              size="medium"
              onClick={() => onView(exec)}
              sx={{
                color: "var(--color-titulo-destaque)",
                bgcolor: "var(--color-fundo-superficie-suave)",
                borderRadius: "50%",
                p: 1,
                "&:hover": { bgcolor: "var(--color-borda-padrao)" },
              }}
            >
              <Eye className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        )}

        {/* Rollback button: shown only on Sucesso */}
        {isSucesso && (
          <Tooltip title="Realizar Rollback" arrow slotProps={tooltipSlotProps}>
            <IconButton
              size="medium"
              onClick={() => onRollbackClick(exec)}
              sx={{
                color: "#dc2626",
                bgcolor: "rgba(220, 38, 38, 0.08)",
                borderRadius: "50%",
                p: 1,
                "&:hover": { bgcolor: "rgba(220, 38, 38, 0.18)" },
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

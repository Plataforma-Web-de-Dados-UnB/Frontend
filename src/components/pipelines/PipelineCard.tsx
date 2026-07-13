import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  Calendar,
  Clock,
  Pencil,
  Power,
  ArchiveRestore,
  Trash2,
} from "lucide-react";
import type { PipelineGetDto } from "@/types/dtos";

export interface PipelineCardProps {
  pipeline: PipelineGetDto;
  onView: (p: PipelineGetDto) => void;
  onEdit: (p: PipelineGetDto) => void;
  onDeactivate: (p: PipelineGetDto) => void;
  onRestore: (p: PipelineGetDto) => void;
  onDelete: (p: PipelineGetDto) => void;
  formatData: (dt: string) => string;
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
      "& .MuiTooltip-arrow": {
        color: "var(--color-azul-unb-hover)",
      },
    },
  },
};

export const PipelineCard = ({
  pipeline,
  onView,
  onEdit,
  onDeactivate,
  onRestore,
  onDelete,
  formatData,
}: PipelineCardProps) => {
  const getDisplayDesc = (desc: string | null | undefined) => {
    if (!desc) return "";
    const lines = desc
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return "";
    const firstLine = lines[0];
    if (lines.length > 1 || desc.includes("\n")) {
      return firstLine.endsWith("...") ? firstLine : `${firstLine}...`;
    }
    return firstLine;
  };

  const displayDesc = getDisplayDesc(pipeline.descricao);

  return (
    <div
      onClick={() => onView(pipeline)}
      className="group flex flex-col md:grid md:grid-cols-12 items-center gap-4 bg-fundo-superficie p-5 transition hover:bg-fundo-superficie-suave cursor-pointer rounded shadow-sm"
    >
      {/* Column 1: Name and Description (col-span-5) */}
      <div className="col-span-5 min-w-0 w-full">
        <h3 className="font-bold text-texto-principal text-base group-hover:text-destaque transition-colors truncate">
          {pipeline.nome}
        </h3>
        <p className="text-sm text-texto-secundario mt-1 truncate h-[20px] leading-normal">
          {displayDesc || (
            <span className="italic text-texto-secundario/60">
              Sem descrição informada.
            </span>
          )}
        </p>
      </div>

      {/* Column 2: Status Badge matching Dashboard (col-span-2) */}
      <div className="col-span-2 flex justify-start w-full select-none">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold ${
            pipeline.ativo
              ? "bg-[#16a34a] text-white"
              : "bg-[#dc2626] text-white"
          }`}
        >
          {pipeline.ativo ? "Ativa" : "Desativada"}
        </span>
      </div>

      {/* Column 3: Dates Panel (col-span-4) */}
      <div className="col-span-4 flex flex-col gap-1 w-full text-xs text-texto-secundario">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-texto-secundario/65" />
          <span>Criada: {formatData(pipeline.createdAt)}</span>
        </div>
        {pipeline.updatedAt && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-texto-secundario/65" />
            <span>Atualizada: {formatData(pipeline.updatedAt)}</span>
          </div>
        )}
      </div>

      {/* Column 4: Circular Action Buttons (col-span-1) */}
      <div
        className="col-span-1 flex items-center justify-end gap-2 w-full"
        onClick={(e) => e.stopPropagation()} // Prevent modal details popup
      >
        {pipeline.ativo ? (
          <>
            <Tooltip title="Editar Pipeline" arrow slotProps={tooltipSlotProps}>
              <IconButton
                size="medium"
                onClick={() => onEdit(pipeline)}
                sx={{
                  color: "var(--color-titulo-destaque)",
                  bgcolor: "rgba(59, 130, 246, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(59, 130, 246, 0.18)" },
                }}
              >
                <Pencil className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="Desativar Pipeline"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onDeactivate(pipeline)}
                sx={{
                  color: "#d97706",
                  bgcolor: "rgba(217, 119, 6, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(217, 119, 6, 0.18)" },
                }}
              >
                <Power className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="Restaurar" arrow slotProps={tooltipSlotProps}>
              <IconButton
                size="medium"
                onClick={() => onRestore(pipeline)}
                sx={{
                  color: "success.main",
                  bgcolor: "rgba(16, 185, 129, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(16, 185, 129, 0.18)" },
                }}
              >
                <ArchiveRestore className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="Excluir Permanentemente"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onDelete(pipeline)}
                sx={{
                  color: "error.main",
                  bgcolor: "rgba(239, 68, 68, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(239, 68, 68, 0.18)" },
                }}
              >
                <Trash2 className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

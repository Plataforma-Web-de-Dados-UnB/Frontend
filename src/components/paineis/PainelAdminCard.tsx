import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Pencil,
  Power,
  Trash2,
  ArchiveRestore,
} from "lucide-react";
import type { PainelGetDto } from "@/types/dtos";

export interface PainelAdminCardProps {
  painel: PainelGetDto;
  onView: (p: PainelGetDto) => void;
  onEdit: (p: PainelGetDto) => void;
  onToggleActive: (p: PainelGetDto) => void;
  onDelete: (p: PainelGetDto) => void;
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

export const PainelAdminCard = ({
  painel,
  onView,
  onEdit,
  onToggleActive,
  onDelete,
  formatData,
}: PainelAdminCardProps) => {
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

  const displayDesc = getDisplayDesc(painel.descricao);

  return (
    <div
      onClick={() => onView(painel)}
      className="group flex flex-col md:grid md:grid-cols-12 items-center gap-4 bg-fundo-superficie p-5 transition hover:bg-fundo-superficie-suave cursor-pointer rounded shadow-sm"
    >
      {/* Column 1: Name, Description and Link (col-span-5) */}
      <div className="col-span-5 min-w-0 w-full">
        <h3 className="font-bold text-texto-principal text-base group-hover:text-destaque transition-colors truncate">
          {painel.nome}
        </h3>
        <p className="text-sm text-texto-secundario mt-1 truncate h-[20px] leading-normal">
          {displayDesc || (
            <span className="italic text-texto-secundario/60">
              Sem descrição informada.
            </span>
          )}
        </p>
        <Button
          component={Link}
          to={painel.graphEmbedLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
          }}
          sx={{
            color: "var(--color-titulo-destaque)",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.75rem",
            padding: "4px 0px 2px 0px",
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
              left: 0,
              right: 0,
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
          {painel.graphEmbedLink}
        </Button>
      </div>

      {/* Column 2: Status Badge (col-span-2) */}
      <div className="col-span-2 flex justify-start w-full select-none">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold ${
            painel.active
              ? "bg-[#16a34a] text-white"
              : "bg-[#dc2626] text-white"
          }`}
        >
          {painel.active ? "Ativo" : "Inativo"}
        </span>
      </div>

      {/* Column 3: Categoria Badge (col-span-2) */}
      <div className="col-span-2 flex justify-start w-full select-none">
        <span
          className="inline-block max-w-[200px] truncate px-2.5 py-1 rounded text-xs font-bold bg-azul-unb text-white uppercase tracking-wider text-left"
          title={painel.categoriaNome || "Sem Categoria"}
        >
          {painel.categoriaNome || "Sem Categoria"}
        </span>
      </div>

      {/* Column 4: Dates Panel (col-span-2) */}
      <div className="col-span-2 flex flex-col gap-1 w-full text-xs text-texto-secundario">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-texto-secundario/65" />
          <span>Criado: {formatData(painel.createdAt)}</span>
        </div>
        {painel.updatedAt && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-texto-secundario/65" />
            <span>Atualizado: {formatData(painel.updatedAt)}</span>
          </div>
        )}
      </div>

      {/* Column 5: Circular Action Buttons (col-span-1) */}
      <div
        className="col-span-1 flex items-center justify-end gap-1.5 w-full"
        onClick={(e) => e.stopPropagation()} // Prevent card view click
      >
        {painel.active ? (
          <>
            <Tooltip title="Editar Painel" arrow slotProps={tooltipSlotProps}>
              <IconButton
                size="medium"
                onClick={() => onEdit(painel)}
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
              title="Desativar Painel"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onToggleActive(painel)}
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
            <Tooltip title="Reativar Painel" arrow slotProps={tooltipSlotProps}>
              <IconButton
                size="medium"
                onClick={() => onToggleActive(painel)}
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

            <Tooltip title="Excluir Painel" arrow slotProps={tooltipSlotProps}>
              <IconButton
                size="medium"
                onClick={() => onDelete(painel)}
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

import type { CategoriaGetDto } from "@/types/dtos";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  LayoutList,
  BarChart2,
  Pencil,
  Power,
  ArchiveRestore,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";

interface CategoriaAdminCardProps {
  categoria: CategoriaGetDto;
  onView: (c: CategoriaGetDto) => void;
  onEdit: (c: CategoriaGetDto) => void;
  onDeactivate: (c: CategoriaGetDto) => void;
  onRestore: (c: CategoriaGetDto) => void;
  onDelete: (c: CategoriaGetDto) => void;
  onViewImage: (c: CategoriaGetDto) => void;
  isToggling: boolean;
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

export const CategoriaAdminCard = ({
  categoria,
  onView,
  onEdit,
  onDeactivate,
  onRestore,
  onDelete,
  onViewImage,
  isToggling,
}: CategoriaAdminCardProps) => {
  const formatDataLocal = (dataStr?: string | null) => {
    if (!dataStr) return "-";
    try {
      if (dataStr.startsWith("0001") || dataStr.startsWith("1970")) {
        return "-";
      }
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

  return (
    <div
      onClick={() => onView(categoria)}
      className="group flex flex-col md:grid md:grid-cols-12 items-center gap-4 bg-fundo-superficie p-5 transition hover:bg-fundo-superficie-suave rounded shadow-sm border border-transparent hover:border-destaque/10 cursor-pointer"
    >
      {/* Column 1: Image and Info (col-span-5) */}
      <div className="col-span-5 flex items-center gap-4 w-full min-w-0">
        <div
          onClick={(e) => {
            if (categoria.imagemUrl) {
              e.stopPropagation();
              onViewImage(categoria);
            }
          }}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded bg-azul-unb-suave border border-borda-padrao/20 overflow-hidden ${
            categoria.imagemUrl
              ? "cursor-zoom-in hover:brightness-95 transition"
              : ""
          }`}
        >
          {categoria.imagemUrl ? (
            <img
              src={categoria.imagemUrl}
              alt={categoria.nome}
              className="h-full w-full object-contain"
            />
          ) : (
            <LayoutList className="h-6 w-6 text-titulo-destaque" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-texto-principal text-base group-hover:text-destaque transition-colors truncate">
            {categoria.nome}
          </h3>
          {categoria.descricao ? (
            <p className="text-sm text-texto-secundario mt-1 truncate h-[20px] leading-normal">
              {categoria.descricao}
            </p>
          ) : (
            <p className="text-sm italic text-texto-secundario/60 mt-1 h-[20px] leading-normal">
              Sem descrição informada.
            </p>
          )}
        </div>
      </div>

      {/* Column 2: Status Badge (col-span-2) */}
      <div className="col-span-2 flex justify-start w-full select-none">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold ${
            categoria.active
              ? "bg-[#16a34a] text-white"
              : "bg-[#dc2626] text-white"
          }`}
        >
          {categoria.active ? "Ativa" : "Desativada"}
        </span>
      </div>

      {/* Column 3: Dates Panel (col-span-3) */}
      <div className="col-span-3 flex flex-col gap-1 w-full text-xs text-texto-secundario min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Calendar className="h-3.5 w-3.5 text-texto-secundario/65 shrink-0" />
          <span className="truncate">
            Criada: {formatDataLocal(categoria.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock className="h-3.5 w-3.5 text-texto-secundario/65 shrink-0" />
          <span className="truncate">
            Atualizada: {formatDataLocal(categoria.updatedAt)}
          </span>
        </div>
      </div>

      {/* Column 4: Dashboard count (col-span-1) */}
      <div className="col-span-1 flex items-center gap-1 w-full text-xs text-texto-secundario select-none min-w-0">
        <BarChart2 className="h-4 w-4 text-texto-secundario/65 shrink-0" />
        <span className="truncate">
          Painéis: {categoria.quantidadePaineis ?? 0}
        </span>
      </div>

      {/* Column 5: Actions (col-span-1) */}
      <div
        className="col-span-1 flex items-center justify-end gap-2 w-full shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {categoria.active ? (
          <>
            <Tooltip
              title="Editar Categoria"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onEdit(categoria)}
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
              title="Desativar Categoria"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onDeactivate(categoria)}
                disabled={isToggling}
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
            <Tooltip
              title="Reativar Categoria"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onRestore(categoria)}
                disabled={isToggling}
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
                onClick={() => onDelete(categoria)}
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

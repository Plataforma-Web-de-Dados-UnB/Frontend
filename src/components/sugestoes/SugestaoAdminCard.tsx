import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import type { SugestaoListDto, StatusSugestao } from "@/types/dtos";
import { TipoSugestaoLabel, StatusSugestaoLabel } from "@/types/dtos";

export interface SugestaoAdminCardProps {
  sugestao: SugestaoListDto;
  onView: (sugestao: SugestaoListDto) => void;
  onUpdateStatus: (sugestao: SugestaoListDto, status: StatusSugestao) => void;
  formatData: (dateStr: string) => string;
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

export const SugestaoAdminCard = ({
  sugestao,
  onView,
  onUpdateStatus,
  formatData,
}: SugestaoAdminCardProps) => {
  const getTipoBadgeClass = (tipo: string | number) => {
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
        return "bg-borda-padrao text-texto-principal";
    }
  };

  const getStatusBadgeClass = (status: string | number) => {
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

  const displayDesc = getDisplayDesc(sugestao.descricao);

  return (
    <div
      onClick={() => onView(sugestao)}
      className="group flex flex-col md:grid md:grid-cols-12 items-center gap-4 bg-fundo-superficie p-5 transition hover:bg-fundo-superficie-suave cursor-pointer rounded shadow-sm"
    >
      {/* Column 1: Título e Descrição (col-span-4) */}
      <div className="col-span-4 min-w-0 w-full">
        <h3 className="font-bold text-texto-principal text-base group-hover:text-destaque transition-colors truncate">
          {sugestao.titulo}
        </h3>
        <p className="text-sm text-texto-secundario mt-1 truncate h-[20px] leading-normal font-medium">
          {displayDesc || (
            <span className="italic text-texto-secundario/60 font-normal">
              Sem descrição informada.
            </span>
          )}
        </p>
      </div>

      {/* Column 2: Nome e Email (col-span-2) */}
      <div className="col-span-2 min-w-0 w-full flex flex-col gap-0.5 text-sm text-texto-principal font-semibold">
        <div className="truncate" title={sugestao.nomeContato || "Anônimo"}>
          {sugestao.nomeContato || (
            <span className="italic text-texto-secundario/50 font-normal">
              Anônimo
            </span>
          )}
        </div>
        {sugestao.emailContato && (
          <div className="truncate">
            <Button
              component="a"
              href={`mailto:${sugestao.emailContato}`}
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
              {sugestao.emailContato}
            </Button>
          </div>
        )}
      </div>

      {/* Column 3: Badge Status (col-span-2) */}
      <div className="col-span-2 flex justify-start w-full select-none">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold ${getStatusBadgeClass(sugestao.status)}`}
        >
          {StatusSugestaoLabel[sugestao.status] || "Pendente"}
        </span>
      </div>

      {/* Column 4: Badge Tipo (col-span-1) */}
      <div className="col-span-1 flex justify-start w-full select-none">
        <span
          className={`inline-block max-w-[200px] truncate px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider text-left ${getTipoBadgeClass(sugestao.tipo)}`}
        >
          {TipoSugestaoLabel[sugestao.tipo] || "Sugestão"}
        </span>
      </div>

      {/* Column 5: Criada e Atualizada (col-span-2) */}
      <div className="col-span-2 flex flex-col gap-1 w-full text-xs text-texto-secundario">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-texto-secundario/65" />
          <span>Criada: {formatData(sugestao.createdAt)}</span>
        </div>
        {sugestao.updatedAt && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-texto-secundario/65" />
            <span>Atualizada: {formatData(sugestao.updatedAt)}</span>
          </div>
        )}
      </div>

      {/* Column 6: Botão/Botões (col-span-1) */}
      <div
        className="col-span-1 flex items-center justify-end gap-1.5 w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {(sugestao.status === 0 || sugestao.status === "Pendente") && (
          <>
            <Tooltip
              title="Marcar como Analisada"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onUpdateStatus(sugestao, 1)}
                sx={{
                  color: "success.main",
                  bgcolor: "rgba(22, 163, 74, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(22, 163, 74, 0.18)" },
                }}
              >
                <CheckCircle className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Descartar" arrow slotProps={tooltipSlotProps}>
              <IconButton
                size="medium"
                onClick={() => onUpdateStatus(sugestao, 2)}
                sx={{
                  color: "error.main",
                  bgcolor: "rgba(220, 38, 38, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(220, 38, 38, 0.18)" },
                }}
              >
                <XCircle className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>
          </>
        )}

        {(sugestao.status === 1 || sugestao.status === "Analisado") && (
          <>
            <Tooltip
              title="Marcar como Pendente"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onUpdateStatus(sugestao, 0)}
                sx={{
                  color: "warning.main",
                  bgcolor: "rgba(217, 119, 6, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(217, 119, 6, 0.18)" },
                }}
              >
                <Clock className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Descartar" arrow slotProps={tooltipSlotProps}>
              <IconButton
                size="medium"
                onClick={() => onUpdateStatus(sugestao, 2)}
                sx={{
                  color: "error.main",
                  bgcolor: "rgba(220, 38, 38, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(220, 38, 38, 0.18)" },
                }}
              >
                <XCircle className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>
          </>
        )}

        {(sugestao.status === 2 || sugestao.status === "Descartado") && (
          <>
            <Tooltip
              title="Marcar como Pendente"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onUpdateStatus(sugestao, 0)}
                sx={{
                  color: "warning.main",
                  bgcolor: "rgba(217, 119, 6, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(217, 119, 6, 0.18)" },
                }}
              >
                <Clock className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Marcar como Analisada"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onUpdateStatus(sugestao, 1)}
                sx={{
                  color: "success.main",
                  bgcolor: "rgba(22, 163, 74, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(22, 163, 74, 0.18)" },
                }}
              >
                <CheckCircle className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

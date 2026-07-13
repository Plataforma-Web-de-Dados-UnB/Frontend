import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  CheckCircle2,
  XCircle,
  Mail,
  Calendar,
  Trash2,
  Clock,
} from "lucide-react";
import type { UsuarioGetDto } from "@/types/dtos";

interface UsuarioAdminCardProps {
  usuario: UsuarioGetDto;
  onAprovar: (u: UsuarioGetDto) => void;
  onRevogar: (u: UsuarioGetDto) => void;
  onRecusar: (u: UsuarioGetDto) => void;
  onExcluir: (u: UsuarioGetDto) => void;
  onView: (u: UsuarioGetDto) => void;
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

export const UsuarioAdminCard = ({
  usuario,
  onAprovar,
  onRevogar,
  onRecusar,
  onExcluir,
  onView,
  isToggling,
}: UsuarioAdminCardProps) => {
  const getInitials = (nome: string, ultimoNome: string) => {
    return `${nome.charAt(0)}${ultimoNome.charAt(0)}`.toUpperCase();
  };

  const getStatusBadgeClass = (status: string) => {
    const map: Record<string, string> = {
      Pendente: "bg-[#d97706] text-white",
      Ativo: "bg-[#16a34a] text-white",
      Recusado: "bg-[#dc2626] text-white",
    };
    return map[status] ?? "bg-slate-500 text-white";
  };

  const getCargoBadgeClass = (cargo: string) => {
    const map: Record<string, string> = {
      SuperAdministrador: "bg-[#6b4683] text-white border border-[#6b4683]/10",
      Administrador: "bg-[#0369a1] text-white border border-[#0369a1]/10",
      Visitante: "bg-[#64748b] text-white border border-[#64748b]/10",
    };
    return map[cargo] ?? "bg-slate-500 text-white";
  };

  const getCargoLabel = (cargo: string) => {
    if (cargo === "SuperAdministrador") return "Super Admin";
    return cargo;
  };

  return (
    <div
      onClick={() => onView(usuario)}
      className="group flex flex-col md:grid md:grid-cols-12 items-center gap-4 bg-fundo-superficie p-5 transition hover:bg-fundo-superficie-suave rounded shadow-sm border border-transparent hover:border-destaque/10 cursor-pointer"
    >
      {/* Column 1: Info (col-span-5) */}
      <div className="col-span-5 flex items-center gap-3.5 w-full min-w-0">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-titulo-destaque/10 font-sans text-sm font-black text-titulo-destaque select-none">
          {getInitials(usuario.nome, usuario.ultimoNome)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-texto-principal text-base group-hover:text-destaque transition-colors truncate">
            {usuario.nome} {usuario.ultimoNome}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-texto-secundario mt-1 min-w-0">
            <Mail className="h-3.5 w-3.5 text-texto-secundario/65 shrink-0" />
            <span className="truncate">{usuario.email}</span>
          </div>
        </div>
      </div>

      {/* Column 2: Status Badge (col-span-2) */}
      <div className="col-span-2 flex justify-start w-full select-none">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold ${getStatusBadgeClass(
            usuario.status,
          )}`}
        >
          {usuario.status}
        </span>
      </div>

      {/* Column 3: Cargo Badge (col-span-2) */}
      <div className="col-span-2 flex justify-start w-full select-none">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold ${getCargoBadgeClass(
            usuario.cargo,
          )}`}
        >
          {getCargoLabel(usuario.cargo)}
        </span>
      </div>

      {/* Column 4: Date (col-span-2) */}
      <div className="col-span-2 flex flex-col justify-center gap-1 w-full text-xs text-texto-secundario min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Calendar className="h-3.5 w-3.5 text-texto-secundario/65 shrink-0" />
          <span className="truncate">
            Criado: {new Date(usuario.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock className="h-3.5 w-3.5 text-texto-secundario/65 shrink-0" />
          <span className="truncate">
            Atualizado:{" "}
            {new Date(usuario.updatedAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </div>

      {/* Column 5: Actions (col-span-1) */}
      <div
        className="col-span-1 flex items-center justify-end gap-2 w-full shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {usuario.cargo === "SuperAdministrador" ? (
          <Tooltip
            title="Super Administradores não podem ser alterados"
            arrow
            slotProps={tooltipSlotProps}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400 select-none">
              <XCircle className="h-4.5 w-4.5" />
            </span>
          </Tooltip>
        ) : usuario.status === "Ativo" ? (
          <Tooltip title="Revogar Acesso" arrow slotProps={tooltipSlotProps}>
            <IconButton
              size="medium"
              onClick={() => onRevogar(usuario)}
              disabled={isToggling}
              sx={{
                color: "#d97706",
                bgcolor: "rgba(217, 119, 6, 0.08)",
                borderRadius: "50%",
                p: 1,
                "&:hover": { bgcolor: "rgba(217, 119, 6, 0.18)" },
              }}
            >
              <XCircle className="h-4.5 w-4.5" />
            </IconButton>
          </Tooltip>
        ) : usuario.status === "Pendente" ? (
          <>
            <Tooltip
              title="Aprovar Cadastro"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onAprovar(usuario)}
                disabled={isToggling}
                sx={{
                  color: "success.main",
                  bgcolor: "rgba(16, 185, 129, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(16, 185, 129, 0.18)" },
                }}
              >
                <CheckCircle2 className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="Recusar Cadastro"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onRecusar(usuario)}
                disabled={isToggling}
                sx={{
                  color: "#d97706",
                  bgcolor: "rgba(217, 119, 6, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(217, 119, 6, 0.18)" },
                }}
              >
                <XCircle className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="Excluir Permanentemente"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onExcluir(usuario)}
                disabled={isToggling}
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
        ) : (
          <>
            <Tooltip
              title="Aprovar/Reativar Cadastro"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onAprovar(usuario)}
                disabled={isToggling}
                sx={{
                  color: "success.main",
                  bgcolor: "rgba(16, 185, 129, 0.08)",
                  borderRadius: "50%",
                  p: 1,
                  "&:hover": { bgcolor: "rgba(16, 185, 129, 0.18)" },
                }}
              >
                <CheckCircle2 className="h-4.5 w-4.5" />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="Excluir Permanentemente"
              arrow
              slotProps={tooltipSlotProps}
            >
              <IconButton
                size="medium"
                onClick={() => onExcluir(usuario)}
                disabled={isToggling}
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

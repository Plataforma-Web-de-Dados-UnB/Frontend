import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { X, Calendar, Clock, Mail } from "lucide-react";
import type { UsuarioGetDto } from "@/types/dtos";

export interface UsuarioDetailModalProps {
  open: boolean;
  onClose: () => void;
  usuario: UsuarioGetDto | null;
}

export const UsuarioDetailModal = ({
  open,
  onClose,
  usuario,
}: UsuarioDetailModalProps) => {
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

  const getStatusBadgeClass = (status?: string) => {
    if (!status) return "bg-slate-500 text-white";
    const map: Record<string, string> = {
      Pendente: "bg-[#d97706] text-white",
      Ativo: "bg-[#16a34a] text-white",
      Recusado: "bg-[#dc2626] text-white",
    };
    return map[status] ?? "bg-slate-500 text-white";
  };

  const getCargoBadgeClass = (cargo?: string) => {
    if (!cargo) return "bg-slate-500 text-white";
    const map: Record<string, string> = {
      SuperAdministrador: "bg-[#6b4683] text-white border border-[#6b4683]/10",
      Administrador: "bg-[#0369a1] text-white border border-[#0369a1]/10",
      Visitante: "bg-[#64748b] text-white border border-[#64748b]/10",
    };
    return map[cargo] ?? "bg-slate-500 text-white";
  };

  const getCargoLabel = (cargo?: string) => {
    if (!cargo) return "";
    if (cargo === "SuperAdministrador") return "Super Admin";
    return cargo;
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
      {usuario && (
        <>
          <DialogTitle
            sx={{
              m: 0,
              px: 4,
              pt: 0,
              pb: 2,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--color-borda-padrao)",
            }}
          >
            <div className="flex flex-col min-w-0 mt-6">
              <span className="text-2xl font-extrabold tracking-tight font-sans text-texto-principal truncate pr-4">
                {usuario.nome} {usuario.ultimoNome}
              </span>
              <div className="flex items-center gap-1.5 text-sm text-texto-secundario mt-1 truncate">
                <Mail className="h-4 w-4 text-texto-secundario/65 shrink-0" />
                <span>{usuario.email}</span>
              </div>
            </div>
            <IconButton
              onClick={onClose}
              sx={{
                color: "var(--color-erro)",
                bgcolor: "transparent",
                borderRadius: "50%",
                transition: "all 0.2s ease-in-out",
                flexShrink: 0,
                mt: "18px",
                "&:hover": {
                  bgcolor: "var(--color-vermelho-claro)",
                  color: "var(--color-vermelho-escuro)",
                },
              }}
            >
              <X className="h-5 w-5" />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ px: 4, pt: 3, pb: 4 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Box 1: Status & Role */}
              <div className="rounded p-5 bg-borda-padrao/20 flex flex-col gap-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario">
                  Informações de Acesso
                </h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-texto-secundario">
                      Cargo
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded text-xs font-bold select-none ${getCargoBadgeClass(usuario.cargo)}`}
                    >
                      {getCargoLabel(usuario.cargo)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-texto-secundario">
                      Status
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded text-xs font-bold select-none ${getStatusBadgeClass(usuario.status)}`}
                    >
                      {usuario.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Box 2: Timeline Dates */}
              <div className="rounded p-5 bg-borda-padrao/20 flex flex-col gap-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario">
                  Histórico da Conta
                </h4>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-texto-secundario flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-texto-secundario shrink-0" />
                      Criado em
                    </span>
                    <span className="text-sm text-texto-secundario">
                      {formatDataLocal(usuario.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-texto-secundario flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-texto-secundario shrink-0" />
                      Atualizado em
                    </span>
                    <span className="text-sm text-texto-secundario">
                      {formatDataLocal(usuario.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

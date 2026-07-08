import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Users, Mail, Clock, ShieldAlert } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import { usuarioApi } from "@/services/usuarioApi";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { openDialog } from "@/utils/dialog";
import type { UsuarioGetDto } from "@/types/dtos";
import { toast } from "sonner";
import CircularProgress from "@mui/material/CircularProgress";

const MODAL_APROVAR = "usuario-aprovar-modal";
const MODAL_REVOGAR = "usuario-revogar-modal";
const PAGE_SIZE = 10;

export const UsuariosPage = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<UsuarioGetDto | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["usuarios", page],
    queryFn: () => usuarioApi.list(page, PAGE_SIZE),
  });

  const aprovarMutation = useMutation({
    mutationFn: usuarioApi.aprovar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["usuarios"] });
      setTarget(null);
      toast.success("Usuário aprovado com sucesso!");
    },
    onError: (err: any) => toast.error(err.message || "Erro ao aprovar usuário."),
  });

  const revogarMutation = useMutation({
    mutationFn: usuarioApi.revogar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["usuarios"] });
      setTarget(null);
      toast.success("Acesso revogado com sucesso!");
    },
    onError: (err: any) => toast.error(err.message || "Erro ao revogar acesso."),
  });

  const pendentes = data?.itens.filter((u) => u.status === "Pendente") ?? [];

  const getStatusBadgeClass = (status: string) => {
    const map: Record<string, string> = {
      Pendente: "bg-amber-50 text-amber-700 border border-amber-200/60",
      Ativo: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
      Administrador: "bg-blue-50 text-blue-700 border border-blue-200/60",
      SuperAdministrador: "bg-indigo-50 text-indigo-700 border border-indigo-200/60",
      Recusado: "bg-rose-50 text-rose-700 border border-rose-200/60",
    };
    return map[status] ?? "bg-slate-50 text-slate-600 border border-slate-200/60";
  };

  const getInitials = (nome: string, ultimoNome: string) => {
    return `${nome.charAt(0)}${ultimoNome.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho Premium */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-azul-unb/90 to-azul-unb p-6 text-white shadow-md">
        <div className="relative z-10">
          <h1 className="text-2xl font-black tracking-tight font-sans">Gestão de Usuários</h1>
          <p className="mt-1.5 text-sm text-white/80 max-w-2xl font-medium">
            Gerencie as permissões e aprove ou revogue os acessos dos usuários da plataforma de dados institucionais.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* Solicitações pendentes com estilo Premium */}
      {pendentes.length > 0 && (
        <div className="flex items-center gap-4 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100/80 text-amber-700 shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-amber-800 text-sm">
              Solicitações de Acesso Pendentes ({pendentes.length})
            </p>
            <p className="text-xs text-amber-700/90 mt-0.5 font-medium">
              Há novos cadastros aguardando aprovação para liberação de acesso ao portal.
            </p>
          </div>
        </div>
      )}

      {/* Lista de Usuários */}
      <div className="rounded-xl border border-borda-padrao bg-fundo-superficie shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <CircularProgress size={32} className="text-destaque" />
          </div>
        ) : !data || data.itens.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 p-8 text-center">
            <Users className="h-10 w-10 text-texto-secundario/40 mb-2" />
            <p className="font-bold text-texto-principal">Nenhum usuário cadastrado</p>
          </div>
        ) : (
          <div className="divide-y divide-borda-padrao/50">
            {data.itens.map((u) => (
              <div
                key={u.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-fundo-superficie-suave/30 transition-colors"
              >
                {/* Info do Usuário com iniciais estilo avatar */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-azul-unb/10 font-sans text-sm font-black text-azul-unb">
                    {getInitials(u.nome, u.ultimoNome)}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-texto-principal text-sm">
                        {u.nome} {u.ultimoNome}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wide uppercase ${getStatusBadgeClass(
                          u.status
                        )}`}
                      >
                        {u.status}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wide uppercase ${getStatusBadgeClass(
                          u.cargo
                        )}`}
                      >
                        {u.cargo}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-texto-secundario">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{u.email}</span>
                    </div>
                  </div>
                </div>

                {/* Data e Ações */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-texto-secundario font-medium">
                    <Clock className="h-3.5 w-3.5 text-texto-secundario/60" />
                    <span>
                      Desde: {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {(u.status === "Pendente" || u.status === "Recusado") && (
                      <IconButton
                        title="Aprovar Cadastro"
                        color="success"
                        sx={{
                          bgcolor: "success.light",
                          color: "success.dark",
                          p: 1,
                          "&:hover": { bgcolor: "rgba(16, 185, 129, 0.2)" }
                        }}
                        onClick={() => {
                          setTarget(u);
                          openDialog(MODAL_APROVAR);
                        }}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </IconButton>
                    )}
                    {u.status === "Ativo" && (
                      <IconButton
                        title="Revogar Acesso"
                        color="error"
                        sx={{
                          bgcolor: "error.light",
                          color: "error.dark",
                          p: 1,
                          "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)" }
                        }}
                        onClick={() => {
                          setTarget(u);
                          openDialog(MODAL_REVOGAR);
                        }}
                      >
                        <XCircle className="h-5 w-5" />
                      </IconButton>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginação */}
      {data && data.totalPaginas > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={page}
            totalPages={data.totalPaginas}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Diálogos de Confirmação Premium */}
      <ConfirmDialog
        id={MODAL_APROVAR}
        title="Aprovar Usuário"
        description={`Tem certeza que deseja aprovar o cadastro de "${target?.nome} ${target?.ultimoNome}"? Isto liberará seu acesso para visualização de painéis administrativos.`}
        confirmText="Aprovar"
        confirmTone="primary"
        isLoading={aprovarMutation.isPending}
        onConfirm={() => target && aprovarMutation.mutate(target.id)}
      />

      <ConfirmDialog
        id={MODAL_REVOGAR}
        title="Revogar Acesso"
        description={`Tem certeza que deseja revogar o acesso de "${target?.nome} ${target?.ultimoNome}"? O usuário perderá permissão para visualizar e acessar a plataforma.`}
        confirmText="Revogar Acesso"
        confirmTone="danger"
        isLoading={revogarMutation.isPending}
        onConfirm={() => target && revogarMutation.mutate(target.id)}
      />
    </div>
  );
};

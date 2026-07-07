import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Users } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import { usuarioApi } from "@/services/usuarioApi";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { openDialog } from "@/utils/dialog";
import type { UsuarioGetDto } from "@/types/dtos";
import { toast } from "sonner";

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
      toast.success("Usuário aprovado.");
    },
    onError: (err) => toast.error(err.message),
  });

  const revogarMutation = useMutation({
    mutationFn: usuarioApi.revogar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["usuarios"] });
      setTarget(null);
      toast.success("Acesso revogado.");
    },
    onError: (err) => toast.error(err.message),
  });

  const pendentes = data?.itens.filter((u) => u.status === "Pendente") ?? [];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Pendente: "bg-amarelo-claro text-amarelo-escuro",
      Ativo: "bg-verde-claro text-verde-escuro",
      Administrador: "bg-azul-claro text-azul-escuro",
      SuperAdministrador: "bg-azul-claro text-azul-escuro",
      Recusado: "bg-vermelho-claro text-vermelho-escuro",
    };
    return map[status] ?? "bg-cinza-claro text-cinza-escuro";
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-texto-principal">Usuários</h1>
      <p className="mt-1 text-sm text-texto-secundario">
        Os usuários que já foram aprovados também podem ter seu acesso revogado,
        caso necessário.
      </p>

      {/* Solicitações pendentes */}
      {pendentes.length > 0 && (
        <div className="mt-5 flex items-center gap-3 rounded border border-amarelo-escuro/30 bg-amarelo-claro px-5 py-4">
          <Users className="h-5 w-5 text-amarelo-escuro shrink-0" />
          <div>
            <p className="font-bold text-amarelo-escuro">
              Solicitações Pendentes ({pendentes.length})
            </p>
            <p className="text-sm text-amarelo-escuro/80">
              Há solicitações pendentes.
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 rounded border border-borda-padrao bg-fundo-superficie shadow-sm">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-destaque border-t-transparent" />
          </div>
        )}
        {!isLoading && data?.itens.length === 0 && (
          <p className="py-12 text-center text-sm text-texto-secundario">
            Nenhum usuário encontrado.
          </p>
        )}

        {!isLoading &&
          data?.itens.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center gap-4 border-b border-borda-padrao px-5 py-4 last:border-none"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-texto-principal">
                    {u.nome} {u.ultimoNome}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(u.status)}`}
                  >
                    {u.status}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(u.cargo)}`}
                  >
                    {u.cargo}
                  </span>
                </div>
                <p className="text-sm text-texto-secundario">{u.email}</p>
              </div>
              <p className="text-xs text-texto-secundario">
                Cadastrou-se em:{" "}
                {new Date(u.createdAt).toLocaleDateString("pt-BR")}
              </p>
              {u.status === "Pendente" && (
                <IconButton
                  title="Aprovar"
                  color="success"
                  sx={{ borderRadius: "50%", p: 1.5 }}
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
                  title="Revogar acesso"
                  color="error"
                  sx={{ borderRadius: "50%", p: 1.5 }}
                  onClick={() => {
                    setTarget(u);
                    openDialog(MODAL_REVOGAR);
                  }}
                >
                  <XCircle className="h-5 w-5" />
                </IconButton>
              )}
            </div>
          ))}
      </div>

      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPaginas}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        id={MODAL_APROVAR}
        title="Aprovar Usuário"
        description={`Tem certeza que deseja aprovar o acesso de "${target?.nome} ${target?.ultimoNome}"?`}
        confirmText="Aprovar"
        confirmTone="primary"
        isLoading={aprovarMutation.isPending}
        onConfirm={() => target && aprovarMutation.mutate(target.id)}
      />

      <ConfirmDialog
        id={MODAL_REVOGAR}
        title="Revogar Acesso"
        description={`Tem certeza que deseja revogar o acesso de "${target?.nome} ${target?.ultimoNome}"?`}
        confirmText="Revogar"
        confirmTone="danger"
        isLoading={revogarMutation.isPending}
        onConfirm={() => target && revogarMutation.mutate(target.id)}
      />
    </div>
  );
};

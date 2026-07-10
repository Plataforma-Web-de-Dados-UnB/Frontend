import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import { usuarioApi } from "@/services/usuarioApi";
import { PageHeaderCard } from "@/components/ui/PageHeaderCard";
import { MuiConfirmDialog } from "@/components/ui/MuiConfirmDialog";
import type { UsuarioGetDto } from "@/types/dtos";
import { toast } from "sonner";
import { UsuarioFilterBar } from "@/components/usuarios/UsuarioFilterBar";
import { UsuarioAdminCard } from "@/components/usuarios/UsuarioAdminCard";
import { UsuarioDetailModal } from "@/components/usuarios/UsuarioDetailModal";
import { useAuth } from "@/features/auth/useAuth";

const PAGE_SIZE = 5;

export const UsuariosPage = () => {
  const { isSuperAdmin } = useAuth();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [busca, setBusca] = useState("");
  const [filterCargo, setFilterCargo] = useState("");
  const [statusFilter, setStatusFilter] = useState("ativos");
  const [approvingUser, setApprovingUser] = useState<UsuarioGetDto | null>(
    null,
  );
  const [revokingUser, setRevokingUser] = useState<UsuarioGetDto | null>(null);
  const [rejectingUser, setRejectingUser] = useState<UsuarioGetDto | null>(
    null,
  );
  const [deletingUser, setDeletingUser] = useState<UsuarioGetDto | null>(null);
  const [viewing, setViewing] = useState<UsuarioGetDto | null>(null);

  // Map statusFilter tab to actual status parameter
  const getMappedStatus = (tab: string) => {
    if (tab === "ativos") return "Ativo";
    if (tab === "pendentes") return "Pendente";
    if (tab === "recusados") return "Recusado";
    return undefined; // "todos"
  };

  // Fetch users with filters
  const currentStatus = getMappedStatus(statusFilter);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["usuarios", page, statusFilter, filterCargo, busca],
    queryFn: () =>
      usuarioApi.list(
        page,
        PAGE_SIZE,
        currentStatus,
        filterCargo || undefined,
        busca || undefined,
      ),
  });

  // Query to get pending users count for the tab badge
  const { data: pendentesCountData } = useQuery({
    queryKey: ["usuarios-pendentes-count"],
    queryFn: () => usuarioApi.list(1, 100, "Pendente"),
  });
  const pendingCount = pendentesCountData?.totalItens ?? 0;

  // Mutations
  const aprovarMutation = useMutation({
    mutationFn: usuarioApi.aprovar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["usuarios"] });
      qc.invalidateQueries({ queryKey: ["usuarios-pendentes-count"] });
      setApprovingUser(null);
      toast.success("Usuário aprovado com sucesso!");
    },
    onError: (err: Error) =>
      toast.error(err.message || "Erro ao aprovar usuário."),
  });

  const revogarMutation = useMutation({
    mutationFn: usuarioApi.revogar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["usuarios"] });
      qc.invalidateQueries({ queryKey: ["usuarios-pendentes-count"] });
      if (revokingUser) {
        toast.success("Acesso revogado com sucesso!");
      } else if (rejectingUser) {
        toast.success("Solicitação de cadastro recusada com sucesso!");
      }
      setRevokingUser(null);
      setRejectingUser(null);
    },
    onError: (err: Error) =>
      toast.error(err.message || "Erro ao atualizar acesso."),
  });

  const excluirMutation = useMutation({
    mutationFn: usuarioApi.remover,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["usuarios"] });
      qc.invalidateQueries({ queryKey: ["usuarios-pendentes-count"] });
      setDeletingUser(null);
      toast.success("Usuário permanentemente excluído.");
    },
    onError: (err: Error) =>
      toast.error(err.message || "Erro ao excluir usuário."),
  });

  const handleSearchSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setBusca(searchTerm);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setBusca("");
    setFilterCargo("");
    setStatusFilter("ativos");
    setPage(1);
  };

  const handleCargoChange = (val: string) => {
    setFilterCargo(val);
    setPage(1);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const totalItens = data?.totalItens ?? 0;
  const startRange = totalItens === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endRange = Math.min(page * PAGE_SIZE, totalItens);

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-fundo-superficie rounded shadow-sm min-h-[500px] border border-borda-padrao">
        <h2 className="text-xl font-bold text-texto-principal font-sans">
          Acesso Restrito
        </h2>
        <p className="text-sm text-texto-secundario mt-2 max-w-md">
          Apenas Super Administradores possuem permissão para acessar a tela de
          gestão de usuários.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Card Top */}
      <PageHeaderCard
        title="Gestão de Usuários"
        description="Gerencie as permissões e aprove ou revogue os acessos dos usuários da plataforma de dados institucionais."
      />

      {/* Filter and Search Bar with Tabs */}
      <UsuarioFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
        filterCargo={filterCargo}
        setFilterCargo={handleCargoChange}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        pendingCount={pendingCount}
      />

      {/* Progress line for background updates */}
      <div className="h-[3px] w-full bg-borda-padrao/60 relative -mt-2 -mb-2">
        {isFetching && !isLoading && (
          <LinearProgress
            color="primary"
            className="absolute inset-0"
            sx={{
              height: 3,
              bgcolor: "transparent",
              "& .MuiLinearProgress-bar": {
                bgcolor: "var(--color-azul-unb-destaque)",
              },
            }}
          />
        )}
      </div>

      {/* Card List Container */}
      <div className="flex flex-col gap-5 min-h-[520px] relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-fundo-pagina/50 z-10">
            <CircularProgress color="primary" />
          </div>
        )}

        {!isLoading && totalItens === 0 && (
          <div className="flex flex-col items-center justify-start py-26 text-center bg-fundo-superficie rounded shadow-sm min-h-[612px]">
            <Users className="h-12 w-12 text-texto-secundario/40 mb-3" />
            <p className="font-semibold text-texto-principal">
              Nenhum usuário encontrado
            </p>
            <p className="text-sm text-texto-secundario mt-1">
              Experimente alterar os filtros ou a busca.
            </p>
          </div>
        )}

        {!isLoading && totalItens > 0 && data?.itens && (
          <div className="flex flex-col gap-3.5">
            {data.itens.map((u) => (
              <UsuarioAdminCard
                key={u.id}
                usuario={u}
                onAprovar={setApprovingUser}
                onRevogar={setRevokingUser}
                onRecusar={setRejectingUser}
                onExcluir={setDeletingUser}
                onView={setViewing}
                isToggling={
                  aprovarMutation.isPending ||
                  revogarMutation.isPending ||
                  excluirMutation.isPending
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Premium Pagination Footer */}
      {data && totalItens > 0 && (
        <div className="p-4 bg-fundo-superficie flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-texto-secundario rounded shadow-sm">
          <div>
            Mostrando{" "}
            <span className="font-semibold text-texto-principal">
              {startRange}
            </span>{" "}
            a{" "}
            <span className="font-semibold text-texto-principal">
              {endRange}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-texto-principal">
              {totalItens}
            </span>{" "}
            registros
          </div>

          <div className="flex items-center gap-1.5 select-none">
            <Button
              size="small"
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              sx={{
                borderRadius: "50%",
                minWidth: "36px",
                width: "36px",
                height: "36px",
                p: 0,
                border: "2px solid transparent",
                bgcolor: "var(--color-fundo-superficie-suave)",
                color: "var(--color-texto-principal)",
                "&:hover": {
                  border: "2px solid var(--color-destaque)",
                  bgcolor: "var(--color-destaque)",
                  color: "#ffffff",
                },
                "&.Mui-disabled": {
                  bgcolor: "var(--color-fundo-superficie-suave)",
                  border: "2px solid transparent",
                  opacity: 0.35,
                },
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center px-3 font-semibold text-texto-principal">
              Página {page} de {data.totalPaginas}
            </div>

            <Button
              size="small"
              variant="outlined"
              disabled={page >= data.totalPaginas}
              onClick={() => setPage((p) => p + 1)}
              sx={{
                borderRadius: "50%",
                minWidth: "36px",
                width: "36px",
                height: "36px",
                p: 0,
                border: "2px solid transparent",
                bgcolor: "var(--color-fundo-superficie-suave)",
                color: "var(--color-texto-principal)",
                "&:hover": {
                  border: "2px solid var(--color-destaque)",
                  bgcolor: "var(--color-destaque)",
                  color: "#ffffff",
                },
                "&.Mui-disabled": {
                  bgcolor: "var(--color-fundo-superficie-suave)",
                  border: "2px solid transparent",
                  opacity: 0.35,
                },
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <MuiConfirmDialog
        open={approvingUser !== null}
        onClose={() => setApprovingUser(null)}
        title="Aprovar Cadastro"
        description={`Tem certeza que deseja aprovar o cadastro de "${approvingUser?.nome} ${approvingUser?.ultimoNome}"? Isto concederá ao usuário acesso para visualização de painéis e relatórios da plataforma.`}
        confirmText="Aprovar"
        confirmTone="success"
        isLoading={aprovarMutation.isPending}
        onConfirm={() =>
          approvingUser && aprovarMutation.mutate(approvingUser.id)
        }
      />

      <MuiConfirmDialog
        open={revokingUser !== null}
        onClose={() => setRevokingUser(null)}
        title="Revogar Acesso"
        description={`Tem certeza que deseja revogar o acesso de "${revokingUser?.nome} ${revokingUser?.ultimoNome}"? O usuário perderá permissão para visualizar e acessar a plataforma.`}
        confirmText="Revogar"
        confirmTone="warning"
        isLoading={revogarMutation.isPending}
        onConfirm={() =>
          revokingUser && revogarMutation.mutate(revokingUser.id)
        }
      />

      <MuiConfirmDialog
        open={rejectingUser !== null}
        onClose={() => setRejectingUser(null)}
        title="Recusar Cadastro"
        description={`Tem certeza que deseja recusar o cadastro de "${rejectingUser?.nome} ${rejectingUser?.ultimoNome}"?`}
        confirmText="Recusar"
        confirmTone="danger"
        isLoading={revogarMutation.isPending}
        onConfirm={() =>
          rejectingUser && revogarMutation.mutate(rejectingUser.id)
        }
      />

      <MuiConfirmDialog
        open={deletingUser !== null}
        onClose={() => setDeletingUser(null)}
        title="Excluir Usuário"
        description={`Esta ação é irreversível e excluirá permanentemente o cadastro de "${deletingUser?.nome} ${deletingUser?.ultimoNome}" e todo o seu histórico da plataforma de dados.`}
        confirmText="Excluir"
        confirmTone="danger"
        isLoading={excluirMutation.isPending}
        onConfirm={() =>
          deletingUser && excluirMutation.mutate(deletingUser.id)
        }
        requireTextInput={true}
        textInputExpectedValue={deletingUser?.nome || ""}
      />

      <UsuarioDetailModal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        usuario={viewing}
      />
    </div>
  );
};

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import { ChevronLeft, ChevronRight, BarChart2 } from "lucide-react";
import { toast } from "sonner";

import { painelApi } from "@/services/painelApi";
import { categoriasApi } from "@/services/categoriasApi";
import { painelSchema, type PainelFormValues } from "@/schemas/forms";
import { isApiError } from "@/types/api";
import type { PainelGetDto } from "@/types/dtos";

import { PageHeaderCard } from "@/components/ui/PageHeaderCard";
import { MuiConfirmDialog } from "@/components/ui/MuiConfirmDialog";
import { PainelFilterBar } from "@/components/paineis/PainelFilterBar";
import { PainelAdminCard } from "@/components/paineis/PainelAdminCard";
import { PainelFormModal } from "@/components/paineis/PainelFormModal";
import { PainelDetailModal } from "@/components/paineis/PainelDetailModal";

const PAGE_SIZE = 4;

export const PaineisAdminPage = (): React.JSX.Element => {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  // Search and filter states
  const [page, setPage] = useState(1);
  const [buscaInput, setBuscaInput] = useState("");
  const [busca, setBusca] = useState("");
  const [filterCat, setFilterCat] = useState<number | "">("");
  const [statusFilter, setStatusFilter] = useState<
    "ativos" | "inativos" | "todos"
  >("ativos");

  // Dialog/Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<PainelGetDto | null>(null);
  const [viewing, setViewing] = useState<PainelGetDto | null>(null);
  const [deactivating, setDeactivating] = useState<PainelGetDto | null>(null);
  const [restoring, setRestoring] = useState<PainelGetDto | null>(null);
  const [deleting, setDeleting] = useState<PainelGetDto | null>(null);

  // Keyboard shortcut Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute active parameter for API
  const getAtivoParam = () => {
    if (statusFilter === "ativos") return true;
    if (statusFilter === "inativos") return false;
    return undefined;
  };

  // Queries
  const { data: categorias } = useQuery({
    queryKey: ["categorias-all"],
    queryFn: () => categoriasApi.listAll(),
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["paineis-admin", page, filterCat, busca, statusFilter],
    queryFn: () =>
      painelApi.listAdmin(
        page,
        PAGE_SIZE,
        filterCat || undefined,
        busca || undefined,
        getAtivoParam(),
      ),
  });

  // Forms hook
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PainelFormValues>({
    resolver: zodResolver(painelSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      graphEmbedLink: "",
      embedDashboardUuid: "",
      sortOrdem: 0,
      categoriaId: 0,
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: painelApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paineis-admin"] });
      setIsFormOpen(false);
      reset();
      toast.success("Painel criado com sucesso!");
    },
    onError: (err) => {
      if (isApiError(err)) setError("root", { message: err.message });
      else toast.error("Ocorreu um erro ao criar o painel.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PainelFormValues }) =>
      painelApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paineis-admin"] });
      setIsFormOpen(false);
      reset();
      setEditing(null);
      toast.success("Painel atualizado com sucesso!");
    },
    onError: (err) => {
      if (isApiError(err)) setError("root", { message: err.message });
      else toast.error("Ocorreu um erro ao atualizar o painel.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: painelApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paineis-admin"] });
      setDeleting(null);
      toast.success("Painel excluído com sucesso.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao excluir painel.");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: painelApi.toggleActive,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["paineis-admin"] });
      setDeactivating(null);
      setRestoring(null);
      toast.success(res?.message || "Status alterado com sucesso!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao alterar status do painel.");
    },
  });

  // Handlers
  const handleSearchSubmit = (e?: React.SyntheticEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setBusca(buscaInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setBuscaInput("");
    setBusca("");
    setFilterCat("");
    setStatusFilter("ativos");
    setPage(1);
  };

  const openNew = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const openEdit = (p: PainelGetDto) => {
    setEditing(p);
    setIsFormOpen(true);
  };

  const handleToggleActiveClick = (p: PainelGetDto) => {
    if (p.active) {
      setDeactivating(p);
    } else {
      setRestoring(p);
    }
  };

  const onSubmit = (values: PainelFormValues) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const formatData = (dataStr: string) => {
    return new Date(dataStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pagination stats
  const totalItens = data?.totalItens ?? 0;
  const totalPages = data?.totalPaginas ?? 1;
  const startRange = totalItens === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endRange = Math.min(page * PAGE_SIZE, totalItens);

  return (
    <div className="flex flex-col gap-6">
      <PageHeaderCard
        title="Gestão de Painéis"
        description="Os dashboards inseridos nestes painéis vêm do Apache Superset. Portanto, é importante criá-los lá primeiro para que possam ser incorporados aqui."
      />

      {/* Filter and Search Bar */}
      <PainelFilterBar
        searchTerm={buscaInput}
        setSearchTerm={setBuscaInput}
        inputRef={inputRef}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
        filterCat={filterCat}
        setFilterCat={(val) => {
          setFilterCat(val);
          setPage(1);
        }}
        categorias={categorias}
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        onNewClick={openNew}
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

      {/* List Container */}
      <div className="flex flex-col gap-5 min-h-[520px] relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-fundo-pagina/50 z-10">
            <CircularProgress color="primary" />
          </div>
        )}

        {!isLoading && totalItens === 0 && (
          <div className="flex flex-col items-center justify-start py-26 text-center bg-fundo-superficie rounded shadow-sm min-h-[612px]">
            <BarChart2 className="h-12 w-12 text-texto-secundario/40 mb-3" />
            <p className="font-semibold text-texto-principal">
              Nenhum painel encontrado
            </p>
            <p className="text-sm text-texto-secundario mt-1">
              Experimente alterar os filtros ou cadastrar um novo painel.
            </p>
          </div>
        )}

        {!isLoading && totalItens > 0 && data?.itens && (
          <div className="flex flex-col gap-3.5">
            {data.itens.map((p) => (
              <PainelAdminCard
                key={p.id}
                painel={p}
                onView={setViewing}
                onEdit={openEdit}
                onToggleActive={handleToggleActiveClick}
                onDelete={setDeleting}
                formatData={formatData}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
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

          <div className="flex items-center gap-1.5">
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
              Página {page} de {totalPages}
            </div>

            <Button
              size="small"
              variant="outlined"
              disabled={page >= totalPages}
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

      {/* Form Modal */}
      <PainelFormModal
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditing(null);
          reset();
        }}
        editingPainel={editing}
        register={register}
        control={control}
        setValue={setValue}
        errors={errors}
        isSubmitting={isSubmitting}
        categorias={categorias}
        onSubmit={handleSubmit(onSubmit)}
        isDirty={isDirty}
      />

      {/* Detail Modal */}
      <PainelDetailModal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        painel={viewing}
        formatData={formatData}
      />

      {/* Deactivate Confirm Modal */}
      <MuiConfirmDialog
        open={deactivating !== null}
        onClose={() => setDeactivating(null)}
        title="Desativar Painel"
        description={`Tem certeza que deseja desativar o painel "${deactivating?.nome}"? Ele ficará oculto na área pública.`}
        confirmText="Desativar"
        confirmTone="warning"
        isLoading={toggleMutation.isPending}
        onConfirm={() => deactivating && toggleMutation.mutate(deactivating.id)}
      />

      {/* Restore Confirm Modal */}
      <MuiConfirmDialog
        open={restoring !== null}
        onClose={() => setRestoring(null)}
        title="Reativar Painel"
        description={`Tem certeza que deseja reativar o painel "${restoring?.nome}"? Ele voltará a ficar visível na área pública.`}
        confirmText="Reativar"
        confirmTone="success"
        isLoading={toggleMutation.isPending}
        onConfirm={() => restoring && toggleMutation.mutate(restoring.id)}
      />

      {/* Delete Confirm Modal */}
      <MuiConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Excluir Painel"
        description={`Tem certeza que deseja excluir permanentemente o painel "${deleting?.nome}"? Essa ação é irreversível e removerá todos os dados do painel.`}
        confirmText="Excluir"
        confirmTone="danger"
        requireTextInput={true}
        textInputExpectedValue={deleting?.nome || ""}
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </div>
  );
};

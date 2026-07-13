import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import { ChevronLeft, ChevronRight, LayoutList } from "lucide-react";
import { PageHeaderCard } from "@/components/ui/PageHeaderCard";
import { startTour } from "@/features/tour/useTour";
import { adminCategoriasSteps } from "@/features/tour/tourSteps";
import { CategoriaFilterBar } from "@/components/categorias/CategoriaFilterBar";
import { CategoriaAdminCard } from "@/components/categorias/CategoriaAdminCard";
import { CategoriaFormModal } from "@/components/categorias/CategoriaFormModal";
import { CategoriaDetailModal } from "@/components/categorias/CategoriaDetailModal";
import { MuiConfirmDialog } from "@/components/ui/MuiConfirmDialog";
import { categoriasApi } from "@/services/categoriasApi";
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal";
import type { CategoriaGetDto } from "@/types/dtos";
import type { CategoriaFormValues } from "@/schemas/forms";
import { isApiError } from "@/types/api";
import { toast } from "sonner";

const PAGE_SIZE = 5;

export const CategoriasAdminPage = () => {
  const qc = useQueryClient();

  useEffect(() => {
    const t = setTimeout(
      () => startTour("admin-categorias", adminCategoriasSteps),
      600,
    );
    return () => clearTimeout(t);
  }, []);

  const [page, setPage] = useState(1);
  const [buscaInput, setBuscaInput] = useState("");
  const [busca, setBusca] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ativos" | "inativos" | "todos"
  >("ativos");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoriaGetDto | null>(null);
  const [viewing, setViewing] = useState<CategoriaGetDto | null>(null);
  const [viewingImage, setViewingImage] = useState<CategoriaGetDto | null>(
    null,
  );
  const [deactivating, setDeactivating] = useState<CategoriaGetDto | null>(
    null,
  );
  const [restoring, setRestoring] = useState<CategoriaGetDto | null>(null);
  const [deleting, setDeleting] = useState<CategoriaGetDto | null>(null);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  // Compute active parameter for API
  const activeParam =
    statusFilter === "ativos"
      ? true
      : statusFilter === "inativos"
        ? false
        : undefined;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["categorias-admin", page, busca, statusFilter],
    queryFn: () =>
      categoriasApi.listAdmin(page, PAGE_SIZE, busca || undefined, activeParam),
  });

  const createMutation = useMutation({
    mutationFn: (v: CategoriaFormValues & { imagem?: File }) =>
      categoriasApi.create(v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias-admin"] });
      qc.invalidateQueries({ queryKey: ["categorias-all"] });
      setIsFormOpen(false);
      setFormError(undefined);
      toast.success("Categoria criada com sucesso!");
    },
    onError: (err) => {
      if (isApiError(err)) setFormError(err.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      v,
    }: {
      id: number;
      v: CategoriaFormValues & { imagem?: File };
    }) => categoriasApi.update(id, v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias-admin"] });
      qc.invalidateQueries({ queryKey: ["categorias-all"] });
      setIsFormOpen(false);
      setFormError(undefined);
      setEditing(null);
      toast.success("Categoria atualizada com sucesso!");
    },
    onError: (err) => {
      if (isApiError(err)) setFormError(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoriasApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias-admin"] });
      qc.invalidateQueries({ queryKey: ["categorias-all"] });
      setDeleting(null);
      toast.success("Categoria excluída com sucesso.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao excluir categoria.");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: categoriasApi.toggleActive,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["categorias-admin"] });
      qc.invalidateQueries({ queryKey: ["categorias-all"] });
      setDeactivating(null);
      setRestoring(null);
      toast.success(res?.message || "Status alterado com sucesso!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao alterar status da categoria.");
    },
  });

  const handleSearchSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setBusca(buscaInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setBuscaInput("");
    setBusca("");
    setPage(1);
  };

  const openNew = () => {
    setEditing(null);
    setFormError(undefined);
    setIsFormOpen(true);
  };

  const openEdit = (c: CategoriaGetDto) => {
    setEditing(c);
    setFormError(undefined);
    setIsFormOpen(true);
  };

  const openView = (c: CategoriaGetDto) => {
    setViewing(c);
  };

  const openDeactivate = (c: CategoriaGetDto) => {
    setDeactivating(c);
  };

  const openRestore = (c: CategoriaGetDto) => {
    setRestoring(c);
  };

  const openDelete = (c: CategoriaGetDto) => {
    setDeleting(c);
  };

  const handleFormSubmit = async (
    values: CategoriaFormValues & { imagem?: File },
  ) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, v: values });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditing(null);
    setFormError(undefined);
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
      {/* Header */}
      <div id="tour-admin-header" className="relative">
        <PageHeaderCard
          title="Categorias de Painéis"
          description="Gerencie as categorias de agrupamento dos painéis. As categorias organizam os dashboards e facilitam a descoberta e navegação dos usuários na área pública."
        />
      </div>

      {/* Filter and Search Bar */}
      <div id="tour-categorias-filterbar">
        <CategoriaFilterBar
          searchTerm={buscaInput}
          setSearchTerm={setBuscaInput}
          onSearchSubmit={handleSearchSubmit}
          onClearSearch={handleClearSearch}
          statusFilter={statusFilter}
          setStatusFilter={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
          onNewClick={openNew}
        />
      </div>

      {/* Linear progress for background updates */}
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
      <div
        id="tour-categorias-lista"
        className="flex flex-col gap-5 min-h-[520px] relative"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-fundo-pagina/50 z-10">
            <CircularProgress color="primary" />
          </div>
        )}

        {!isLoading && totalItens === 0 && (
          <div className="flex flex-col items-center justify-start py-26 text-center bg-fundo-superficie rounded shadow-sm min-h-[612px]">
            <LayoutList className="h-12 w-12 text-texto-secundario/40 mb-3" />
            <p className="font-semibold text-texto-principal">
              Nenhuma categoria encontrada
            </p>
            <p className="text-sm text-texto-secundario mt-1">
              Experimente alterar os filtros ou cadastrar uma nova categoria.
            </p>
          </div>
        )}

        {!isLoading && totalItens > 0 && data?.itens && (
          <div className="flex flex-col gap-3.5">
            {data.itens.map((c) => (
              <CategoriaAdminCard
                key={c.id}
                categoria={c}
                onView={openView}
                onEdit={openEdit}
                onDeactivate={openDeactivate}
                onRestore={openRestore}
                onDelete={openDelete}
                onViewImage={setViewingImage}
                isToggling={toggleMutation.isPending}
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
      <CategoriaFormModal
        open={isFormOpen}
        editing={editing}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        rootError={formError}
        onClose={handleCloseForm}
      />

      {/* Detail Modal */}
      <CategoriaDetailModal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        categoria={viewing}
        formatData={formatData}
      />

      {/* Deactivate Modal */}
      <MuiConfirmDialog
        open={deactivating !== null}
        onClose={() => setDeactivating(null)}
        title="Desativar Categoria"
        description={`Tem certeza que deseja desativar a categoria "${deactivating?.nome}"? Os painéis vinculados continuarão existindo mas a categoria ficará oculta na área pública.`}
        confirmText="Desativar"
        confirmTone="warning"
        isLoading={toggleMutation.isPending}
        onConfirm={() => deactivating && toggleMutation.mutate(deactivating.id)}
      />

      {/* Restore Modal */}
      <MuiConfirmDialog
        open={restoring !== null}
        onClose={() => setRestoring(null)}
        title="Reativar Categoria"
        description={`Tem certeza que deseja reativar a categoria "${restoring?.nome}"? Ela voltará a ficar visível na área pública.`}
        confirmText="Reativar"
        confirmTone="success"
        isLoading={toggleMutation.isPending}
        onConfirm={() => restoring && toggleMutation.mutate(restoring.id)}
      />

      {/* Delete Confirmation */}
      <MuiConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Excluir Categoria"
        description={`Tem certeza que deseja excluir permanentemente a categoria "${deleting?.nome}"? Essa ação é irreversível e removerá todos os dados correspondentes. Não é possível remover se houver painéis vinculados.`}
        confirmText="Excluir"
        confirmTone="danger"
        requireTextInput
        textInputExpectedValue={deleting?.nome || ""}
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />

      <ImagePreviewModal
        open={viewingImage !== null}
        onClose={() => setViewingImage(null)}
        imageUrl={viewingImage?.imagemUrl || null}
        imageAlt={viewingImage?.nome}
      />
    </div>
  );
};

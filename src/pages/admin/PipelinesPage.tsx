import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import { Code, ChevronLeft, ChevronRight } from "lucide-react";

import { pipelineApi } from "@/services/pipelineApi";
import { pipelineSchema, type PipelineFormValues } from "@/schemas/forms";
import { isApiError } from "@/types/api";
import { PageHeaderCard } from "@/components/ui/PageHeaderCard";
import { startTour } from "@/features/tour/useTour";
import { adminPipelinesSteps } from "@/features/tour/tourSteps";
import { MuiConfirmDialog } from "@/components/ui/MuiConfirmDialog";
import type { PipelineGetDto } from "@/types/dtos";
import { toast } from "sonner";

import { PipelineFilterBar } from "@/components/pipelines/PipelineFilterBar";
import { PipelineCard } from "@/components/pipelines/PipelineCard";
import { PipelineDetailModal } from "@/components/pipelines/PipelineDetailModal";
import { PipelineFormModal } from "@/components/pipelines/PipelineFormModal";

// Page size limited to 5 cards per page
const PAGE_SIZE = 5;

export const PipelinesPage = (): React.JSX.Element => {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(
      () => startTour("admin-pipelines", adminPipelinesSteps),
      600,
    );
    return () => clearTimeout(t);
  }, []);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ativos" | "desativados" | "todos"
  >("ativos");
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Dialog states
  const [viewingPipeline, setViewingPipeline] = useState<PipelineGetDto | null>(
    null,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<PipelineGetDto | null>(
    null,
  );

  // Confirmation dialog states
  const [deactivatingPipeline, setDeactivatingPipeline] =
    useState<PipelineGetDto | null>(null);
  const [restoringPipeline, setRestoringPipeline] =
    useState<PipelineGetDto | null>(null);
  const [deletingPipeline, setDeletingPipeline] =
    useState<PipelineGetDto | null>(null);

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

  // Map filters
  const getAtivoParam = () => {
    if (statusFilter === "ativos") return true;
    if (statusFilter === "desativados") return false;
    return null;
  };

  // Queries
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["pipelines", page, searchQuery, statusFilter],
    queryFn: () =>
      pipelineApi.list(page, PAGE_SIZE, searchQuery, getAtivoParam()),
    placeholderData: (prev) => prev,
  });

  // Forms
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PipelineFormValues>({
    resolver: zodResolver(pipelineSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      scriptPython: "",
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: pipelineApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pipelines"] });
      setIsFormOpen(false);
      reset();
      toast.success("Pipeline de dados criada com sucesso!");
    },
    onError: (err) => {
      if (isApiError(err)) setError("root", { message: err.message });
      else toast.error("Ocorreu um erro ao criar a pipeline.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: PipelineFormValues;
    }) => pipelineApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pipelines"] });
      setIsFormOpen(false);
      reset();
      setEditingPipeline(null);
      toast.success("Pipeline de dados atualizada com sucesso!");
    },
    onError: (err) => {
      if (isApiError(err)) setError("root", { message: err.message });
      else toast.error("Ocorreu um erro ao atualizar a pipeline.");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => pipelineApi.toggleActive(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["pipelines"] });
      setDeactivatingPipeline(null);
      setRestoringPipeline(null);
      toast.success(
        res?.message || "Status da pipeline atualizado com sucesso!",
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao atualizar status da pipeline.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => pipelineApi.remove(id, true), // hard delete
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pipelines"] });
      setDeletingPipeline(null);
      toast.success("Pipeline de dados excluída permanentemente!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao excluir pipeline.");
    },
  });

  // Handlers
  const handleSearchSubmit = (e?: React.SyntheticEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setSearchQuery(searchTerm);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
    setStatusFilter("ativos");
    setPage(1);
  };

  const handleViewPipeline = async (p: PipelineGetDto) => {
    setLoadingDetail(true);
    try {
      const fullDetail = await pipelineApi.detail(p.id);
      setViewingPipeline(fullDetail);
    } catch {
      toast.error("Erro ao carregar detalhes da pipeline.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleEditPipeline = async (p: PipelineGetDto) => {
    setLoadingDetail(true);
    try {
      const fullDetail = await pipelineApi.detail(p.id);
      setEditingPipeline(fullDetail);
      reset({
        nome: fullDetail.nome,
        descricao: fullDetail.descricao ?? "",
        scriptPython: fullDetail.scriptPython,
      });
      setIsFormOpen(true);
    } catch {
      toast.error("Erro ao carregar detalhes para edição.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const openNew = () => {
    setEditingPipeline(null);
    reset({
      nome: "",
      descricao: "",
      scriptPython: `def process_data(df):\n    # Adicione seu script de transformação aqui\n    # df é o DataFrame contendo os dados brutos (Bronze)\n    # Retorne o DataFrame processado\n    return df\n`,
    });
    setIsFormOpen(true);
  };

  const onSubmit = (values: PipelineFormValues) => {
    if (editingPipeline) {
      updateMutation.mutate({ id: editingPipeline.id, payload: values });
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
      {/* Reusable Header Card */}
      <div id="tour-admin-header" className="relative">
        <PageHeaderCard
          title="Pipelines de Dados"
          description="As pipelines de dados são scripts em Python que realizam o fluxo de transformação e carregamento. Elas recebem arquivos brutos nos formatos .csv, .xlsx, etc. estruturando-os nas camadas Bronze, Silver e Gold do DB."
        />
      </div>

      {/* Single Line Filter & Search Bar on Desktop */}
      <div id="tour-pipelines-filterbar">
        <PipelineFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          inputRef={inputRef}
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

      {/* Divider or loading progress line */}
      <div className="h-[3px] w-full bg-borda-padrao/60 relative -mt-2 -mb-2">
        {loadingDetail && (
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

      {/* Pipelines List */}
      <div
        id="tour-pipelines-lista"
        className="flex flex-col gap-5 min-h-[520px] relative"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-fundo-pagina/50 z-10">
            <CircularProgress color="primary" />
          </div>
        )}

        {!isLoading && totalItens === 0 && (
          <div className="flex flex-col items-center justify-start py-26 text-center bg-fundo-superficie rounded shadow-sm min-h-[612px]">
            <Code className="h-12 w-12 text-texto-secundario/40 mb-3" />
            <p className="font-semibold text-texto-principal">
              Nenhuma pipeline encontrada
            </p>
            <p className="text-sm text-texto-secundario mt-1">
              Experimente alterar os filtros ou cadastrar uma nova pipeline.
            </p>
          </div>
        )}

        {!isLoading &&
          data?.itens.map((p) => (
            <PipelineCard
              key={p.id}
              pipeline={p}
              onView={handleViewPipeline}
              onEdit={handleEditPipeline}
              onDeactivate={setDeactivatingPipeline}
              onRestore={setRestoringPipeline}
              onDelete={setDeletingPipeline}
              formatData={formatData}
            />
          ))}
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
              disabled={page === 1 || isPlaceholderData}
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
              disabled={page >= totalPages || isPlaceholderData}
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

      {/* VIEW MODAL (TELA CHEIA / LARGE VIEW) */}
      <PipelineDetailModal
        open={viewingPipeline !== null}
        onClose={() => setViewingPipeline(null)}
        pipeline={viewingPipeline}
        formatData={formatData}
      />

      {/* CREATE & EDIT FORM MODAL */}
      <PipelineFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingPipeline={editingPipeline}
        register={register}
        control={control}
        setValue={setValue}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
      />

      {/* CONFIRM DEACTIVATE (SOFT DELETE) DIALOG */}
      <MuiConfirmDialog
        open={deactivatingPipeline !== null}
        onClose={() => setDeactivatingPipeline(null)}
        title="Desativar Pipeline"
        description="Esta ação desativará a pipeline no sistema. Novos agendamentos serão suspensos, mas os dados históricos serão preservados."
        confirmText="Desativar"
        confirmTone="warning"
        isLoading={toggleMutation.isPending}
        onConfirm={() =>
          deactivatingPipeline && toggleMutation.mutate(deactivatingPipeline.id)
        }
      />

      {/* CONFIRM RESTORE DIALOG */}
      <MuiConfirmDialog
        open={restoringPipeline !== null}
        onClose={() => setRestoringPipeline(null)}
        title="Reativar Pipeline"
        description="Esta ação reativará a pipeline no sistema, tornando-a novamente disponível para execução e agendamentos."
        confirmText="Reativar"
        confirmTone="success"
        isLoading={toggleMutation.isPending}
        onConfirm={() =>
          restoringPipeline && toggleMutation.mutate(restoringPipeline.id)
        }
      />

      {/* CONFIRM HARD DELETE DIALOG (WITH NAME INPUT REQUIREMENT) */}
      <MuiConfirmDialog
        open={deletingPipeline !== null}
        onClose={() => setDeletingPipeline(null)}
        title="Excluir Pipeline"
        description="Esta ação é irreversível e excluirá permanentemente a pipeline e todo o seu histórico do banco de dados."
        confirmText="Excluir"
        confirmTone="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() =>
          deletingPipeline && deleteMutation.mutate(deletingPipeline.id)
        }
        requireTextInput={true}
        textInputExpectedValue={deletingPipeline?.nome || ""}
      />
    </div>
  );
};

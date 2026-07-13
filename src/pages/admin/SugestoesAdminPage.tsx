import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { sugestaoApi } from "@/services/sugestaoApi";
import type {
  StatusSugestao,
  TipoSugestao,
  SugestaoListDto,
} from "@/types/dtos";

import { PageHeaderCard } from "@/components/ui/PageHeaderCard";
import { startTour } from "@/features/tour/useTour";
import { adminSugestoesSteps } from "@/features/tour/tourSteps";
import { SugestaoFilterBar } from "@/components/sugestoes/SugestaoFilterBar";
import { SugestaoAdminCard } from "@/components/sugestoes/SugestaoAdminCard";
import { SugestaoDetailModal } from "@/components/sugestoes/SugestaoDetailModal";
import { MuiConfirmDialog } from "@/components/ui/MuiConfirmDialog";

const PAGE_SIZE = 5;

export const SugestoesAdminPage = (): React.JSX.Element => {
  const qc = useQueryClient();

  useEffect(() => {
    const t = setTimeout(
      () => startTour("admin-sugestoes", adminSugestoesSteps),
      600,
    );
    return () => clearTimeout(t);
  }, []);

  // Search and filter states
  const [page, setPage] = useState(1);
  const [buscaInput, setBuscaInput] = useState("");
  const [busca, setBusca] = useState("");
  const [tipoFilter, setTipoFilter] = useState<TipoSugestao | "">("");
  const [statusFilter, setStatusFilter] = useState<StatusSugestao | "">(0); // Default to "Pendentes" (0)

  // Dialog/Modal states
  const [viewing, setViewing] = useState<SugestaoListDto | null>(null);
  const [confirmStatusUpdate, setConfirmStatusUpdate] = useState<{
    sugestao: SugestaoListDto;
    targetStatus: StatusSugestao;
  } | null>(null);

  // Queries
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["sugestoes-admin", page, statusFilter, tipoFilter, busca],
    queryFn: () =>
      sugestaoApi.list({
        status: statusFilter === "" ? undefined : statusFilter,
        tipo: tipoFilter === "" ? undefined : tipoFilter,
        busca: busca || undefined,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["sugestao-detail", viewing?.id],
    queryFn: () => (viewing ? sugestaoApi.getById(viewing.id) : null),
    enabled: !!viewing,
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: StatusSugestao }) =>
      sugestaoApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sugestoes-admin"] });
      qc.invalidateQueries({ queryKey: ["sugestao-detail"] });
      toast.success("Status da solicitação atualizado com sucesso!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao atualizar status.");
    },
  });

  const handleSearchSubmit = (e?: React.SyntheticEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setBusca(buscaInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setBuscaInput("");
    setBusca("");
    setTipoFilter("");
    setStatusFilter(0);
    setPage(1);
  };

  const handleCardUpdateStatus = (
    sugestao: SugestaoListDto,
    targetStatus: StatusSugestao,
  ) => {
    setConfirmStatusUpdate({ sugestao, targetStatus });
  };

  const handleConfirmCardUpdate = async () => {
    if (confirmStatusUpdate) {
      const { sugestao, targetStatus } = confirmStatusUpdate;
      setConfirmStatusUpdate(null);
      await updateStatusMutation.mutateAsync({
        id: sugestao.id,
        status: targetStatus,
      });
    }
  };

  const formatData = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const getConfirmDialogDetails = (status: StatusSugestao) => {
    switch (status) {
      case 0:
      case "Pendente":
        return {
          title: "Mudar para Pendente",
          description:
            "Deseja realmente alterar o status desta solicitação para pendente?",
          confirmText: "Mudar para Pendente",
          confirmTone: "warning" as const,
        };
      case 1:
      case "Analisado":
        return {
          title: "Marcar como Analisada",
          description:
            "Deseja realmente marcar esta solicitação como analisada?",
          confirmText: "Marcar como Analisada",
          confirmTone: "success" as const,
        };
      case 2:
      case "Descartado":
        return {
          title: "Descartar Solicitação",
          description: "Deseja realmente descartar esta solicitação?",
          confirmText: "Descartar",
          confirmTone: "danger" as const,
        };
      default:
        return {
          title: "Alterar Status",
          description: "Deseja realmente alterar o status desta solicitação?",
          confirmText: "Alterar",
          confirmTone: "primary" as const,
        };
    }
  };

  // Pagination calculation variables
  const totalItens = data?.totalItens ?? 0;
  const totalPages = data?.totalPaginas ?? 1;
  const startRange = totalItens === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endRange = Math.min(page * PAGE_SIZE, totalItens);

  return (
    <div className="flex flex-col gap-6">
      <div id="tour-admin-header" className="relative">
        <PageHeaderCard
          title="Sugestões e Relatos"
          description="Gerencie as solicitações, sugestões de melhorias e relatos de erros ou bugs submetidos pelos usuários no portal público."
        />
      </div>

      {/* Filter and Search Bar */}
      <div id="tour-sugestoes-filterbar">
        <SugestaoFilterBar
          searchTerm={buscaInput}
          setSearchTerm={setBuscaInput}
          onSearchSubmit={handleSearchSubmit}
          onClearSearch={handleClearSearch}
          tipoFilter={tipoFilter}
          setTipoFilter={(val) => {
            setTipoFilter(val);
            setPage(1);
          }}
          statusFilter={statusFilter}
          setStatusFilter={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        />
      </div>

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
            <MessageSquare className="h-12 w-12 text-texto-secundario/40 mb-3" />
            <p className="font-semibold text-texto-principal">
              Nenhuma solicitação encontrada
            </p>
            <p className="text-sm text-texto-secundario mt-1">
              Experimente alterar os filtros ou realizar outra busca.
            </p>
          </div>
        )}

        {!isLoading && totalItens > 0 && data?.itens && (
          <div className="flex flex-col gap-3.5">
            {data.itens.map((s) => (
              <SugestaoAdminCard
                key={s.id}
                sugestao={s}
                onView={setViewing}
                onUpdateStatus={handleCardUpdateStatus}
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

      {/* Details Dialog */}
      <SugestaoDetailModal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        sugestao={detailData ?? null}
        isLoading={isLoadingDetail}
      />

      {/* Confirmation Dialog for Card Actions */}
      {confirmStatusUpdate !== null &&
        (() => {
          const details = getConfirmDialogDetails(
            confirmStatusUpdate.targetStatus,
          );
          return (
            <MuiConfirmDialog
              open={true}
              onClose={() => setConfirmStatusUpdate(null)}
              title={details.title}
              description={details.description}
              confirmText={details.confirmText}
              cancelText="Cancelar"
              confirmTone={details.confirmTone}
              onConfirm={handleConfirmCardUpdate}
            />
          );
        })()}
    </div>
  );
};

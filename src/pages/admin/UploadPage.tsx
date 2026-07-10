import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileSpreadsheet, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import { pipelineApi } from "@/services/pipelineApi";
import { MuiConfirmDialog } from "@/components/ui/MuiConfirmDialog";
import { PageHeaderCard } from "@/components/ui/PageHeaderCard";
import type { PipelineExecucaoGetDto } from "@/types/dtos";
import type { PipelineGetDto } from "@/types/dtos";
import { StatusPipelineLabel } from "@/types/dtos";
import { toast } from "sonner";

import { UploadFilterBar } from "@/components/uploads/UploadFilterBar";
import { UploadExecucaoCard } from "@/components/uploads/UploadExecucaoCard";
import { UploadExecucaoDetailModal } from "@/components/uploads/UploadExecucaoDetailModal";
import { UploadNovoProcessamentoModal } from "@/components/uploads/UploadNovoProcessamentoModal";
import { PipelineDetailModal } from "@/components/pipelines/PipelineDetailModal";

const PAGE_SIZE = 5;

export const UploadPage = (): React.JSX.Element => {
  const qc = useQueryClient();

  // History filter states
  const [page, setPage] = useState(1);
  const [pipelineFilter, setPipelineFilter] = useState<number | "">("");
  const [statusFilter, setStatusFilter] = useState<number | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K to focus search
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

  // Modal states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [viewing, setViewing] = useState<PipelineExecucaoGetDto | null>(null);
  const [rollbackTarget, setRollbackTarget] =
    useState<PipelineExecucaoGetDto | null>(null);
  const [viewingPipeline, setViewingPipeline] = useState<PipelineGetDto | null>(
    null,
  );
  const [loadingPipelineDetail, setLoadingPipelineDetail] = useState(false);

  const [log, setLog] = useState<string[]>([]);

  // Queries
  const { data: pipelines } = useQuery({
    queryKey: ["pipelines-all"],
    queryFn: () => pipelineApi.listAll(),
  });

  const {
    data: execucoes,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "execucoes-admin",
      page,
      statusFilter,
      pipelineFilter,
      searchQuery,
    ],
    queryFn: () =>
      pipelineApi.listExecucoes(
        page,
        PAGE_SIZE,
        statusFilter === "" ? null : Number(statusFilter),
        pipelineFilter === "" ? null : Number(pipelineFilter),
        searchQuery || null,
      ),
  });

  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["execucao-detail", viewing?.id],
    queryFn: () => (viewing ? pipelineApi.getExecucao(viewing.id) : null),
    enabled: !!viewing,
  });

  // Helpers
  const appendLog = (msg: string) =>
    setLog((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString("pt-BR")}] ${msg}`,
    ]);

  const pollStatus = (execId: number) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const exec = await pipelineApi.getExecucao(execId);
        const statusStr = String(exec.status).toLowerCase();
        const label =
          StatusPipelineLabel[
            exec.status as keyof typeof StatusPipelineLabel
          ] ?? exec.status;
        const msgPart = exec.mensagem ? ` - ${exec.mensagem}` : "";
        appendLog(`  • Verificacao ${attempts}: ${label}${msgPart}`);

        const isTerminal = [
          "2",
          "3",
          "4",
          "5",
          "sucesso",
          "erro",
          "cancelado",
          "rollback",
        ].includes(statusStr);
        if (isTerminal) {
          clearInterval(interval);
          qc.invalidateQueries({ queryKey: ["execucoes-admin"] });
          if (statusStr === "2" || statusStr === "sucesso") {
            appendLog(`✓ Execucao #${execId} finalizada com Sucesso!`);
            toast.success("Pipeline finalizada com sucesso!");
          } else {
            appendLog(`✗ Execucao #${execId} encerrada com status: ${label}`);
            toast.error(
              "O processamento da pipeline falhou. Verifique os logs.",
            );
          }
        }
      } catch {
        clearInterval(interval);
        appendLog(`✗ Erro ao consultar status da Execucao #${execId}.`);
      }
      if (attempts >= 20) {
        clearInterval(interval);
        appendLog(
          `⚠ Timeout de monitoramento da Execucao #${execId} (60s). Verifique o historico.`,
        );
      }
    }, 3000);
  };

  // Mutations
  const executarMutation = useMutation({
    mutationFn: pipelineApi.executar,
    onSuccess: (exec) => {
      appendLog(
        `✓ Upload recebido: ${exec.totalLinhas} linhas · ${exec.colunas.length} colunas`,
      );
      appendLog(
        `▶ Execução #${exec.id} iniciada - Pipeline: "${exec.pipelineNome}" | Silver: ${exec.tabelaSilver} | Gold: ${exec.tabelaGold}`,
      );
      qc.invalidateQueries({ queryKey: ["execucoes-admin"] });
      pollStatus(exec.id);
      toast.success("Processamento da pipeline iniciado!");
    },
    onError: (err: Error) => {
      appendLog(`✗ Erro: ${err.message}`);
      toast.error(err.message || "Erro ao iniciar processamento.");
    },
  });

  const rollbackMutation = useMutation({
    mutationFn: pipelineApi.rollback,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["execucoes-admin"] });
      setRollbackTarget(null);
      toast.success("Rollback executado com sucesso.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erro ao executar rollback.");
    },
  });

  const handleSearchSubmit = (e?: React.SyntheticEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setSearchQuery(searchTerm);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSearchQuery("");
    setPipelineFilter("");
    setStatusFilter("");
    setPage(1);
  };

  // Full date + time for cards: dd/mm/aaaa HH:mm
  const formatDataHora = (dateStr?: string | null) => {
    if (!dateStr) return "Não iniciado";
    try {
      return new Date(dateStr).toLocaleString("pt-BR", {
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

  // Pagination
  const totalItens = execucoes?.totalItens ?? 0;
  const totalPages = execucoes?.totalPaginas ?? 1;
  const startRange = totalItens === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endRange = Math.min(page * PAGE_SIZE, totalItens);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <PageHeaderCard
        title="Upload de Dados"
        description="Monitore as execuções das pipelines de processamento de dados e envie arquivos em lote para iniciar o fluxo de transformação Bronze, Prata e Ouro."
      />

      {/* Filter Bar (with "Novo Processamento" button) */}
      <UploadFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        inputRef={inputRef}
        onSearchSubmit={handleSearchSubmit}
        pipelineFilter={pipelineFilter}
        setPipelineFilter={(val) => {
          setPipelineFilter(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        pipelines={pipelines || []}
        onClearFilters={handleClearFilters}
        onNewClick={() => setIsNewModalOpen(true)}
      />

      {/* Background refetch indicator */}
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

      {/* Executions List */}
      <div className="flex flex-col gap-5 min-h-[520px] relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-fundo-pagina/50 z-10">
            <CircularProgress color="primary" />
          </div>
        )}

        {!isLoading && totalItens === 0 && (
          <div className="flex flex-col items-center justify-start py-26 text-center bg-fundo-superficie rounded shadow-sm min-h-[612px]">
            <FileSpreadsheet className="h-12 w-12 text-texto-secundario/40 mb-3" />
            <p className="font-semibold text-texto-principal">
              Nenhuma execução registrada
            </p>
            <p className="text-sm text-texto-secundario mt-1">
              Experimente alterar os filtros ou inicie um novo processamento.
            </p>
          </div>
        )}

        {!isLoading && totalItens > 0 && execucoes?.itens && (
          <div className="flex flex-col gap-3">
            {execucoes.itens.map((exec) => (
              <UploadExecucaoCard
                key={exec.id}
                exec={exec}
                onView={setViewing}
                onRollbackClick={setRollbackTarget}
                formatDataHora={formatDataHora}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {execucoes && totalItens > 0 && (
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

      {/* NEW PROCESSING MODAL */}
      <UploadNovoProcessamentoModal
        open={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        pipelines={pipelines || []}
        onExecutar={(params) => executarMutation.mutate(params)}
        isExecuting={executarMutation.isPending}
        log={log}
        onClearLog={() => setLog([])}
      />

      {/* DETAIL VIEW MODAL */}
      <UploadExecucaoDetailModal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        execucao={detailData ?? null}
        isLoading={isLoadingDetail}
        onViewPipeline={async (pipelineId) => {
          setViewing(null);
          setLoadingPipelineDetail(true);
          try {
            const detail = await pipelineApi.detail(pipelineId);
            setViewingPipeline(detail);
          } catch {
            toast.error("Erro ao carregar detalhes da pipeline.");
          } finally {
            setLoadingPipelineDetail(false);
          }
        }}
      />

      {/* PIPELINE DETAIL MODAL (opened from execucao detail) */}
      <PipelineDetailModal
        open={viewingPipeline !== null || loadingPipelineDetail}
        onClose={() => setViewingPipeline(null)}
        pipeline={viewingPipeline}
        formatData={(dt) =>
          new Date(dt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        }
      />

      {/* ROLLBACK CONFIRM DIALOG */}
      <MuiConfirmDialog
        open={rollbackTarget !== null}
        onClose={() => setRollbackTarget(null)}
        title="Confirmar Rollback"
        description={`Tem certeza que deseja desfazer a execução #${rollbackTarget?.id}? Todos os dados correspondentes a este lote (batch ID: ${rollbackTarget?.batchId}) inseridos nas camadas bronze, prata e ouro serão removidos permanentemente.`}
        confirmText="Executar Rollback"
        cancelText="Cancelar"
        confirmTone="danger"
        onConfirm={async () => {
          if (rollbackTarget) {
            const id = rollbackTarget.id;
            setRollbackTarget(null);
            await rollbackMutation.mutateAsync(id);
          }
        }}
      />
    </div>
  );
};

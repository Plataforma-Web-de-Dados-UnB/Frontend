import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, Eye, RotateCcw, Upload } from "lucide-react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { pipelineApi } from "@/services/pipelineApi";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { openDialog, closeDialog } from "@/utils/dialog";
import type { PipelineExecucaoGetDto, UploadPreviewDto } from "@/types/dtos";
import { StatusPipelineLabel } from "@/types/dtos";
import { toast } from "sonner";

const MODAL_ROLLBACK = "upload-rollback-modal";
const PAGE_SIZE = 10;

export const UploadPage = () => {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const [selectedPipelineId, setSelectedPipelineId] = useState<number | "">("");
  const [preview, setPreview] = useState<UploadPreviewDto | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [rollbackTarget, setRollbackTarget] =
    useState<PipelineExecucaoGetDto | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { data: pipelines } = useQuery({
    queryKey: ["pipelines-all"],
    queryFn: () => pipelineApi.listAll(),
  });

  const { data: execucoes, isLoading: loadingExec } = useQuery({
    queryKey: ["execucoes", page],
    queryFn: () => pipelineApi.listExecucoes(page, PAGE_SIZE),
  });

  const uploadMutation = useMutation({
    mutationFn: pipelineApi.uploadCsv,
    onSuccess: (data) => {
      setPreview(data);
      appendLog(
        `✓ Upload realizado. ${data.totalLinhas} linhas detectadas. Batch: ${data.batchId}`,
      );
    },
    onError: (err) => appendLog(`✗ Erro: ${err.message}`),
  });

  const executarMutation = useMutation({
    mutationFn: pipelineApi.executar,
    onSuccess: (exec) => {
      appendLog(
        `▶ Pipeline iniciada. Execução #${exec.id} — status: ${StatusPipelineLabel[exec.status]}`,
      );
      qc.invalidateQueries({ queryKey: ["execucoes"] });
      pollStatus(exec.id);
    },
    onError: (err) => appendLog(`✗ Erro ao executar: ${err.message}`),
  });

  const rollbackMutation = useMutation({
    mutationFn: pipelineApi.rollback,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["execucoes"] });
      closeDialog(MODAL_ROLLBACK);
      setRollbackTarget(null);
      toast.success("Rollback realizado com sucesso.");
    },
    onError: (err) => toast.error(err.message),
  });

  const appendLog = (msg: string) =>
    setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const pollStatus = (execId: number) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const exec = await pipelineApi.getExecucao(execId);
        appendLog(
          `  Status: ${StatusPipelineLabel[exec.status]}${exec.mensagem ? ` — ${exec.mensagem}` : ""}`,
        );
        if (
          exec.status === 2 ||
          exec.status === 3 ||
          exec.status === 4 ||
          exec.status === 5
        ) {
          clearInterval(interval);
          qc.invalidateQueries({ queryKey: ["execucoes"] });
          if (exec.status === 2)
            toast.success("Pipeline concluída com sucesso!");
          if (exec.status === 3)
            toast.error("Pipeline falhou. Verifique o log.");
        }
      } catch {
        clearInterval(interval);
      }
      if (attempts >= 20) clearInterval(interval);
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    appendLog(`📁 Arquivo selecionado: ${file.name}`);
    uploadMutation.mutate(file);
  };

  const handleIniciar = () => {
    if (!preview || !selectedPipelineId) {
      toast.error("Selecione uma pipeline e faça o upload do CSV.");
      return;
    }
    executarMutation.mutate({
      pipelineId: Number(selectedPipelineId),
      batchId: preview.batchId,
      tabelaSilver: "dados",
      tabelaGold: "dados_gold",
    });
  };

  const statusBadge = (status: number) => {
    const map: Record<number, string> = {
      0: "bg-cinza-claro text-cinza-escuro",
      1: "bg-azul-claro text-azul-escuro",
      2: "bg-verde-claro text-verde-escuro",
      3: "bg-vermelho-claro text-vermelho-escuro",
      4: "bg-amarelo-claro text-amarelo-escuro",
      5: "bg-amarelo-claro text-amarelo-escuro",
    };
    return map[status] ?? "bg-cinza-claro text-cinza-escuro";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-texto-principal">
          Upload de Dados (.csv)
        </h1>
      </div>

      {/* Upload card */}
      <div className="rounded border border-borda-padrao bg-fundo-superficie p-6 shadow-sm space-y-4">
        <p className="text-sm text-texto-secundario">
          Escolha a <em>pipeline</em> que será usada para tratar os dados que
          serão enviados. É possível fazer <em>rollback</em> das alterações,
          caso necessário.
        </p>

        <div className="w-full max-w-xs">
          <FormControl fullWidth size="small">
            <InputLabel id="select-pipeline-label" shrink>
              Pipeline de Dados
            </InputLabel>
            <Select
              labelId="select-pipeline-label"
              value={selectedPipelineId}
              displayEmpty
              notched
              label="Pipeline de Dados"
              onChange={(e) =>
                setSelectedPipelineId(e.target.value ? Number(e.target.value) : "")
              }
              sx={{ backgroundColor: "#ffffff" }}
            >
              <MenuItem value="">
                <em>Selecione a pipeline de dados</em>
              </MenuItem>
              {pipelines?.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-1 items-center gap-2 rounded border border-borda-padrao bg-fundo-superficie-suave px-4 py-2.5 text-sm text-texto-secundario">
            <span className="flex-1 truncate">
              {fileName ?? "Arquivo selecionado..."}
            </span>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => fileRef.current?.click()}
            disabled={uploadMutation.isPending}
            startIcon={
              uploadMutation.isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Upload className="h-4 w-4" />
              )
            }
          >
            Fazer Upload
          </Button>
          {preview && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleIniciar}
              disabled={executarMutation.isPending}
              startIcon={
                executarMutation.isPending ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Play className="h-4 w-4" />
                )
              }
            >
              Iniciar Pipeline
            </Button>
          )}
        </div>

        {/* Terminal */}
        <div className="rounded border border-borda-padrao bg-azul-unb p-4 font-mono text-xs text-verde-escuro min-h-[120px] max-h-48 overflow-y-auto">
          {log.length === 0 ? (
            <span className="text-texto-invertido/40">
              Terminal Informativo
            </span>
          ) : (
            log.map((l, i) => <p key={i}>{l}</p>)
          )}
        </div>
      </div>

      {/* Histórico */}
      <div className="rounded border border-borda-padrao bg-fundo-superficie shadow-sm">
        <div className="border-b border-borda-padrao px-5 py-4">
          <h2 className="font-bold text-texto-principal">Uploads</h2>
        </div>

        {loadingExec && (
          <div className="flex justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-destaque border-t-transparent" />
          </div>
        )}

        {!loadingExec && execucoes?.itens.length === 0 && (
          <p className="py-8 text-center text-sm text-texto-secundario">
            Nenhum upload realizado.
          </p>
        )}

        {!loadingExec &&
          execucoes?.itens.map((exec) => (
            <div
              key={exec.id}
              className="flex items-center gap-4 border-b border-borda-padrao px-5 py-4 last:border-none"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-texto-principal truncate">
                  {exec.pipelineNome}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-texto-secundario">
                  <span>
                    📅 {new Date(exec.createdAt).toLocaleString("pt-BR")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-semibold ${statusBadge(exec.status)}`}
                  >
                    {StatusPipelineLabel[exec.status]}
                  </span>
                </div>
              </div>
              <IconButton
                size="small"
                title="Ver detalhes"
                sx={{ borderRadius: "50%", p: 1.5 }}
              >
                <Eye className="h-4 w-4" />
              </IconButton>
              {exec.status === 2 && (
                <IconButton
                  size="small"
                  title="Rollback"
                  color="warning"
                  sx={{ borderRadius: "50%", p: 1.5 }}
                  onClick={() => {
                    setRollbackTarget(exec);
                    openDialog(MODAL_ROLLBACK);
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </IconButton>
              )}
            </div>
          ))}
      </div>

      {execucoes && (
        <Pagination
          page={page}
          totalPages={execucoes.totalPaginas}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        id={MODAL_ROLLBACK}
        title="Confirmar Rollback"
        description={`Tem certeza que deseja desfazer a execução #${rollbackTarget?.id}? Os dados inseridos serão removidos.`}
        confirmText="Fazer Rollback"
        confirmTone="danger"
        isLoading={rollbackMutation.isPending}
        onConfirm={() =>
          rollbackTarget && rollbackMutation.mutate(rollbackTarget.id)
        }
      />
    </div>
  );
};

import React, { useRef, useState } from "react";
import { MuiConfirmDialog } from "@/components/ui/MuiConfirmDialog";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  X,
  Upload,
  Play,
  Terminal,
  FileSpreadsheet,
  Plus,
  Trash2,
} from "lucide-react";
import type { PipelineGetDto, ColunaSensivelDto } from "@/types/dtos";

const inputSx = {
  borderRadius: "4px",
  bgcolor: "var(--color-fundo-superficie)",
  color: "var(--color-texto-principal)",
  "& fieldset": { borderColor: "var(--color-borda-padrao)" },
  "&:hover fieldset": { borderColor: "var(--color-borda-padrao) !important" },
  "&.Mui-focused fieldset": { borderColor: "var(--color-destaque) !important" },
};

const inputLabelSx = {
  color: "var(--color-texto-secundario)",
  "&.Mui-focused": { color: "var(--color-destaque) !important" },
};

const makeMenuProps = (width: number | string) =>
  ({
    slotProps: {
      paper: {
        sx: {
          maxHeight: 260,
          width:
            typeof width === "number"
              ? `${width}px !important`
              : `${width} !important`,
          maxWidth:
            typeof width === "number"
              ? `${width}px !important`
              : `${width} !important`,
          backgroundColor: "var(--color-fundo-superficie)",
          color: "var(--color-texto-principal)",
          border: "1px solid var(--color-borda-padrao)",
          "& .MuiMenuItem-root": {
            fontSize: "0.875rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
            "&:hover": {
              backgroundColor: "var(--color-fundo-superficie-suave)",
            },
            "&.Mui-selected": {
              backgroundColor: "var(--color-destaque-suave)",
              color: "var(--color-destaque)",
              "&:hover": { backgroundColor: "var(--color-destaque-suave)" },
            },
          },
        },
      },
    },
  }) as const;

const selectSx = {
  height: "40px",
  borderRadius: "4px",
  bgcolor: "var(--color-fundo-superficie)",
  color: "var(--color-texto-principal)",
  "& .MuiSelect-select": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-borda-padrao) !important",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-borda-padrao) !important",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-destaque) !important",
  },
};

const DbIcon = ({ color, bg }: { color: string; bg: string }) => (
  <span
    className="flex h-6 w-6 items-center justify-center rounded shrink-0"
    style={{ backgroundColor: bg, color }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  </span>
);

export interface UploadNovoProcessamentoModalProps {
  open: boolean;
  onClose: () => void;
  pipelines: PipelineGetDto[];
  onExecutar: (params: {
    arquivo: File;
    pipelineId: number;
    tabelaSilver: string;
    tabelaGold: string;
    colunasSensiveisJson?: string;
  }) => void;
  isExecuting: boolean;
  log: string[];
  onClearLog: () => void;
}

export const UploadNovoProcessamentoModal = ({
  open,
  onClose,
  pipelines,
  onExecutar,
  isExecuting,
  log,
  onClearLog,
}: UploadNovoProcessamentoModalProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedPipelineId, setSelectedPipelineId] = useState<number | "">("");
  const [tabelaSilver, setTabelaSilver] = useState("");
  const [tabelaGold, setTabelaGold] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [colunasSensiveis, setColunasSensiveis] = useState<ColunaSensivelDto[]>(
    [],
  );
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [errors, setErrors] = useState<{
    pipeline?: string;
    silver?: string;
    gold?: string;
    arquivo?: string;
  }>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    e.target.value = "";
  };

  const isDirty =
    !!selectedFile ||
    !!selectedPipelineId ||
    !!tabelaSilver ||
    !!tabelaGold ||
    colunasSensiveis.length > 0;

  const handleAttemptClose = () => {
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      doClose();
    }
  };

  const doClose = () => {
    setSelectedPipelineId("");
    setTabelaSilver("");
    setTabelaGold("");
    setSelectedFile(null);
    setColunasSensiveis([]);
    setErrors({});
    setShowConfirmClose(false);
    onClose();
  };

  const addColuna = () =>
    setColunasSensiveis((prev) => [
      ...prev,
      { coluna: "", estrategia: "suprimir" },
    ]);

  const removeColuna = (idx: number) =>
    setColunasSensiveis((prev) => prev.filter((_, i) => i !== idx));

  const updateColuna = (
    idx: number,
    field: keyof ColunaSensivelDto,
    value: string,
  ) =>
    setColunasSensiveis((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)),
    );

  const handleIniciar = () => {
    const newErrors: typeof errors = {};
    if (!selectedPipelineId) newErrors.pipeline = "Selecione uma pipeline.";
    if (!tabelaSilver.trim())
      newErrors.silver = "Informe o nome da tabela prata.";
    if (!tabelaGold.trim()) newErrors.gold = "Informe o nome da tabela ouro.";
    if (!selectedFile)
      newErrors.arquivo = "Selecione um arquivo .csv ou .xlsx.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    const validColunas = colunasSensiveis.filter((c) => c.coluna.trim());
    onExecutar({
      arquivo: selectedFile!,
      pipelineId: Number(selectedPipelineId),
      tabelaSilver: tabelaSilver.trim(),
      tabelaGold: tabelaGold.trim(),
      colunasSensiveisJson:
        validColunas.length > 0 ? JSON.stringify(validColunas) : undefined,
    });
    setSelectedPipelineId("");
    setTabelaSilver("");
    setTabelaGold("");
    setSelectedFile(null);
    setColunasSensiveis([]);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        }}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "4px",
              bgcolor: "var(--color-fundo-superficie)",
              color: "var(--color-texto-principal)",
              border: "1px solid var(--color-borda-padrao)",
              backgroundImage: "none",
              maxHeight: "90vh",
              minHeight: "65vh",
            },
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            m: 0,
            px: 4,
            pt: 2.5,
            pb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--color-borda-padrao)",
          }}
        >
          <h2 className="text-xl font-extrabold tracking-tight font-sans text-texto-principal truncate pr-4">
            Novo Processamento de Dados
          </h2>
          <IconButton
            onClick={handleAttemptClose}
            disabled={isExecuting}
            sx={{
              color: "var(--color-erro)",
              bgcolor: "transparent",
              borderRadius: "50%",
              transition: "all 0.2s ease-in-out",
              flexShrink: 0,
              "&:hover": {
                bgcolor: "var(--color-vermelho-claro)",
                color: "var(--color-vermelho-escuro)",
              },
            }}
          >
            <X className="h-5 w-5" />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent
          sx={{
            px: 4,
            pt: 3,
            pb: 2,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Left: Form */}
            <div className="flex flex-col gap-5">
              {/* Pipeline Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-texto-secundario select-none">
                  Pipeline de Tratamento
                </label>
                <Select
                  value={selectedPipelineId}
                  displayEmpty
                  onChange={(e) => {
                    setSelectedPipelineId(
                      e.target.value ? Number(e.target.value) : "",
                    );
                    if (errors.pipeline)
                      setErrors((p) => ({ ...p, pipeline: undefined }));
                  }}
                  MenuProps={makeMenuProps(480)}
                  sx={{ ...selectSx, width: "100%" }}
                  error={!!errors.pipeline}
                >
                  <MenuItem value="">
                    <em>Selecione a pipeline de dados</em>
                  </MenuItem>
                  {pipelines.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nome}
                    </MenuItem>
                  ))}
                </Select>
                {errors.pipeline && (
                  <span className="text-[11px] text-red-500 pl-0.5">
                    {errors.pipeline}
                  </span>
                )}
              </div>

              {/* Silver + Gold */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-texto-secundario select-none flex items-center gap-1.5">
                    <DbIcon bg="#e2e8f0" color="#64748b" />
                    Tabela Prata
                  </label>
                  <TextField
                    size="small"
                    placeholder="ex: matriculas_silver"
                    value={tabelaSilver}
                    onChange={(e) => {
                      setTabelaSilver(e.target.value);
                      if (errors.silver)
                        setErrors((p) => ({ ...p, silver: undefined }));
                    }}
                    error={!!errors.silver}
                    helperText={errors.silver}
                    slotProps={{
                      input: { sx: inputSx },
                      inputLabel: { sx: inputLabelSx },
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-texto-secundario select-none flex items-center gap-1.5">
                    <DbIcon bg="#fef3c7" color="#b45309" />
                    Tabela Ouro
                  </label>
                  <TextField
                    size="small"
                    placeholder="ex: matriculas_gold"
                    value={tabelaGold}
                    onChange={(e) => {
                      setTabelaGold(e.target.value);
                      if (errors.gold)
                        setErrors((p) => ({ ...p, gold: undefined }));
                    }}
                    error={!!errors.gold}
                    helperText={errors.gold}
                    slotProps={{
                      input: { sx: inputSx },
                      inputLabel: { sx: inputLabelSx },
                    }}
                  />
                </div>
              </div>

              {/* File upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-texto-secundario select-none">
                  Arquivo de Dados
                </label>
                <div
                  className={`flex items-center gap-3 border border-dashed rounded p-3 bg-fundo-superficie-suave/30 ${
                    errors.arquivo ? "border-red-500" : "border-borda-padrao"
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-azul-unb-suave border border-borda-padrao/50">
                    <FileSpreadsheet className="h-6 w-6 text-azul-unb" />
                  </div>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <div className="flex-1 min-w-0 flex items-center rounded border border-borda-padrao bg-fundo-superficie px-3 py-2 min-h-[36px] overflow-hidden">
                      <span className="block w-full truncate text-xs text-texto-secundario">
                        {selectedFile?.name ?? "Nenhum arquivo selecionado"}
                      </span>
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv,.xlsx"
                      className="hidden"
                      onChange={(e) => {
                        handleFileChange(e);
                        if (errors.arquivo)
                          setErrors((p) => ({ ...p, arquivo: undefined }));
                      }}
                    />
                    <Button
                      type="button"
                      variant="contained"
                      onClick={() => fileRef.current?.click()}
                      startIcon={<Upload className="h-4 w-4" />}
                      sx={{
                        height: "36px",
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: "var(--color-azul-unb)",
                        color: "#ffffff",
                        "&:hover": { bgcolor: "var(--color-azul-unb-hover)" },
                        px: 2.5,
                        flexShrink: 0,
                      }}
                    >
                      Selecionar
                    </Button>
                  </div>
                </div>
                {errors.arquivo ? (
                  <span className="text-[11px] text-red-500 pl-0.5">
                    {errors.arquivo}
                  </span>
                ) : (
                  <p className="text-[10px] text-texto-secundario font-medium pl-1 select-none">
                    Formatos aceitos: .csv (separador <code>;</code>) e .xlsx
                  </p>
                )}
              </div>

              {/* Colunas Sensíveis */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-texto-secundario select-none">
                    Colunas Sensíveis (Opcional)
                  </label>
                  <Button
                    type="button"
                    size="small"
                    variant="contained"
                    onClick={addColuna}
                    startIcon={<Plus className="h-3.5 w-3.5" />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      boxShadow: "none",
                      bgcolor: "var(--color-azul-unb)",
                      color: "#ffffff",
                      px: 1.5,
                      py: 0.5,
                      "&:hover": {
                        bgcolor: "var(--color-azul-unb-hover)",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Adicionar
                  </Button>
                </div>
                {colunasSensiveis.length === 0 ? (
                  <p className="text-xs text-texto-secundario/60 italic pl-1 select-none">
                    Nenhuma coluna configurada - dados serão salvos sem
                    mascaramento.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
                    {colunasSensiveis.map((col, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <TextField
                          size="small"
                          placeholder="nome_da_coluna"
                          value={col.coluna}
                          onChange={(e) =>
                            updateColuna(idx, "coluna", e.target.value)
                          }
                          sx={{ flex: 1 }}
                          slotProps={{
                            input: { sx: { ...inputSx, height: "36px" } },
                          }}
                        />
                        <Select
                          value={col.estrategia}
                          onChange={(e) =>
                            updateColuna(idx, "estrategia", e.target.value)
                          }
                          MenuProps={makeMenuProps(200)}
                          sx={{
                            ...selectSx,
                            height: "36px",
                            minWidth: 130,
                            maxWidth: 200,
                          }}
                        >
                          <MenuItem value="suprimir">
                            Suprimir (Remover)
                          </MenuItem>
                          <MenuItem value="hmac">HMAC (Pseudonimizar)</MenuItem>
                        </Select>
                        <IconButton
                          size="small"
                          onClick={() => removeColuna(idx)}
                          sx={{
                            color: "var(--color-erro)",
                            "&:hover": {
                              bgcolor: "var(--color-vermelho-claro)",
                            },
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Terminal Console */}
            <div className="rounded bg-slate-900 p-4 flex flex-col min-h-112.5 max-h-130">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2.5 mb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300 select-none">
                    Console de Execução
                  </span>
                </div>
                {log.length > 0 && (
                  <button
                    onClick={onClearLog}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors select-none"
                  >
                    Limpar
                  </button>
                )}
              </div>
              <div className="flex-1 font-mono text-xs text-emerald-400 overflow-y-auto space-y-1.5">
                {log.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-600 italic select-none pt-6">
                    Console ocioso - logs de execução aparecerão aqui.
                  </div>
                ) : (
                  log.map((l, i) => (
                    <p
                      key={i}
                      className="leading-relaxed break-all whitespace-pre-wrap"
                    >
                      {l}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>

        {/* Footer */}
        <DialogActions
          sx={{
            px: 4,
            pb: 4,
            pt: 2,
            borderTop: "1px solid var(--color-borda-padrao)",
          }}
        >
          <Button
            variant="contained"
            onClick={handleIniciar}
            disabled={isExecuting}
            startIcon={
              isExecuting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Play className="h-4 w-4" />
              )
            }
            sx={{
              borderRadius: "4px",
              px: 4,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
              bgcolor: "var(--color-azul-unb)",
              "&:hover": {
                bgcolor: "var(--color-azul-unb-hover)",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                bgcolor: "var(--color-fundo-superficie-suave)",
                color: "var(--color-texto-secundario)",
              },
            }}
          >
            Iniciar Execução
          </Button>
        </DialogActions>
      </Dialog>

      <MuiConfirmDialog
        open={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        title="Descartar Alterações"
        description="Fechar o formulário apagará todos os campos preenchidos. Deseja continuar?"
        confirmText="Descartar"
        cancelText="Cancelar"
        confirmTone="danger"
        onConfirm={doClose}
      />
    </>
  );
};

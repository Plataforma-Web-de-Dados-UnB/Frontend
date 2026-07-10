import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Editor, { type BeforeMount } from "@monaco-editor/react";
import { X, Calendar, Clock, Code } from "lucide-react";
import type { PipelineGetDto } from "@/types/dtos";

export interface PipelineDetailModalProps {
  open: boolean;
  onClose: () => void;
  pipeline: PipelineGetDto | null;
  formatData: (dt: string) => string;
}

export const PipelineDetailModal = ({
  open,
  onClose,
  pipeline,
  formatData,
}: PipelineDetailModalProps) => {
  const handleEditorBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme("unb-dark-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#161b27",
        "editor.lineHighlightBackground": "#1e2535",
        "editorLineNumber.foreground": "#6b7280",
        "editorLineNumber.activeForeground": "#009c3b",
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "4px",
            bgcolor: "var(--color-fundo-superficie)",
            color: "var(--color-texto-principal)",
            border: "1px solid var(--color-borda-padrao)",
            backgroundImage: "none",
            maxWidth: "1440px",
            width: "100%",
            maxHeight: "80vh",
          },
        },
      }}
    >
      {pipeline && (
        <>
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
              {pipeline.nome}
            </h2>
            <IconButton
              onClick={onClose}
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

          <DialogContent
            sx={{
              px: 4,
              pt: 3,
              pb: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3.5,
            }}
          >
            {/* Description & Dates info */}
            <div className="rounded p-5 bg-borda-padrao/40 mt-6">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario">
                  Descrição
                </h4>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold select-none ${
                    pipeline.ativo
                      ? "bg-[#16a34a] text-white"
                      : "bg-[#dc2626] text-white"
                  }`}
                >
                  {pipeline.ativo ? "Ativa" : "Desativada"}
                </span>
              </div>
              <p className="text-sm text-texto-principal leading-relaxed whitespace-pre-wrap">
                {pipeline.descricao || (
                  <span className="italic text-texto-secundario/50">
                    Nenhuma descrição informada para esta pipeline.
                  </span>
                )}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-borda-padrao/55 text-xs text-texto-secundario">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-texto-secundario/80" />
                  <span>
                    <strong>Criada em:</strong> {formatData(pipeline.createdAt)}
                  </span>
                </div>
                {pipeline.updatedAt && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-texto-secundario/80" />
                    <span>
                      <strong>Última atualização:</strong>{" "}
                      {formatData(pipeline.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Code Editor (ReadOnly) */}
            <div className="flex flex-col gap-2 flex-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario flex items-center gap-1.5">
                <Code className="h-4 w-4 text-destaque" />
                Script Python
              </h4>
              <div className="rounded overflow-hidden border border-borda-padrao bg-[#161b27] p-1 shadow-inner">
                <Editor
                  height="420px"
                  defaultLanguage="python"
                  theme="unb-dark-theme"
                  value={pipeline.scriptPython}
                  beforeMount={handleEditorBeforeMount}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13.5,
                    lineHeight: 20,
                    fontFamily: "monospace",
                    scrollbar: { vertical: "auto", horizontal: "auto" },
                    automaticLayout: true,
                    domReadOnly: true,
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

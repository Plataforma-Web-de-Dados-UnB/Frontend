import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Editor from "@monaco-editor/react";
import { Controller, type Control, type UseFormRegister, type FieldErrors, type UseFormSetValue } from "react-hook-form";
import { X, Code } from "lucide-react";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { MuiConfirmDialog } from "@/components/ui/MuiConfirmDialog";
import type { PipelineFormValues } from "@/schemas/forms";
import type { PipelineGetDto } from "@/types/dtos";

export interface PipelineFormModalProps {
  open: boolean;
  onClose: () => void;
  editingPipeline: PipelineGetDto | null;
  register: UseFormRegister<PipelineFormValues>;
  control: Control<PipelineFormValues>;
  setValue: UseFormSetValue<PipelineFormValues>;
  errors: FieldErrors<PipelineFormValues>;
  isSubmitting: boolean;
  onSubmit: (e?: React.SyntheticEvent<HTMLFormElement>) => void;
}

export const PipelineFormModal = ({
  open,
  onClose,
  editingPipeline,
  register,
  control,
  setValue,
  errors,
  isSubmitting,
  onSubmit,
}: PipelineFormModalProps) => {
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const handleEditorBeforeMount = (monaco: any) => {
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
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
        }}
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
            }
          }
        }}
      >
        <DialogTitle sx={{ m: 0, px: 4, pt: 2.5, pb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-borda-padrao)" }}>
          <h2 className="text-xl font-extrabold tracking-tight font-sans text-texto-principal truncate pr-4">
            {editingPipeline ? "Editar Pipeline de Dados" : "Nova Pipeline de Dados"}
          </h2>
          <IconButton
            onClick={() => setShowConfirmClose(true)}
            disabled={isSubmitting}
            sx={{
              color: "var(--color-erro)",
              bgcolor: "transparent",
              borderRadius: "50%",
              transition: "all 0.2s ease-in-out",
              flexShrink: 0,
              "&:hover": {
                bgcolor: "var(--color-vermelho-claro)",
                color: "var(--color-vermelho-escuro)",
              }
            }}
          >
            <X className="h-5 w-5" />
          </IconButton>
        </DialogTitle>

        <form onSubmit={onSubmit}>
          <DialogContent sx={{ px: 4, pt: 3, pb: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <TextField
                label="Nome da Pipeline de Dados"
                placeholder="Ex: Processamento de Alunos UnB"
                fullWidth
                size="small"
                error={!!errors.nome}
                helperText={errors.nome?.message}
                {...register("nome")}
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: "4px",
                      bgcolor: "var(--color-fundo-superficie)",
                      color: "var(--color-texto-principal)",
                      "& fieldset": { borderColor: "var(--color-borda-padrao)" },
                      "&:hover fieldset": { borderColor: "var(--color-borda-padrao) !important" },
                      "&.Mui-focused fieldset": { borderColor: "var(--color-destaque) !important" },
                    }
                  },
                  inputLabel: {
                    sx: {
                      color: "var(--color-texto-secundario)",
                      "&.Mui-focused": { color: "var(--color-destaque) !important" }
                    }
                  }
                }}
              />

              <TextField
                label="Descrição (Opcional)"
                placeholder="Ex: Pipeline que processa arquivos CSV de matrícula de alunos..."
                fullWidth
                size="small"
                error={!!errors.descricao}
                helperText={errors.descricao?.message}
                {...register("descricao")}
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: "4px",
                      bgcolor: "var(--color-fundo-superficie)",
                      color: "var(--color-texto-principal)",
                      "& fieldset": { borderColor: "var(--color-borda-padrao)" },
                      "&:hover fieldset": { borderColor: "var(--color-borda-padrao) !important" },
                      "&.Mui-focused fieldset": { borderColor: "var(--color-destaque) !important" },
                    }
                  },
                  inputLabel: {
                    sx: {
                      color: "var(--color-texto-secundario)",
                      "&.Mui-focused": { color: "var(--color-destaque) !important" }
                    }
                  }
                }}
              />
            </div>

            {/* Monaco Code Editor */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario flex items-center gap-1.5 mt-1">
                <Code className="h-4 w-4 text-destaque" />
                Script Python
              </h4>
              
              <div className="rounded overflow-hidden border border-borda-padrao bg-[#161b27] p-1 shadow-inner">
                <Controller
                  name="scriptPython"
                  control={control}
                  render={({ field }) => (
                    <Editor
                      height="380px"
                      defaultLanguage="python"
                      theme="unb-dark-theme"
                      value={field.value}
                      beforeMount={handleEditorBeforeMount}
                      onChange={(val) => setValue("scriptPython", val || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13.5,
                        lineHeight: 20,
                        fontFamily: "monospace",
                        scrollbar: { vertical: "auto", horizontal: "auto" },
                        automaticLayout: true,
                        tabSize: 4,
                      }}
                    />
                  )}
                />
              </div>
              {errors.scriptPython && (
                <p className="text-xs text-erro font-medium mt-1">
                  {errors.scriptPython.message}
                </p>
              )}
            </div>

            <AlertBanner message={errors.root?.message} />
          </DialogContent>

          <DialogActions sx={{ px: 4, pb: 4, pt: 2, borderTop: "1px solid var(--color-borda-padrao)" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
              sx={{
                borderRadius: "4px",
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "var(--color-azul-unb)",
                "&:hover": { bgcolor: "var(--color-azul-unb-hover)" }
              }}
            >
              {editingPipeline ? "Salvar Alterações" : "Criar Pipeline"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <MuiConfirmDialog
        open={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        title="Descartar Alterações"
        description="Você tem certeza que deseja fechar? Todas as alterações não salvas serão perdidas definitivamente."
        confirmText="Descartar"
        cancelText="Cancelar"
        confirmTone="danger"
        onConfirm={() => {
          setShowConfirmClose(false);
          onClose();
        }}
      />
    </>
  );
};

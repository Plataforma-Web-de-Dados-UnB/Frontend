import React, { useLayoutEffect, useMemo, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { X, Upload } from "lucide-react";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { MuiConfirmDialog } from "@/components/ui/MuiConfirmDialog";
import { categoriaSchema } from "@/schemas/forms";
import type { CategoriaFormValues } from "@/schemas/forms";
import type { CategoriaGetDto } from "@/types/dtos";

export interface CategoriaFormModalProps {
  open: boolean;
  editing: CategoriaGetDto | null;
  onSubmit: (data: CategoriaFormValues & { imagem?: File }) => Promise<void>;
  isSubmitting: boolean;
  rootError?: string;
  onClose: () => void;
}

export const CategoriaFormModal = ({
  open,
  editing,
  onSubmit,
  isSubmitting,
  rootError,
  onClose,
}: CategoriaFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CategoriaFormValues>({ resolver: zodResolver(categoriaSchema) });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(
    () =>
      selectedFile
        ? URL.createObjectURL(selectedFile)
        : (editing?.imagemUrl ?? null),
    [selectedFile, editing?.imagemUrl],
  );

  useLayoutEffect(() => {
    if (open) {
      if (editing) {
        reset({
          nome: editing.nome,
          descricao: editing.descricao ?? "",
          sortOrdem: editing.sortOrdem,
        });
      } else {
        reset({ nome: "", descricao: "", sortOrdem: 0 });
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFile(null);
      setShowConfirmClose(false);
    }
  }, [editing, reset, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleFormSubmit = async (data: CategoriaFormValues) => {
    await onSubmit({
      ...data,
      imagem: selectedFile || undefined,
    });
  };

  const handleAttemptClose = () => {
    if (isDirty || selectedFile !== null) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
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
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "4px",
              bgcolor: "var(--color-fundo-superficie)",
              color: "var(--color-texto-principal)",
              border: "1px solid var(--color-borda-padrao)",
              backgroundImage: "none",
              maxHeight: "85vh",
            },
          },
        }}
      >
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
          <span className="text-xl font-extrabold tracking-tight font-sans text-texto-principal truncate pr-4">
            {editing
              ? "Editar Categoria de Painéis"
              : "Nova Categoria de Painéis"}
          </span>
          <IconButton
            onClick={handleAttemptClose}
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
              },
            }}
          >
            <X className="h-5 w-5" />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <TextField
                label="Nome da Categoria"
                placeholder="Ex: Ensino de Graduação"
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
                      "& fieldset": {
                        borderColor: "var(--color-borda-padrao)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-borda-padrao) !important",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-destaque) !important",
                      },
                    },
                  },
                  inputLabel: {
                    sx: {
                      color: "var(--color-texto-secundario)",
                      "&.Mui-focused": {
                        color: "var(--color-destaque) !important",
                      },
                    },
                  },
                }}
              />

              <TextField
                label="Ordem de Exibição"
                type="number"
                fullWidth
                size="small"
                error={!!errors.sortOrdem}
                helperText={errors.sortOrdem?.message}
                {...register("sortOrdem", { valueAsNumber: true })}
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: "4px",
                      bgcolor: "var(--color-fundo-superficie)",
                      color: "var(--color-texto-principal)",
                      "& fieldset": {
                        borderColor: "var(--color-borda-padrao)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-borda-padrao) !important",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-destaque) !important",
                      },
                    },
                  },
                  inputLabel: {
                    sx: {
                      color: "var(--color-texto-secundario)",
                      "&.Mui-focused": {
                        color: "var(--color-destaque) !important",
                      },
                    },
                  },
                }}
              />
            </div>

            <TextField
              label="Descrição (Opcional)"
              placeholder="Ex: Dados relacionados ao ensino de graduação da UnB."
              fullWidth
              size="small"
              multiline
              rows={3}
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
                    "&:hover fieldset": {
                      borderColor: "var(--color-borda-padrao) !important",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--color-destaque) !important",
                    },
                  },
                },
                inputLabel: {
                  sx: {
                    color: "var(--color-texto-secundario)",
                    "&.Mui-focused": {
                      color: "var(--color-destaque) !important",
                    },
                  },
                },
              }}
            />

            {/* Upload de Imagem/Ícone */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-texto-secundario select-none">
                Imagem / Ícone (Opcional)
              </label>
              <div className="flex items-center gap-4 border border-dashed border-borda-padrao rounded p-3 bg-fundo-superficie-suave/30">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-azul-unb-suave border border-borda-padrao/50 overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Upload className="h-6 w-6 text-azul-unb" />
                  )}
                </div>
                <div className="flex-1 flex gap-3 items-center min-w-0">
                  <div className="flex-1 flex items-center gap-2 rounded border border-borda-padrao bg-fundo-superficie px-4 py-2 text-sm text-texto-secundario min-h-[40px] box-sizing-border-box">
                    <span className="flex-1 truncate text-xs">
                      {selectedFile?.name ??
                        (editing?.imagemUrl
                          ? "Imagem atual conservada"
                          : "Nenhum arquivo selecionado")}
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => fileInputRef.current?.click()}
                    startIcon={<Upload className="h-4 w-4" />}
                    sx={{
                      height: "40px",
                      textTransform: "none",
                      fontWeight: 600,
                      bgcolor: "var(--color-azul-unb)",
                      color: "#ffffff",
                      "&:hover": { bgcolor: "var(--color-azul-unb-hover)" },
                      px: 3,
                    }}
                  >
                    Selecionar
                  </Button>
                </div>
              </div>
              <p className="text-[10px] text-texto-secundario font-medium -mt-1 pl-1">
                Suporta arquivos .svg, .png ou .jpg. Recomendado: SVG ou PNG
                quadrado com fundo transparente.
              </p>
            </div>

            <AlertBanner message={rootError} />
          </DialogContent>

          <DialogActions
            sx={{
              px: 4,
              pb: 4,
              pt: 2,
              borderTop: "1px solid var(--color-borda-padrao)",
            }}
          >
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
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "var(--color-azul-unb)",
                "&:hover": { bgcolor: "var(--color-azul-unb-hover)" },
              }}
            >
              {editing ? "Salvar Alterações" : "Criar Categoria"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <MuiConfirmDialog
        open={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        title="Descartar Alterações"
        description="Você tem certeza que deseja fechar o formulário? Todas as alterações não salvas serão perdidas definitivamente."
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

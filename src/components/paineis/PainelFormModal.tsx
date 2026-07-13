import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import {
  type UseFormRegister,
  type FieldErrors,
  type UseFormSetValue,
  type Control,
  Controller,
} from "react-hook-form";
import { X } from "lucide-react";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { MuiConfirmDialog } from "@/components/ui/MuiConfirmDialog";
import type { PainelFormValues } from "@/schemas/forms";
import type { PainelGetDto, CategoriaGetDto } from "@/types/dtos";

export interface PainelFormModalProps {
  open: boolean;
  onClose: () => void;
  editingPainel: PainelGetDto | null;
  register: UseFormRegister<PainelFormValues>;
  control: Control<PainelFormValues>;
  setValue: UseFormSetValue<PainelFormValues>;
  errors: FieldErrors<PainelFormValues>;
  isSubmitting: boolean;
  categorias: CategoriaGetDto[] | undefined;
  onSubmit: (e?: React.SyntheticEvent<HTMLFormElement>) => void;
  isDirty: boolean;
}

export const PainelFormModal = ({
  open,
  onClose,
  editingPainel,
  register,
  control,
  setValue,
  errors,
  isSubmitting,
  categorias,
  onSubmit,
  isDirty,
}: PainelFormModalProps) => {
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // Auto-fill form values when opening for editing
  useEffect(() => {
    if (open) {
      if (editingPainel) {
        setValue("nome", editingPainel.nome);
        setValue("descricao", editingPainel.descricao ?? "");
        setValue("graphEmbedLink", editingPainel.graphEmbedLink);
        setValue("embedDashboardUuid", editingPainel.embedDashboardUuid ?? "");
        setValue("categoriaId", editingPainel.categoriaId);
        setValue("sortOrdem", editingPainel.sortOrdem);
      } else {
        setValue("nome", "");
        setValue("descricao", "");
        setValue("graphEmbedLink", "");
        setValue("embedDashboardUuid", "");
        setValue("categoriaId", 0);
        setValue("sortOrdem", 0);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowConfirmClose(false);
    }
  }, [editingPainel, open, setValue]);

  const handleAttemptClose = () => {
    if (isDirty) {
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
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
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
            {editingPainel ? "Editar Painel de Dados" : "Novo Painel de Dados"}
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

        <form onSubmit={onSubmit}>
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
            {/* Category Select Input */}
            <FormControl
              fullWidth
              size="small"
              error={!!errors.categoriaId}
              sx={{ mt: 1 }}
            >
              <InputLabel
                id="categoria-select-label"
                sx={{
                  color: "var(--color-texto-secundario)",
                  "&.Mui-focused": {
                    color: "var(--color-destaque) !important",
                  },
                }}
              >
                Categoria
              </InputLabel>
              <Controller
                name="categoriaId"
                control={control}
                render={({ field }) => (
                  <Select
                    labelId="categoria-select-label"
                    label="Categoria"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    sx={{
                      borderRadius: "4px",
                      bgcolor: "var(--color-fundo-superficie)",
                      color: "var(--color-texto-principal)",
                      border: "1px solid var(--color-borda-padrao)",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--color-borda-padrao) !important",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--color-borda-padrao) !important",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--color-destaque) !important",
                      },
                    }}
                    MenuProps={{
                      slotProps: {
                        paper: {
                          sx: {
                            backgroundColor: "var(--color-fundo-superficie)",
                            color: "var(--color-texto-principal)",
                            border: "1px solid var(--color-borda-padrao)",
                            "& .MuiMenuItem-root": {
                              fontSize: "0.875rem",
                              "&:hover": {
                                backgroundColor:
                                  "var(--color-fundo-superficie-suave)",
                              },
                              "&.Mui-selected": {
                                backgroundColor: "var(--color-destaque-suave)",
                                color: "var(--color-destaque)",
                                "&:hover": {
                                  backgroundColor:
                                    "var(--color-destaque-suave)",
                                },
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value={0} disabled>
                      Selecione a categoria...
                    </MenuItem>
                    {categorias?.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.nome}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.categoriaId && (
                <FormHelperText sx={{ margin: "2px 0 0" }}>
                  {errors.categoriaId.message}
                </FormHelperText>
              )}
            </FormControl>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Input */}
              <TextField
                label="Nome do Painel"
                placeholder="Ex: Painel Geral de Alunos"
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

              {/* Sort Order Input */}
              <TextField
                label="Ordem de Exibição"
                placeholder="Ex: 1"
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

            {/* Description Input */}
            <TextField
              label="Descrição (Opcional)"
              placeholder="Ex: Exibe métricas de evasão escolar e dados socioeconômicos dos estudantes da UnB."
              fullWidth
              size="small"
              multiline
              rows={4}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Embed Link Input */}
              <TextField
                label="Link de Incorporação (Apache Superset)"
                placeholder="http://localhost:8088/superset/dashboard/..."
                fullWidth
                size="small"
                error={!!errors.graphEmbedLink}
                helperText={errors.graphEmbedLink?.message}
                {...register("graphEmbedLink")}
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

              {/* Embed UUID Input */}
              <TextField
                label="UUID do Dashboard"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                fullWidth
                size="small"
                error={!!errors.embedDashboardUuid}
                helperText={errors.embedDashboardUuid?.message}
                {...register("embedDashboardUuid")}
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

            <AlertBanner message={errors.root?.message} />
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
              {editingPainel ? "Salvar Alterações" : "Criar Painel"}
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

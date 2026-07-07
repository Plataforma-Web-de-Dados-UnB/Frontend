import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Database } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { pipelineApi } from "@/services/pipelineApi";
import { pipelineSchema, type PipelineFormValues } from "@/schemas/forms";
import { isApiError } from "@/types/api";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormField } from "@/components/ui/FormField";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { openDialog, closeDialog } from "@/utils/dialog";
import type { PipelineGetDto } from "@/types/dtos";
import { toast } from "sonner";

const MODAL_FORM = "pipeline-form-modal";
const MODAL_DELETE = "pipeline-delete-modal";
const PAGE_SIZE = 10;

export const PipelinasPage = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<PipelineGetDto | null>(null);
  const [deleting, setDeleting] = useState<PipelineGetDto | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["pipelines", page],
    queryFn: () => pipelineApi.list(page, PAGE_SIZE),
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PipelineFormValues>({ resolver: zodResolver(pipelineSchema) });

  const createMutation = useMutation({
    mutationFn: pipelineApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pipelines"] });
      closeDialog(MODAL_FORM);
      reset();
      toast.success("Pipeline criada.");
    },
    onError: (err) => {
      if (isApiError(err)) setError("root", { message: err.message });
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
      closeDialog(MODAL_FORM);
      reset();
      setEditing(null);
      toast.success("Pipeline atualizada.");
    },
    onError: (err) => {
      if (isApiError(err)) setError("root", { message: err.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: pipelineApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pipelines"] });
      closeDialog(MODAL_DELETE);
      setDeleting(null);
      toast.success("Pipeline removida.");
    },
  });

  const openNew = () => {
    setEditing(null);
    reset({ nome: "", descricao: "", scriptPython: "" });
    openDialog(MODAL_FORM);
  };
  const openEdit = (p: PipelineGetDto) => {
    setEditing(p);
    reset({
      nome: p.nome,
      descricao: p.descricao ?? "",
      scriptPython: p.scriptPython,
    });
    openDialog(MODAL_FORM);
  };
  const openDelete = (p: PipelineGetDto) => {
    setDeleting(p);
    openDialog(MODAL_DELETE);
  };

  const onSubmit = (values: PipelineFormValues) => {
    if (editing) updateMutation.mutate({ id: editing.id, payload: values });
    else createMutation.mutate(values);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-texto-principal">
            Pipelines de Dados
          </h1>
          <p className="mt-1 text-sm text-texto-secundario">
            As <em>pipelines</em> de dados são <em>scripts</em> em Python que
            servem para extração, transformação e carregamento dos dados a
            partir de um arquivo .csv
          </p>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={openNew}
          sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
        >
          Nova Pipeline
        </Button>
      </div>

      <div className="mt-6 rounded border border-borda-padrao bg-fundo-superficie shadow-sm">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-destaque border-t-transparent" />
          </div>
        )}

        {!isLoading && data?.itens.length === 0 && (
          <p className="py-12 text-center text-sm text-texto-secundario">
            Nenhuma pipeline cadastrada.
          </p>
        )}

        {!isLoading &&
          data?.itens.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 border-b border-borda-padrao px-5 py-4 last:border-none"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-azul-unb-suave">
                <Database className="h-5 w-5 text-azul-unb" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-texto-principal">{p.nome}</p>
                <p className="text-xs text-texto-secundario">
                  &lt;/&gt; Status do Script: {p.ativo ? "Ativo" : "Inativo"}
                </p>
              </div>
              <IconButton
                size="small"
                onClick={() => openEdit(p)}
                title="Editar"
                sx={{ borderRadius: "50%", p: 1.5 }}
              >
                <Pencil className="h-4 w-4" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => openDelete(p)}
                color="error"
                title="Excluir"
                sx={{ borderRadius: "50%", p: 1.5 }}
              >
                <Trash2 className="h-4 w-4" />
              </IconButton>
            </div>
          ))}
      </div>

      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPaginas}
          onPageChange={setPage}
        />
      )}

      {/* Form modal */}
      <dialog
        id={MODAL_FORM}
        className="fixed inset-0 m-auto rounded bg-transparent p-0 backdrop:bg-black/50 w-full max-w-2xl"
      >
        <div className="rounded border border-borda-padrao bg-fundo-superficie p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-texto-principal">
            {editing ? "Editar Pipeline" : "Nova Pipeline de Dados"}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 flex flex-col gap-1"
          >
            <FormField
              label="Nome da Pipeline de Dados"
              placeholder="Nome da Pipeline de Dados"
              fieldError={errors.nome}
              {...register("nome")}
            />
            <FormField
              label="Descrição (Opcional)"
              placeholder="Descrição"
              {...register("descricao")}
            />
            <FormField
              label="Código em Python"
              placeholder="Código Python..."
              fieldError={errors.scriptPython}
              multiline
              rows={10}
              slotProps={{
                htmlInput: {
                  style: { fontFamily: "monospace", fontSize: "0.75rem" },
                },
              }}
              {...register("scriptPython")}
            />
            <AlertBanner message={errors.root?.message} />
            <div className="flex justify-end gap-2 pt-2">
              <form method="dialog">
                <Button type="submit" variant="text" color="inherit">
                  Cancelar
                </Button>
              </form>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                Salvar
              </Button>
            </div>
          </form>
        </div>
      </dialog>

      <ConfirmDialog
        id={MODAL_DELETE}
        title="Excluir Pipeline"
        description={`Tem certeza que deseja excluir "${deleting?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </div>
  );
};

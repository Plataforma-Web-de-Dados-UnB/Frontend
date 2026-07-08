import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, LayoutList, BarChart2 } from "lucide-react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { FormField } from "@/components/ui/FormField";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoriasApi } from "@/services/categoriasApi";
import { categoriaSchema, type CategoriaFormValues } from "@/schemas/forms";
import { isApiError } from "@/types/api";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { openDialog, closeDialog } from "@/utils/dialog";
import type { CategoriaGetDto } from "@/types/dtos";
import { toast } from "sonner";

const MODAL_FORM = "cat-form-modal";
const MODAL_DELETE = "cat-delete-modal";
const PAGE_SIZE = 10;

export const CategoriasAdminPage = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<CategoriaGetDto | null>(null);
  const [deleting, setDeleting] = useState<CategoriaGetDto | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categorias-admin", page],
    queryFn: () => categoriasApi.listAdmin(page, PAGE_SIZE),
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaFormValues>({ resolver: zodResolver(categoriaSchema) });

  const createMutation = useMutation({
    mutationFn: (v: CategoriaFormValues) => categoriasApi.create(v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias-admin"] });
      qc.invalidateQueries({ queryKey: ["categorias-all"] });
      closeDialog(MODAL_FORM);
      reset();
      toast.success("Categoria criada.");
    },
    onError: (err) => {
      if (isApiError(err)) setError("root", { message: err.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, v }: { id: number; v: CategoriaFormValues }) =>
      categoriasApi.update(id, v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias-admin"] });
      qc.invalidateQueries({ queryKey: ["categorias-all"] });
      closeDialog(MODAL_FORM);
      reset();
      setEditing(null);
      toast.success("Categoria atualizada.");
    },
    onError: (err) => {
      if (isApiError(err)) setError("root", { message: err.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoriasApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias-admin"] });
      qc.invalidateQueries({ queryKey: ["categorias-all"] });
      closeDialog(MODAL_DELETE);
      setDeleting(null);
      toast.success("Categoria removida.");
    },
  });

  const openNew = () => {
    setEditing(null);
    reset({ nome: "", descricao: "", sortOrdem: 0 });
    openDialog(MODAL_FORM);
  };
  const openEdit = (c: CategoriaGetDto) => {
    setEditing(c);
    reset({
      nome: c.nome,
      descricao: c.descricao ?? "",
      sortOrdem: c.sortOrdem,
    });
    openDialog(MODAL_FORM);
  };
  const openDelete = (c: CategoriaGetDto) => {
    setDeleting(c);
    openDialog(MODAL_DELETE);
  };
  const onSubmit = (v: CategoriaFormValues) =>
    editing
      ? updateMutation.mutate({ id: editing.id, v })
      : createMutation.mutate(v);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-texto-principal">
            Categorias de Painéis
          </h1>
          <p className="mt-1 text-sm text-texto-secundario">
            As categorias são as agregadoras de painéis apresentadas na área
            pública da plataforma.
          </p>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={openNew}
          sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
        >
          Nova Categoria
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
            Nenhuma categoria cadastrada.
          </p>
        )}
        {!isLoading &&
          data?.itens.map((c) => (
            <div
              key={c.id}
              className="border-b border-borda-padrao px-5 py-4 last:border-none"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-azul-unb-suave">
                  {c.imagemUrl ? (
                    <img
                      src={c.imagemUrl}
                      alt={c.nome}
                      className="h-7 w-7 object-contain"
                    />
                  ) : (
                    <LayoutList className="h-5 w-5 text-azul-unb" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-texto-principal">{c.nome}</p>
                  <p className="text-xs text-texto-secundario flex items-center gap-1">
                    <BarChart2 className="h-3 w-3" />
                    Quantidade de Painéis: {c.quantidadePaineis ?? "—"}
                  </p>
                </div>
                <IconButton
                  size="small"
                  onClick={() => openEdit(c)}
                  title="Editar"
                  sx={{ borderRadius: "50%", p: 1.5 }}
                >
                  <Pencil className="h-4 w-4" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => openDelete(c)}
                  color="error"
                  title="Excluir"
                  sx={{ borderRadius: "50%", p: 1.5 }}
                >
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
              {c.descricao && (
                <p className="mt-1.5 text-sm text-texto-secundario pl-14">
                  {c.descricao}
                </p>
              )}
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

      <dialog
        id={MODAL_FORM}
        className="fixed inset-0 m-auto rounded bg-transparent p-0 backdrop:bg-black/50 w-full max-w-lg"
      >
        <div className="rounded border border-borda-padrao bg-fundo-superficie p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-texto-principal">
            {editing ? "Editar" : "Nova"} Categoria de Painéis
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 flex flex-col gap-1"
          >
            <FormField
              label="Nome da Categoria de Painéis"
              placeholder="Nome da Categoria de Painéis"
              fieldError={errors.nome}
              {...register("nome")}
            />
            <FormField
              label="Descrição da Categoria de Painéis (Opcional)"
              placeholder="Descrição"
              {...register("descricao")}
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
        title="Excluir Categoria"
        description={`Tem certeza que deseja excluir "${deleting?.nome}"?`}
        confirmText="Excluir"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </div>
  );
};

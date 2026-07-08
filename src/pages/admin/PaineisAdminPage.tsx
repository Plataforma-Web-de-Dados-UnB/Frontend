import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, BarChart2, Power } from "lucide-react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { FormField } from "@/components/ui/FormField";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { painelApi } from "@/services/painelApi";
import { categoriasApi } from "@/services/categoriasApi";
import { painelSchema, type PainelFormValues } from "@/schemas/forms";
import { isApiError } from "@/types/api";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { openDialog, closeDialog } from "@/utils/dialog";
import type { PainelGetDto } from "@/types/dtos";
import { toast } from "sonner";

const MODAL_FORM = "painel-form-modal";
const MODAL_DELETE = "painel-delete-modal";
const PAGE_SIZE = 10;

export const PaineisAdminPage = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [filterCat, setFilterCat] = useState<number | "">("");
  const [editing, setEditing] = useState<PainelGetDto | null>(null);
  const [deleting, setDeleting] = useState<PainelGetDto | null>(null);

  const { data: categorias } = useQuery({
    queryKey: ["categorias-all"],
    queryFn: () => categoriasApi.listAll(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["paineis-admin", page, filterCat],
    queryFn: () => painelApi.listAdmin(page, PAGE_SIZE, filterCat || undefined),
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PainelFormValues>({ resolver: zodResolver(painelSchema) });

  const createMutation = useMutation({
    mutationFn: painelApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paineis-admin"] });
      closeDialog(MODAL_FORM);
      reset();
      toast.success("Painel criado.");
    },
    onError: (err) => {
      if (isApiError(err)) setError("root", { message: err.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PainelFormValues }) =>
      painelApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paineis-admin"] });
      closeDialog(MODAL_FORM);
      reset();
      setEditing(null);
      toast.success("Painel atualizado.");
    },
    onError: (err) => {
      if (isApiError(err)) setError("root", { message: err.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: painelApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["paineis-admin"] });
      closeDialog(MODAL_DELETE);
      setDeleting(null);
      toast.success("Painel removido.");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: painelApi.toggleActive,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["paineis-admin"] });
      toast.success(data?.message || "Status do painel alterado com sucesso!");
    },
    onError: (err: any) => toast.error(err.message || "Erro ao alterar status do painel."),
  });

  const openNew = () => {
    setEditing(null);
    reset({
      nome: "",
      descricao: "",
      graphEmbedLink: "",
      embedDashboardUuid: "",
      sortOrdem: 0,
      categoriaId: 0,
    });
    openDialog(MODAL_FORM);
  };
  const openEdit = (p: PainelGetDto) => {
    setEditing(p);
    reset({
      nome: p.nome,
      descricao: p.descricao ?? "",
      graphEmbedLink: p.graphEmbedLink,
      embedDashboardUuid: p.embedDashboardUuid ?? "",
      sortOrdem: p.sortOrdem,
      categoriaId: p.categoriaId,
    });
    openDialog(MODAL_FORM);
  };
  const openDelete = (p: PainelGetDto) => {
    setDeleting(p);
    openDialog(MODAL_DELETE);
  };
  const onSubmit = (v: PainelFormValues) =>
    editing
      ? updateMutation.mutate({ id: editing.id, payload: v })
      : createMutation.mutate(v);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-texto-principal">
            Gestão de Painéis
          </h1>
          <p className="mt-1 text-sm text-texto-secundario">
            Os <em>dashboards</em> inseridos nos painéis vêm do Apache Superset
            — crie-os lá antes de incorporá-los aqui.
          </p>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={openNew}
          sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
        >
          Novo Painel
        </Button>
      </div>

      {/* Filtro por categoria */}
      <div className="mt-4 w-full max-w-md">
        <FormControl fullWidth size="small">
          <InputLabel id="filter-cat-label" shrink>
            Categoria
          </InputLabel>
          <Select
            labelId="filter-cat-label"
            value={filterCat}
            displayEmpty
            notched
            label="Categoria"
            onChange={(e) => {
              setFilterCat(e.target.value ? Number(e.target.value) : "");
              setPage(1);
            }}
            sx={{ backgroundColor: "#ffffff" }}
          >
            <MenuItem value="">
              <em>Selecione a categoria na qual o painel é apresentado</em>
            </MenuItem>
            {categorias?.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="mt-4 rounded border border-borda-padrao bg-fundo-superficie shadow-sm">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-destaque border-t-transparent" />
          </div>
        )}
        {!isLoading && data?.itens.length === 0 && (
          <p className="py-12 text-center text-sm text-texto-secundario">
            Nenhum painel cadastrado.
          </p>
        )}
        {!isLoading &&
          data?.itens.map((p) => (
            <div
              key={p.id}
              className="border-b border-borda-padrao px-5 py-4 last:border-none"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded bg-destaque-suave">
                  <BarChart2 className="h-5 w-5 text-destaque" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-texto-principal">{p.nome}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                        p.active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : "bg-rose-50 text-rose-700 border border-rose-200/60"
                      }`}
                    >
                      {p.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  {p.descricao && (
                    <p className="text-sm text-texto-secundario mt-0.5">
                      {p.descricao}
                    </p>
                  )}
                  <a
                    href={p.graphEmbedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 flex items-center gap-1 text-xs text-destaque hover:underline truncate"
                  >
                    🔗 {p.graphEmbedLink}
                  </a>
                </div>
                <IconButton
                  size="small"
                  onClick={() => window.open(p.graphEmbedLink, "_blank")}
                  title="Ver"
                  sx={{ borderRadius: "50%", p: 1.5 }}
                >
                  <Eye className="h-4 w-4" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => toggleMutation.mutate(p.id)}
                  title={p.active ? "Desativar" : "Reativar"}
                  disabled={toggleMutation.isPending}
                  sx={{
                    borderRadius: "50%",
                    p: 1.5,
                    color: p.active ? "success.main" : "text.secondary",
                    "&:hover": {
                      bgcolor: p.active ? "rgba(46, 125, 50, 0.08)" : "rgba(0, 0, 0, 0.04)"
                    }
                  }}
                >
                  <Power className="h-4 w-4" />
                </IconButton>
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
            {editing ? "Editar" : "Novo"} Painel
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 flex flex-col gap-1"
          >
            <FormField
              label="Categoria"
              select
              fieldError={errors.categoriaId}
              defaultValue={0}
              {...register("categoriaId", { valueAsNumber: true })}
              slotProps={{
                select: {
                  native: false,
                  displayEmpty: true,
                },
                inputLabel: {
                  shrink: true,
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
            </FormField>
            <FormField
              label="Nome do Painel"
              placeholder="Nome do Painel"
              fieldError={errors.nome}
              {...register("nome")}
            />
            <FormField
              label="Descrição (Opcional)"
              placeholder="Descrição do Painel"
              {...register("descricao")}
            />
            <FormField
              label="Link de Incorporação (Embed) — Apache Superset"
              placeholder="https://superset.server.com/embedded/..."
              fieldError={errors.graphEmbedLink}
              {...register("graphEmbedLink")}
            />
            <FormField
              label="UUID do Dashboard para Embed"
              placeholder="1a403f6a-e355-4fb0-827a-1c31c098f318"
              fieldError={errors.embedDashboardUuid}
              {...register("embedDashboardUuid")}
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
        title="Excluir Painel"
        description={`Tem certeza que deseja excluir "${deleting?.nome}"?`}
        confirmText="Excluir"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </div>
  );
};

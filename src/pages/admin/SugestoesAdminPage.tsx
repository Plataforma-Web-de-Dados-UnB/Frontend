import React from "react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  AlertTriangle,
  ClipboardList,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  User,
  ExternalLink,
  ChevronRight,
  X
} from "lucide-react";
import { sugestaoApi } from "@/services/sugestaoApi";
import { Pagination } from "@/components/ui/Pagination";
import type { StatusSugestao, TipoSugestao } from "@/types/dtos";
import { TipoSugestaoLabel, StatusSugestaoLabel } from "@/types/dtos";
import { toast } from "sonner";
import CircularProgress from "@mui/material/CircularProgress";

const PAGE_SIZE = 8;

export const SugestoesAdminPage = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusSugestao | "">("");
  const [tipoFilter, setTipoFilter] = useState<TipoSugestao | "">("");
  const [busca, setBusca] = useState("");
  const [buscaInput, setBuscaInput] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Query paginated suggestions
  const { data, isLoading } = useQuery({
    queryKey: ["sugestoes", page, statusFilter, tipoFilter, busca],
    queryFn: () =>
      sugestaoApi.list({
        status: statusFilter === "" ? undefined : statusFilter,
        tipo: tipoFilter === "" ? undefined : tipoFilter,
        busca: busca || undefined,
        page,
        limit: PAGE_SIZE
      }),
  });

  // Query details of selected suggestion
  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["sugestao-detail", selectedId],
    queryFn: () => (selectedId ? sugestaoApi.getById(selectedId) : null),
    enabled: !!selectedId,
  });

  // Mutation to update suggestion status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: StatusSugestao }) =>
      sugestaoApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["sugestoes"] });
      qc.invalidateQueries({ queryKey: ["sugestao-detail", variables.id] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Erro ao atualizar status.");
    }
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusca(buscaInput);
    setPage(1);
  };

  const handleOpenDetail = (id: number) => {
    setSelectedId(id);
  };

  const handleCloseDetail = () => {
    setSelectedId(null);
  };

  const getTipoIcon = (tipo: TipoSugestao) => {
    switch (tipo) {
      case 0: // Sugestao
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 1: // Erro
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 2: // Relato
        return <ClipboardList className="h-5 w-5 text-purple-500" />;
    }
  };

  const getStatusBadgeClass = (status: StatusSugestao) => {
    switch (status) {
      case 0: // Pendente
        return "bg-amber-50 text-amber-700 border border-amber-200/60";
      case 1: // Analisado
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
      case 2: // Descartado
        return "bg-slate-50 text-slate-600 border border-slate-200/60";
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho premium */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-azul-unb/90 to-azul-unb p-6 text-white shadow-md">
        <div className="relative z-10">
          <h1 className="text-2xl font-black tracking-tight font-sans">Sugestões e Relatos</h1>
          <p className="mt-1.5 text-sm text-white/80 max-w-2xl font-medium">
            Gerencie as solicitações, sugestões de melhorias e relatos de bugs submetidos pelos usuários do portal de dados.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col gap-4 rounded-xl border border-borda-padrao bg-fundo-superficie p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar por título ou contato..."
            value={buscaInput}
            onChange={(e) => setBuscaInput(e.target.value)}
            className="w-full rounded border border-borda-padrao bg-fundo-superficie-suave py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-destaque focus:ring-1 focus:ring-destaque/20 text-texto-principal"
          />
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-texto-secundario pointer-events-none" />
          {buscaInput !== busca && (
            <button
              type="submit"
              className="absolute right-2 top-1.5 rounded bg-destaque px-3 py-1 text-xs font-bold text-white hover:bg-destaque-hover"
            >
              Buscar
            </button>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tipo Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-borda-padrao px-3 py-1.5 bg-fundo-superficie-suave">
            <Filter className="h-3.5 w-3.5 text-texto-secundario" />
            <select
              value={tipoFilter}
              onChange={(e) => {
                setTipoFilter(e.target.value === "" ? "" : Number(e.target.value) as TipoSugestao);
                setPage(1);
              }}
              className="bg-transparent text-xs font-bold text-texto-principal outline-none cursor-pointer"
            >
              <option value="">Todos os Tipos</option>
              <option value="0">Sugestões</option>
              <option value="1">Erros</option>
              <option value="2">Relatos</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-borda-padrao px-3 py-1.5 bg-fundo-superficie-suave">
            <Clock className="h-3.5 w-3.5 text-texto-secundario" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value === "" ? "" : Number(e.target.value) as StatusSugestao);
                setPage(1);
              }}
              className="bg-transparent text-xs font-bold text-texto-principal outline-none cursor-pointer"
            >
              <option value="">Todos os Status</option>
              <option value="0">Pendentes</option>
              <option value="1">Analisados</option>
              <option value="2">Descartados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Cards de Solicitações */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <CircularProgress size={36} className="text-destaque" />
        </div>
      ) : !data || data.itens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-borda-padrao bg-fundo-superficie p-8 text-center">
          <MessageSquare className="h-10 w-10 text-texto-secundario/50 mb-3" />
          <p className="font-bold text-texto-principal">Nenhuma solicitação encontrada</p>
          <p className="text-xs text-texto-secundario mt-1">
            Experimente limpar os filtros ou realizar outra busca.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.itens.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenDetail(item.id)}
              className="group relative flex flex-col justify-between rounded-xl border border-borda-padrao bg-fundo-superficie p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-destaque/20 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fundo-superficie-suave">
                      {getTipoIcon(item.tipo)}
                    </div>
                    <div>
                      <span className="text-xs font-black text-texto-secundario">
                        {TipoSugestaoLabel[item.tipo]}
                      </span>
                      <p className="text-[10px] text-texto-secundario/70">
                        {new Date(item.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${getStatusBadgeClass(
                      item.status
                    )}`}
                  >
                    {StatusSugestaoLabel[item.status]}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-texto-principal line-clamp-1 group-hover:text-destaque transition-colors">
                    {item.titulo}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-texto-secundario">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 text-texto-secundario/60" />
                      <span className="truncate">{item.nomeContato || "Anônimo"}</span>
                    </div>
                    {item.emailContato && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-texto-secundario/60" />
                        <span className="truncate">{item.emailContato}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end border-t border-borda-padrao/50 pt-3">
                <span className="flex items-center gap-1 text-xs font-bold text-destaque opacity-80 group-hover:opacity-100 transition-opacity">
                  Analisar
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {data && data.totalPaginas > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            page={page}
            totalPages={data.totalPaginas}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Custom Tailwind modal for details */}
      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-borda-padrao bg-fundo-superficie p-6 text-texto-principal shadow-2xl space-y-4 relative">
            <button
              onClick={handleCloseDetail}
              className="absolute right-4 top-4 text-texto-secundario hover:text-texto-principal transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center justify-between gap-3 border-b border-borda-padrao/60 pb-3 pr-6">
              <span className="text-lg font-black text-texto-principal">Detalhes da Solicitação</span>
              {detailData && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${getStatusBadgeClass(
                    detailData.status
                  )}`}
                >
                  {StatusSugestaoLabel[detailData.status]}
                </span>
              )}
            </div>

            {isLoadingDetail || !detailData ? (
              <div className="flex justify-center py-10">
                <CircularProgress size={30} className="text-destaque" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Informações Gerais */}
                <div className="grid gap-2 rounded-lg border border-borda-padrao bg-fundo-superficie-suave p-4 text-xs font-medium">
                  <div className="flex justify-between border-b border-borda-padrao/50 pb-2">
                    <span className="font-bold text-texto-secundario text-[10px] uppercase tracking-wide">Tipo</span>
                    <span className="font-black text-texto-principal">{TipoSugestaoLabel[detailData.tipo]}</span>
                  </div>
                  <div className="flex justify-between border-b border-borda-padrao/50 pb-2">
                    <span className="font-bold text-texto-secundario text-[10px] uppercase tracking-wide">Contato</span>
                    <span className="font-bold text-texto-principal">{detailData.nomeContato || "Anônimo"}</span>
                  </div>
                  {detailData.emailContato && (
                    <div className="flex justify-between border-b border-borda-padrao/50 pb-2">
                      <span className="font-bold text-texto-secundario text-[10px] uppercase tracking-wide">E-mail</span>
                      <a
                        href={`mailto:${detailData.emailContato}`}
                        className="font-bold text-destaque hover:underline flex items-center gap-1"
                      >
                        {detailData.emailContato}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-bold text-texto-secundario text-[10px] uppercase tracking-wide">Data de envio</span>
                    <span className="text-texto-principal">
                      {new Date(detailData.createdAt).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(detailData.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>

                {/* Título e Descrição */}
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-texto-secundario">
                    Assunto / Título
                  </h4>
                  <p className="font-bold text-texto-principal text-base leading-tight">
                    {detailData.titulo}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-texto-secundario">
                    Descrição do Relato
                  </h4>
                  <div className="rounded-lg border border-borda-padrao bg-fundo-superficie-suave/50 p-4 text-xs font-semibold text-texto-principal whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {detailData.descricao}
                  </div>
                </div>

                {/* Ações de Status */}
                <div className="space-y-2 border-t border-borda-padrao/60 pt-3">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-texto-secundario">
                    Alterar Status
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      disabled={detailData.status === 0 || updateStatusMutation.isPending}
                      onClick={() => updateStatusMutation.mutate({ id: detailData.id, status: 0 })}
                      className="flex items-center gap-1.5 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100/80 px-3 py-1.5 text-xs font-bold text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      Pendente
                    </button>
                    <button
                      disabled={detailData.status === 1 || updateStatusMutation.isPending}
                      onClick={() => updateStatusMutation.mutate({ id: detailData.id, status: 1 })}
                      className="flex items-center gap-1.5 rounded border border-emerald-300 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 text-xs font-bold text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Analisado
                    </button>
                    <button
                      disabled={detailData.status === 2 || updateStatusMutation.isPending}
                      onClick={() => updateStatusMutation.mutate({ id: detailData.id, status: 2 })}
                      className="flex items-center gap-1.5 rounded border border-rose-300 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 text-xs font-bold text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Descartar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-borda-padrao/60">
              <button
                onClick={handleCloseDetail}
                className="rounded px-4 py-2 text-xs font-bold text-texto-secundario hover:bg-fundo-superficie-suave hover:text-texto-principal transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

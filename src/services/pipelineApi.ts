import { api } from "./api";
import type {
  PipelineGetDto,
  PipelineCreateDto,
  PipelineUpdateDto,
  PipelineExecucaoGetDto,
  PipelineExecucaoCreateDto,
  PipelineExecucaoExecutarResultDto,
  ResultadoPaginado,
} from "@/types/dtos";

export const pipelineApi = {
  async list(page = 1, limit = 10, busca?: string, ativo?: boolean | null) {
    const { data } = await api.get<ResultadoPaginado<PipelineGetDto>>(
      "/pipeline",
      {
        params: {
          page,
          limit,
          busca: busca || undefined,
          ativo: ativo !== null && ativo !== undefined ? ativo : undefined,
        },
      },
    );
    return data;
  },
  async listAll() {
    const { data } = await api.get<ResultadoPaginado<PipelineGetDto>>(
      "/pipeline",
      {
        params: { page: 1, limit: 100 },
      },
    );
    return data.itens;
  },
  async detail(id: number) {
    const { data } = await api.get<PipelineGetDto>(`/pipeline/${id}`);
    return data;
  },
  async create(payload: PipelineCreateDto) {
    const { data } = await api.post<PipelineGetDto>("/pipeline", payload);
    return data;
  },
  async update(id: number, payload: PipelineUpdateDto) {
    const { data } = await api.put<PipelineGetDto>(`/pipeline/${id}`, payload);
    return data;
  },
  async remove(id: number, hardDelete = false) {
    await api.delete(`/pipeline/${id}`, {
      params: { hardDelete },
    });
  },

  async executar(payload: PipelineExecucaoCreateDto) {
    const form = new FormData();
    form.append("Arquivo", payload.arquivo);
    form.append("PipelineId", String(payload.pipelineId));
    form.append("TabelaSilver", payload.tabelaSilver);
    form.append("TabelaGold", payload.tabelaGold);
    if (payload.colunasSensiveisJson) {
      form.append("ColunasSensiveisJson", payload.colunasSensiveisJson);
    }
    const { data } = await api.post<PipelineExecucaoExecutarResultDto>(
      "/pipeline/execucoes/executar",
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },
  async rollback(execucaoId: number) {
    await api.post(`/pipeline/execucoes/${execucaoId}/rollback`);
  },
  async listExecucoes(
    page = 1,
    limit = 10,
    status?: string | number | null,
    pipelineId?: number | null,
    busca?: string | null,
  ) {
    const { data } = await api.get<ResultadoPaginado<PipelineExecucaoGetDto>>(
      "/pipeline/execucoes",
      {
        params: {
          page,
          limit,
          status: status !== undefined && status !== null ? status : undefined,
          pipelineId: pipelineId || undefined,
          busca: busca || undefined,
        },
      },
    );
    return data;
  },
  async getExecucao(id: number) {
    const { data } = await api.get<PipelineExecucaoGetDto>(
      `/pipeline/execucoes/${id}`,
    );
    return data;
  },
  async toggleActive(id: number) {
    const { data } = await api.patch<{ message: string }>(
      `/pipeline/${id}/toggle`,
    );
    return data;
  },
};

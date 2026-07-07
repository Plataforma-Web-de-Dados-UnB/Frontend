import { api } from "./api";
import type {
  PipelineGetDto,
  PipelineCreateDto,
  PipelineUpdateDto,
  PipelineExecucaoGetDto,
  PipelineExecucaoCreateDto,
  UploadPreviewDto,
  ResultadoPaginado,
} from "@/types/dtos";

export const pipelineApi = {
  async list(page = 1, limit = 10) {
    const { data } = await api.get<ResultadoPaginado<PipelineGetDto>>(
      "/pipeline",
      {
        params: { page, limit },
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
  async remove(id: number) {
    await api.delete(`/pipeline/${id}`);
  },

  async uploadCsv(arquivo: File) {
    const form = new FormData();
    form.append("Arquivo", arquivo);
    const { data } = await api.post<UploadPreviewDto>(
      "/pipeline/execucoes/upload",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  },
  async executar(payload: PipelineExecucaoCreateDto) {
    const { data } = await api.post<PipelineExecucaoGetDto>(
      "/pipeline/execucoes/executar",
      payload,
    );
    return data;
  },
  async rollback(execucaoId: number) {
    await api.post(`/pipeline/execucoes/${execucaoId}/rollback`);
  },
  async listExecucoes(page = 1, limit = 10) {
    const { data } = await api.get<ResultadoPaginado<PipelineExecucaoGetDto>>(
      "/pipeline/execucoes",
      { params: { page, limit } },
    );
    return data;
  },
  async getExecucao(id: number) {
    const { data } = await api.get<PipelineExecucaoGetDto>(
      `/pipeline/execucoes/${id}`,
    );
    return data;
  },
};

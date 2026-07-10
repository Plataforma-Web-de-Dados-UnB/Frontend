import { api } from "./api";
import type {
  SugestaoCreateDto,
  SugestaoListDto,
  SugestaoGetDto,
  ResultadoPaginado,
  StatusSugestao,
  TipoSugestao,
} from "@/types/dtos";

export const sugestaoApi = {
  async create(payload: SugestaoCreateDto) {
    await api.post("/sugestao", payload);
  },

  async list(params?: {
    status?: StatusSugestao;
    tipo?: TipoSugestao;
    busca?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get<ResultadoPaginado<SugestaoListDto>>(
      "/sugestao",
      { params },
    );
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get<SugestaoGetDto>(`/sugestao/${id}`);
    return response.data;
  },

  async updateStatus(id: number, status: StatusSugestao) {
    const response = await api.patch<{ message: string }>(
      `/sugestao/${id}/status`,
      { status },
    );
    return response.data;
  },
};

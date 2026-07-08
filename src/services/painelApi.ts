import { api } from "./api";
import type {
  PainelGetDto,
  PainelCreateDto,
  PainelUpdateDto,
  ResultadoPaginado,
} from "@/types/dtos";

export const painelApi = {
  async list(page = 1, limit = 10, categoriaId?: number) {
    const { data } = await api.get<ResultadoPaginado<PainelGetDto>>("/painel", {
      params: { page, limit, categoriaId },
    });
    return data;
  },
  async listByCategoria(categoriaId: number) {
    const { data } = await api.get<ResultadoPaginado<PainelGetDto>>("/painel", {
      params: { categoriaId, page: 1, limit: 100 },
    });
    return data.itens;
  },
  async listAdmin(page = 1, limit = 10, categoriaId?: number) {
    const { data } = await api.get<ResultadoPaginado<PainelGetDto>>(
      "/painel/admin",
      {
        params: { page, limit, categoriaId },
      },
    );
    return data;
  },
  async detail(id: number) {
    const { data } = await api.get<PainelGetDto>(`/painel/${id}`);
    return data;
  },
  async create(payload: PainelCreateDto) {
    const { data } = await api.post<PainelGetDto>("/painel", payload);
    return data;
  },
  async update(id: number, payload: PainelUpdateDto) {
    const { data } = await api.put<PainelGetDto>(`/painel/${id}`, payload);
    return data;
  },
  async remove(id: number) {
    await api.delete(`/painel/${id}`);
  },
  async toggleActive(id: number) {
    const { data } = await api.patch<{ message: string }>(`/painel/${id}/toggle`);
    return data;
  },
};

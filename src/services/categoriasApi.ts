import { api } from "./api";
import type {
  CategoriaGetDto,
  CategoriaCreateDto,
  ResultadoPaginado,
} from "@/types/dtos";

export const categoriasApi = {
  async list(page = 1, limit = 10) {
    const { data } = await api.get<ResultadoPaginado<CategoriaGetDto>>(
      "/categoria",
      {
        params: { page, limit },
      },
    );
    return data;
  },
  async listAll() {
    const { data } = await api.get<ResultadoPaginado<CategoriaGetDto>>(
      "/categoria",
      {
        params: { page: 1, limit: 100 },
      },
    );
    return data.itens;
  },
  async listAdmin(page = 1, limit = 10, busca?: string, active?: boolean) {
    const { data } = await api.get<ResultadoPaginado<CategoriaGetDto>>(
      "/categoria/admin",
      {
        params: { page, limit, busca, active },
      },
    );
    return data;
  },
  async detail(id: number) {
    const { data } = await api.get<CategoriaGetDto>(`/categoria/${id}`);
    return data;
  },
  async create(payload: CategoriaCreateDto) {
    const form = new FormData();
    form.append("Nome", payload.nome);
    if (payload.descricao) form.append("Descricao", payload.descricao);
    if (payload.sortOrdem !== undefined)
      form.append("SortOrdem", String(payload.sortOrdem));
    if (payload.imagem) form.append("Imagem", payload.imagem);
    const { data } = await api.post<CategoriaGetDto>("/categoria", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  async update(id: number, payload: CategoriaCreateDto) {
    const form = new FormData();
    form.append("Nome", payload.nome);
    if (payload.descricao) form.append("Descricao", payload.descricao);
    if (payload.sortOrdem !== undefined)
      form.append("SortOrdem", String(payload.sortOrdem));
    if (payload.imagem) form.append("Imagem", payload.imagem);
    const { data } = await api.put<CategoriaGetDto>(`/categoria/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  async remove(id: number) {
    await api.delete(`/categoria/${id}`);
  },
  async toggleActive(id: number) {
    const { data } = await api.patch<{ message: string }>(
      `/categoria/${id}/toggle`,
    );
    return data;
  },
};

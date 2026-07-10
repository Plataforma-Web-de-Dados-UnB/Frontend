import { api } from "./api";
import type { UsuarioGetDto, ResultadoPaginado } from "@/types/dtos";

export const usuarioApi = {
  async me() {
    const { data } = await api.get<UsuarioGetDto>("/usuario/perfil");
    return data;
  },
  async list(
    page = 1,
    limit = 10,
    status?: string,
    cargo?: string,
    busca?: string,
  ) {
    const { data } = await api.get<ResultadoPaginado<UsuarioGetDto>>(
      "/admin/usuarios",
      {
        params: { page, limit, status, cargo, busca },
      },
    );
    return data;
  },
  async aprovar(id: string) {
    await api.put(`/admin/usuarios/${id}/status`, { status: "Ativo" });
  },
  async revogar(id: string) {
    await api.put(`/admin/usuarios/${id}/status`, { status: "Recusado" });
  },
  async remover(id: string) {
    await api.delete(`/admin/usuarios/${id}`);
  },
};

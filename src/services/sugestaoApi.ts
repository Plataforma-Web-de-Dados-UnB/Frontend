import { api } from "./api";
import type { SugestaoCreateDto } from "@/types/dtos";

export const sugestaoApi = {
  async create(payload: SugestaoCreateDto) {
    await api.post("/sugestao", payload);
  },
};

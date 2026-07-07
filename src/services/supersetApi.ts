import { api } from "./api";

export const supersetApi = {
  async getGuestToken(dashboardId: string) {
    const { data } = await api.post<{ token: string }>("/superset/guest-token", {
      dashboardId,
    });
    return data.token;
  },
};

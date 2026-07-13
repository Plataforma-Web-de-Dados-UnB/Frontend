import { api } from "./api";

export const supersetApi = {
  async getGuestToken(dashboardId: string) {
    const { data } = await api.post<{ token: string }>(
      "/superset/guest-token",
      {
        dashboardId,
      },
    );
    return data.token;
  },

  async getSsoUrl() {
    const { data } = await api.get<{ url: string }>("/superset/sso-url");
    return data.url;
  },
};

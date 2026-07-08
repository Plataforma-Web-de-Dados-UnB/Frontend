import axios from "axios";
import { APP_CONFIG } from "@/utils/constants";
import type { ApiError } from "@/types/api";
import { requestTracker } from "./requestTracker";

const normalizeApiError = (error: unknown): ApiError => {
  if (!axios.isAxiosError(error)) {
    const fallback = new Error("Erro inesperado de comunicação.") as ApiError;
    fallback.raw = error;
    return fallback;
  }

  const status = error.response?.status;
  const data = error.response?.data as unknown;
  const defaultMessage = "Falha ao processar a requisição.";

  if (typeof data === "string") {
    const apiError = new Error(data || defaultMessage) as ApiError;
    apiError.status = status;
    apiError.raw = data;
    return apiError;
  }

  if (typeof data === "object" && data !== null) {
    const maybeValidation = data as any;
    const fieldErrors = maybeValidation.errors;
    const fieldMessages = fieldErrors
      ? Object.values(fieldErrors).flat().filter(Boolean)
      : [];
    const message =
      fieldMessages[0] ?? maybeValidation.message ?? maybeValidation.title ?? defaultMessage;

    const apiError = new Error(message) as ApiError;
    apiError.status = status;
    apiError.fieldErrors = fieldErrors;
    apiError.raw = data;
    return apiError;
  }

  const apiError = new Error(defaultMessage) as ApiError;
  apiError.status = status;
  apiError.raw = data;
  return apiError;
};

export const api = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string | null) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("portal@access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  requestTracker.start();
  return config;
});

api.interceptors.response.use(
  (response) => {
    requestTracker.end();
    return response;
  },
  async (error) => {
    requestTracker.end();
    const originalRequest = error.config;

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/usuario/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post<{ accessToken: string }>("/usuario/refresh");
        const { accessToken } = response.data;
        localStorage.setItem("portal@access_token", accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("portal@access_token");
        localStorage.removeItem("portal@user");
        window.location.href = "/entrar";
        return Promise.reject(normalizeApiError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

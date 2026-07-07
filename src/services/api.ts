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
});

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
  (error) => {
    requestTracker.end();
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("portal@access_token");
      localStorage.removeItem("portal@refresh_token");
      localStorage.removeItem("portal@user");
      window.location.href = "/entrar";
    }
    return Promise.reject(normalizeApiError(error));
  },
);

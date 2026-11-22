import { apiClient } from "@/lib/api-client";

export const apiPost = <T = unknown>(endpoint: string, payload: unknown) => apiClient<T>(endpoint, {
  method: "POST", body: JSON.stringify(payload),
});
export const apiDelete = <T = unknown>(endpoint: string) => apiClient<T>(endpoint, { method: "DELETE" });
export const apiUpdate = <T = unknown>(endpoint: string, payload?: unknown) => apiClient<T>(endpoint, {
  method: "PATCH", ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
});

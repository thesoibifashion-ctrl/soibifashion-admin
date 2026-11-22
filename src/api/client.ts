/* eslint-disable @typescript-eslint/no-explicit-any -- existing API callers rely on inferred JSON shapes. */
import { apiClient } from "@/lib/api-client";

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return apiClient<T>(endpoint, options);
}

export const apiGet = (endpoint: string) => apiRequest(endpoint, { method: "GET" });
export const apiPost = <T = any>(endpoint: string, payload?: unknown) => apiRequest<T>(endpoint, {
  method: "POST",
  ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
});
export const apiPatch = (endpoint: string, payload: unknown) => apiRequest(endpoint, {
  method: "PATCH", body: JSON.stringify(payload),
});
export const apiDelete = (endpoint: string) => apiRequest(endpoint, { method: "DELETE" });

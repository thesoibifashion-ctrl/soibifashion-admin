/* eslint-disable @typescript-eslint/no-explicit-any -- preserve the prior inferred API response types. */
import { apiClient } from "@/lib/api-client";

export interface ApiResponse<T> { success: boolean; message: string; data: T }

const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const result = await apiClient<ApiResponse<T>>(endpoint, options);
  if (result && typeof result === "object" && "success" in result) {
    if (!result.success) throw new Error(result.message || "Something went wrong");
    return result.data;
  }
  return result as T;
};

export const apiGet = <T>(endpoint: string) => apiRequest<T>(endpoint);
export const apiPost = <T>(endpoint: string, body?: unknown) => apiRequest<T>(endpoint, {
  method: "POST", ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
});
export const apiPatch = <T>(endpoint: string, body?: unknown) => apiRequest<T>(endpoint, {
  method: "PATCH", ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
});
export const apiPut = <T>(endpoint: string, body?: unknown) => apiRequest<T>(endpoint, {
  method: "PUT", ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
});
export const apiDelete = <T = null>(endpoint: string) => apiRequest<T>(endpoint, { method: "DELETE" });

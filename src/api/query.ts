/* eslint-disable @typescript-eslint/no-explicit-any -- existing call sites rely on inferred JSON shapes. */
import { apiClient } from "@/lib/api-client";

export function apiRequestWithParams<T = any>(endpoint: string, params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });
  return apiClient<T>(`${endpoint}?${searchParams.toString()}`);
}

export const apiGet = <T = any>(endpoint: string) => apiClient<T>(endpoint);

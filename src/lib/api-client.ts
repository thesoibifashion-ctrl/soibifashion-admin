import { authStorage, refreshAccessToken } from "@/lib/auth-storage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const tokenAtStart = authStorage.getToken();
  const makeRequest = () => {
    const headers = new Headers(options.headers);
    const token = authStorage.getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  let response = await makeRequest();
  const isAuthEndpoint = endpoint.startsWith("/api/auth/");
  if (response.status === 401 && !isAuthEndpoint) {
    if (authStorage.getToken() !== tokenAtStart && authStorage.getToken()) {
      response = await makeRequest();
    } else if (await refreshAccessToken()) {
      response = await makeRequest();
    }
  }
  return response;
}

// Existing API consumers rely on inferred JSON response shapes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiClient<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await apiFetch(endpoint, options);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.message || `Request failed: ${response.status}`);
  }
  return data as T;
}

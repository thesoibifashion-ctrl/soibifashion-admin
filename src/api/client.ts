import { supabase } from "@/lib/supabase";

export async function apiRequest(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    const message = Array.isArray(errorData?.message)
      ? errorData.message[0]
      : errorData?.message;
  
    throw new Error(message || `Request failed: ${res.status}`);
  }

  return res.json();
}


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function getAccessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = await getAccessToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let errorMessage = `Request failed: ${res.status}`;

    try {
      const error = await res.json();
      errorMessage = error.message || errorMessage;
    } catch {}

    throw new Error(errorMessage);
  }

  if (res.status === 204) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export function apiGet(endpoint: string) {
  return apiFetch(endpoint, {
    method: "GET",
  });
}

export function apiPost(endpoint: string, payload: unknown) {
  return apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function apiPatch(endpoint: string, payload: unknown) {
  return apiFetch(endpoint, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function apiDelete(endpoint: string) {
  return apiFetch(endpoint, {
    method: "DELETE",
  });
}
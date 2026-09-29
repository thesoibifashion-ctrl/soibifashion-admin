const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${VITE_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
      ...options.headers,
    },
  });

  const result: ApiResponse<T> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong");
  }

  return result.data;
};

export const apiGet = <T>(endpoint: string) => {
  return apiRequest<T>(endpoint);
};

export const apiPost = <T>(endpoint: string, body?: unknown) => {
  return apiRequest<T>(endpoint, {
    method: "POST",
    ...(body !== undefined && {
      body: JSON.stringify(body),
    }),
  });
};

export const apiPatch = <T>(endpoint: string, body?: unknown) => {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    ...(body !== undefined && {
      body: JSON.stringify(body),
    }),
  });
};

export const apiPut = <T>(endpoint: string, body?: unknown) => {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    ...(body !== undefined && {
      body: JSON.stringify(body),
    }),
  });
};

export const apiDelete = <T = null>(endpoint: string) => {
  return apiRequest<T>(endpoint, {
    method: "DELETE",
  });
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// for requests with no query params — just endpoint + options
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

// for requests with query params (filters, pagination, etc.)
// export async function apiRequestWithParams(
//   endpoint: string,
//   params: Record<string, string | number | undefined>,
//   options?: RequestInit
// ) {
//   const searchParams = new URLSearchParams();

//   Object.entries(params).forEach(([key, value]) => {
//     if (value !== undefined) searchParams.set(key, String(value));
//   });

//   const res = await fetch(`${BASE_URL}${endpoint}?${searchParams.toString()}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...options?.headers,
//     },
//   });

//   if (!res.ok) {
//     throw new Error(`Request failed: ${res.status}`);
//   }

//   return res.json();
// }
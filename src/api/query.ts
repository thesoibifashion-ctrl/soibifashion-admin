
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequestWithParams(
  endpoint: string,
  params: Record<string, string | number | undefined>
) {
  const token = localStorage.getItem('accessToken');
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });

  const res = await fetch(`${BASE_URL}${endpoint}?${searchParams.toString()}`, {
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}` ,
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

export async function apiGet(endpoint: string) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || `Request failed: ${res.status}`);
  }

  return res.json();
}
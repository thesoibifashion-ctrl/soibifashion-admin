
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiPost(endpoint: string, payload: Record<string, any>) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || `Request failed: ${res.status}`);
  }

  return res.json();
}
export async function apiDelete(endpoint: string) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.message || `Request failed: ${res.status}`);
    }
  
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  export async function apiUpdate(endpoint: string, payload?: Record<string, any>) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.message || `Request failed: ${res.status}`);
    }
  
    return res.json();
  }
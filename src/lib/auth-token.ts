export function getAuthToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }
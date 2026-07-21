import { apiRequest } from "../client";

export function authLogin(payload: { email: string; password: string }) {
    return apiRequest("/user/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  export function requestPassword(payload: { email: string; }) {
    return apiRequest("/user/request-password-reset", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
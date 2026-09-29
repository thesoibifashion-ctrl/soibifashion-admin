import { apiPost, apiRequest } from "../client";
export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  accessToken: string;
  data: {
    accessToken: string;
    expiresIn: string;
    tokenType: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      avatarUrl: string | null;
      isActive: boolean;
      phone: string | null;
      role: string;
    };
  };
}
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
  export const requestCode = (payload: { email: string }) => {
    return apiPost("/api/auth/request-code", payload);
  };
  
  export const verifyCode = (payload: { email: string; code: string }) => {
    return apiPost("/api/auth/verify-code", payload);
  };
  
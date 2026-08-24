import { apiClient } from "@/lib/api-client";

type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    tokenType: string;
    expiresIn: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      phone: string | null;
      avatarUrl: string | null;
      role: string;
      isActive: boolean;
    };
  };
};

export const login = (payload: LoginPayload) =>
  apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
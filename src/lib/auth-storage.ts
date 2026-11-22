import { toast } from "sonner";

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  [key: string]: unknown;
};

export type AuthSession = {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: AuthUser;
};

let accessToken: string | null = null;
let currentUser: AuthUser | null = null;
let refreshInFlight: Promise<boolean> | null = null;
let initialization: Promise<boolean> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const authStorage = {
  getToken: () => accessToken,
  getUser: () => currentUser,
  setSession: (session: AuthSession) => {
    accessToken = session.accessToken;
    currentUser = session.user;
    notify();
  },
  setToken: (token: string) => {
    accessToken = token;
    notify();
  },
  removeToken: () => {
    accessToken = null;
    currentUser = null;
    notify();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

type Envelope<T> = { success: boolean; message: string; data: T };
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REFRESH_ERROR_TOAST_ID = "auth-refresh-unavailable";

function isInvalidRefreshToken(status: number, body: unknown): boolean {
  if (status === 401) return true;
  if (!body || typeof body !== "object") return false;

  const values = Object.values(body as Record<string, unknown>);
  const message = values.filter((value) => typeof value === "string").join(" ").toLowerCase();
  return /refresh.{0,30}(token).{0,30}(invalid|expired|revoked|reject)|(?:invalid|expired|revoked|reject).{0,30}refresh.{0,30}token/.test(
    message,
  );
}

function notifyRefreshUnavailable() {
  toast.error("The service is temporarily unavailable. Please try again.", {
    id: REFRESH_ERROR_TOAST_ID,
  });
}

export async function refreshAccessToken(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        let body: unknown;
        try {
          body = await response.json();
        } catch {
          body = null;
        }
        if (!response.ok) {
          if (isInvalidRefreshToken(response.status, body)) authStorage.removeToken();
          else notifyRefreshUnavailable();
          return false;
        }
        const refreshBody = body as Envelope<AuthSession> | null;
        if (!refreshBody?.success || !refreshBody.data?.accessToken || !refreshBody.data.user) {
          if (isInvalidRefreshToken(response.status, body)) authStorage.removeToken();
          else notifyRefreshUnavailable();
          return false;
        }
        authStorage.setSession(refreshBody.data);
        return true;
      } catch {
        notifyRefreshUnavailable();
        return false;
      }
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

export function initializeAuth(): Promise<boolean> {
  if (!initialization) {
    initialization = refreshAccessToken().finally(() => {
      initialization = null;
    });
  }
  return initialization;
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Local state must still be cleared if the network is unavailable.
  } finally {
    authStorage.removeToken();
  }
}


import { authStorage } from "@/lib/auth-storage";

export function getAuthToken() {
  return authStorage.getToken();
}

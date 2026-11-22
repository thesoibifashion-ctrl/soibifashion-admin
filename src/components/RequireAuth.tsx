import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSyncExternalStore } from "react";
import { authStorage } from "@/lib/auth-storage";
import { useAuthInitialized } from "@/components/auth-context";

export function RequireAuth() {
  const location = useLocation();
  const initialized = useAuthInitialized();
  const user = useSyncExternalStore(authStorage.subscribe, authStorage.getUser, authStorage.getUser);
  if (!initialized) return null;
  if (!user || !["admin", "super_admin"].includes(user.role)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export function RedirectIfAuthed() {
  const initialized = useAuthInitialized();
  const user = useSyncExternalStore(authStorage.subscribe, authStorage.getUser, authStorage.getUser);
  if (!initialized) return null;
  if (user && ["admin", "super_admin"].includes(user.role)) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}

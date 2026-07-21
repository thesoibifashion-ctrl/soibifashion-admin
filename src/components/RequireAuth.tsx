import { Navigate, Outlet, useLocation } from "react-router-dom";

export function RequireAuth() {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function RedirectIfAuthed() {
    const token = localStorage.getItem("accessToken");
  
    if (token) {
      return <Navigate to="/" replace />;
    }
  
    return <Outlet />;
  }
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, isSuperAdmin } from "../auth/token";

export default function RequireSuperAdmin() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isSuperAdmin()) {
    return <Navigate to="/meetings" replace />;
  }

  return <Outlet />;
}

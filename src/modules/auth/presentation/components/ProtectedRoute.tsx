import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <div>Cargando sistema de seguridad...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../stores/useAuthStore';
import { Loading } from '../../../../core/presentation/components/ui/Loading';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <Loading message="Verificando credenciales..." />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

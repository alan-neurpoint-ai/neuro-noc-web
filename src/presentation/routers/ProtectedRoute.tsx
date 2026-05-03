import { useEffect } from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../store/AuthStore";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, hydrate } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      hydrate();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-accent animate-pulse">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

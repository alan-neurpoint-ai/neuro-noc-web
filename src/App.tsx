import { useEffect } from "react";
import { AppRouter } from "./main/routes/AppRouter";
import { useAuthStore } from "./modules/auth/presentation/stores/useAuthStore";
import { authService } from "./modules/auth/infrastructure/services/auth.service";

export default function App() {
  const setAuth = useAuthStore((state) => state.setAuth);
  useEffect(() => {
    authService.getCurrentSession().then((data) => {
      if (data?.profile) setAuth(data.profile);
      else useAuthStore.getState().setAuth(null);
    });
  }, [setAuth]);

  return <AppRouter />;
}

import { useMemo } from "react";
import { useUserOrganization } from "./useUserOrganization";
import { useAuthStore } from "../store/AuthStore";

const ROLE_DISPLAY: Record<string, string> = {
  super_admin: "Super Administrador",
  admin: "Administrador",
  cliente: "Cliente VIP",
  usuario: "Usuario Operador",
};

export const useUserData = () => {
  const { user, userRole } = useAuthStore();
  const { organization, isLoading: isLoadingOrg } = useUserOrganization(
    user?.id,
  );

  const userData = useMemo(() => {
    const fullName =
      `${user?.first_name || ""} ${user?.last_name || ""}`.trim();

    return {
      id: user?.id,
      name: fullName || user?.email || "Usuario",
      roleDisplay: ROLE_DISPLAY[userRole || "usuario"] || "Usuario",
      role: userRole || "usuario",
      email: user?.email || "",
      organization: organization?.name || "Cargando...",
      avatar: user?.avatar_url || undefined,
    };
  }, [user, userRole, organization]);

  return {
    userData,
    isLoading: isLoadingOrg,
    isAuthenticated: !!user,
  };
};

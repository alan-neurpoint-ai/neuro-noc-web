import {
  BiHome,
  BiData,
  BiUser,
  BiShield,
  BiCog,
  BiBell,
  BiBook,
  BiNetworkChart,
  BiBrain,
  BiBuilding,
} from "react-icons/bi";
import type { NavItem, RoleName } from "../types/navigation/navigation.types";

const navigationConfig: Record<RoleName, NavItem[]> = {
  super_admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BiHome className="text-xl" />,
      path: "/dashboard",
    },
    {
      id: "organizations",
      label: "Organizaciones",
      icon: <BiBuilding className="text-xl" />,
      path: "/dashboard/organizations",
    },
  ],
  admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BiHome className="text-xl" />,
      path: "/dashboard",
    },
    {
      id: "users",
      label: "Usuarios",
      icon: <BiUser className="text-xl" />,
      path: "/dashboard/users",
    },
    {
      id: "roles",
      label: "Roles",
      icon: <BiShield className="text-xl" />,
      path: "/dashboard/roles",
    },
    {
      id: "permissions",
      label: "Permisos",
      icon: <BiData className="text-xl" />,
      path: "/dashboard/permissions",
    },
    {
      id: "contexts",
      label: "Contextos Temporales",
      icon: <BiNetworkChart className="text-xl" />,
      path: "/dashboard/contexts",
    },
    {
      id: "ai-config",
      label: "Configuración IA",
      icon: <BiBrain className="text-xl" />,
      path: "/dashboard/ai-config",
    },
    {
      id: "rules",
      label: "Reglas de Negocio",
      icon: <BiData className="text-xl" />,
      path: "/dashboard/rules",
    },
    {
      id: "documentation",
      label: "Documentación",
      icon: <BiBook className="text-xl" />,
      path: "/dashboard/documentation",
    },
    {
      id: "settings",
      label: "Configuración",
      icon: <BiCog className="text-xl" />,
      path: "/dashboard/settings",
    },
  ],
  client: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BiHome className="text-xl" />,
      path: "/dashboard",
    },
    {
      id: "ai-agents",
      label: "Agentes IA",
      icon: <BiBrain className="text-xl" />,
      path: "/dashboard/ai-agents",
    },
    {
      id: "topology",
      label: "Topología de Red",
      icon: <BiNetworkChart className="text-xl" />,
      path: "/dashboard/topology",
    },
    {
      id: "monitoring",
      label: "Monitoreo",
      icon: <BiBell className="text-xl" />,
      path: "/dashboard/monitoring",
    },
  ],
  user: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BiHome className="text-xl" />,
      path: "/dashboard",
    },
    {
      id: "knowledge",
      label: "Base de Conocimientos",
      icon: <BiBook className="text-xl" />,
      path: "/dashboard/knowledge",
    },
    {
      id: "monitoring",
      label: "Monitoreo de Alertas",
      icon: <BiBell className="text-xl" />,
      path: "/dashboard/monitoring",
    },
  ],
};

const defaultNavigation: NavItem[] = navigationConfig.user;

export const navigationService = {
  getNavigationByRole(roleName: RoleName | undefined | null): NavItem[] {
    if (!roleName || !navigationConfig[roleName]) {
      return defaultNavigation;
    }
    return navigationConfig[roleName];
  },
};

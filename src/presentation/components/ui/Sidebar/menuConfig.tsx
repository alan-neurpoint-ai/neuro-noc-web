import type { JSX } from "react";
import {
  HiBell,
  HiChartBar,
  HiChip,
  HiCog,
  HiDatabase,
  HiDocumentText,
  HiServer,
  HiUserGroup,
  HiUsers,
} from "react-icons/hi";

export interface MenuItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

const BASE_PATHS: Record<string, string> = {
  super_admin: "/dashboard/super_admin",
  admin: "/dashboard/admin",
  cliente: "/dashboard/cliente",
  usuario: "/dashboard/usuario",
};

export const MENU_ITEMS_BY_ROLE: Record<string, MenuItem[]> = {
  super_admin: [
    {
      icon: <HiChartBar size={22} />,
      label: "Dashboard",
      path: BASE_PATHS.super_admin,
    },
    {
      icon: <HiUserGroup size={22} />,
      label: "Clientes",
      path: `${BASE_PATHS.super_admin}/clientes`,
    },
  ],
  admin: [
    {
      icon: <HiChartBar size={22} />,
      label: "Dashboard",
      path: BASE_PATHS.admin,
    },
    {
      icon: <HiUsers size={22} />,
      label: "Usuarios",
      path: `${BASE_PATHS.admin}/usuarios`,
    },
    {
      icon: <HiServer size={22} />,
      label: "Nodos",
      path: `${BASE_PATHS.admin}/nodos`,
    },
    {
      icon: <HiDatabase size={22} />,
      label: "Storage",
      path: `${BASE_PATHS.admin}/storage`,
    },
    {
      icon: <HiBell size={22} />,
      label: "Alertas",
      path: `${BASE_PATHS.admin}/alertas`,
    },
    {
      icon: <HiChip size={22} />,
      label: "IA Config",
      path: `${BASE_PATHS.admin}/ia-config`,
    },
    {
      icon: <HiDocumentText size={22} />,
      label: "Documentación",
      path: `${BASE_PATHS.admin}/docs`,
    },
    {
      icon: <HiCog size={22} />,
      label: "Configuración",
      path: `${BASE_PATHS.admin}/settings`,
    },
  ],
  cliente: [
    {
      icon: <HiChartBar size={22} />,
      label: "Dashboard",
      path: BASE_PATHS.cliente,
    },
    {
      icon: <HiServer size={22} />,
      label: "Mis Nodos",
      path: `${BASE_PATHS.cliente}/nodos`,
    },
    {
      icon: <HiBell size={22} />,
      label: "Alertas",
      path: `${BASE_PATHS.cliente}/alertas`,
    },
    {
      icon: <HiChip size={22} />,
      label: "IA Config",
      path: `${BASE_PATHS.cliente}/ia-config`,
    },
    {
      icon: <HiDocumentText size={22} />,
      label: "Documentación",
      path: `${BASE_PATHS.cliente}/docs`,
    },
  ],
  usuario: [
    {
      icon: <HiChartBar size={22} />,
      label: "Dashboard",
      path: BASE_PATHS.usuario,
    },
    {
      icon: <HiBell size={22} />,
      label: "Alertas",
      path: `${BASE_PATHS.usuario}/alertas`,
    },
    {
      icon: <HiDocumentText size={22} />,
      label: "Documentación",
      path: `${BASE_PATHS.usuario}/docs`,
    },
  ],
};

const roleMapping: Record<string, string> = {
  "Super Administrador": "super_admin",
  "Administrador de Organización": "admin",
  "Cliente VIP": "cliente",
  "Usuario Operador": "usuario",
};

export const getMenuItemsByRole = (role: string): MenuItem[] => {
  const normalizedRole = roleMapping[role] || role;
  return MENU_ITEMS_BY_ROLE[normalizedRole] || MENU_ITEMS_BY_ROLE.usuario;
};

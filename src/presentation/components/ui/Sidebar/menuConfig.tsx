import type { JSX } from "react";
import {
  HiBell,
  HiChartBar,
  HiChip,
  HiCog,
  HiDatabase,
  HiDocumentText,
  HiOfficeBuilding,
  HiServer,
  HiShieldCheck,
  HiTerminal,
  HiUsers,
} from "react-icons/hi";

export interface MenuItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

export const MENU_ITEMS_BY_ROLE: Record<string, MenuItem[]> = {
  super_admin: [
    {
      icon: <HiChartBar size={22} />,
      label: "Dashboard",
      path: "/dashboard/super_admin",
    },
    {
      icon: <HiOfficeBuilding size={22} />,
      label: "Organizaciones",
      path: "/organizations",
    },
    { icon: <HiUsers size={22} />, label: "Usuarios", path: "/users" },
    { icon: <HiServer size={22} />, label: "Nodos", path: "/nodes" },
    { icon: <HiDatabase size={22} />, label: "Storage", path: "/storage" },
    {
      icon: <HiShieldCheck size={22} />,
      label: "Seguridad",
      path: "/security",
    },
    { icon: <HiBell size={22} />, label: "Alertas", path: "/alerts" },
    { icon: <HiChip size={22} />, label: "IA Config", path: "/ai-config" },
    {
      icon: <HiDocumentText size={22} />,
      label: "Documentación",
      path: "/docs",
    },
    { icon: <HiTerminal size={22} />, label: "Terminal", path: "/terminal" },
    { icon: <HiCog size={22} />, label: "Configuración", path: "/settings" },
  ],
  admin: [
    {
      icon: <HiChartBar size={22} />,
      label: "Dashboard",
      path: "/dashboard/admin",
    },
    { icon: <HiUsers size={22} />, label: "Usuarios", path: "/users" },
    { icon: <HiServer size={22} />, label: "Nodos", path: "/nodes" },
    { icon: <HiDatabase size={22} />, label: "Storage", path: "/storage" },
    { icon: <HiBell size={22} />, label: "Alertas", path: "/alerts" },
    { icon: <HiChip size={22} />, label: "IA Config", path: "/ai-config" },
    {
      icon: <HiDocumentText size={22} />,
      label: "Documentación",
      path: "/docs",
    },
    { icon: <HiCog size={22} />, label: "Configuración", path: "/settings" },
  ],
  cliente: [
    {
      icon: <HiChartBar size={22} />,
      label: "Dashboard",
      path: "/dashboard/cliente",
    },
    { icon: <HiServer size={22} />, label: "Mis Nodos", path: "/nodes" },
    { icon: <HiBell size={22} />, label: "Alertas", path: "/alerts" },
    { icon: <HiChip size={22} />, label: "IA Config", path: "/ai-config" },
    {
      icon: <HiDocumentText size={22} />,
      label: "Documentación",
      path: "/docs",
    },
  ],
  usuario: [
    {
      icon: <HiChartBar size={22} />,
      label: "Dashboard",
      path: "/dashboard/usuario",
    },
    { icon: <HiBell size={22} />, label: "Alertas", path: "/alerts" },
    {
      icon: <HiDocumentText size={22} />,
      label: "Documentación",
      path: "/docs",
    },
  ],
};

export const getMenuItemsByRole = (role: string): MenuItem[] => {
  return MENU_ITEMS_BY_ROLE[role] || MENU_ITEMS_BY_ROLE.usuario;
};

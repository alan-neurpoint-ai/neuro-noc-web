import { lazy } from "react";
import type { RouteObject } from "react-router";

const SuperadminPage = lazy(
  () => import("../../pages/Superadmin/SuperadminPage"),
);
const ClientsPage = lazy(
  () => import("../../pages/Superadmin/clients/ClientsPage"),
);
const ClientEditPage = lazy(
  () => import("../../pages/Superadmin/clients/edit/ClientEditPage"),
);

export const superadminRoutes: RouteObject[] = [
  {
    path: "/dashboard/super_admin",
    element: <SuperadminPage />,
  },
  {
    path: "/dashboard/super_admin/clientes",
    element: <ClientsPage />,
  },
  {
    path: "/dashboard/super_admin/clientes/:clientId/edit",
    element: <ClientEditPage />,
  },
];

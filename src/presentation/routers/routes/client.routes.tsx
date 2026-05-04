import { lazy } from "react";
import type { RouteObject } from "react-router";

const ClientPage = lazy(() => import("../../pages/Client/ClientPage"));

export const clientRoutes: RouteObject[] = [
  {
    path: "/dashboard/cliente",
    element: <ClientPage />,
  },
  {
    path: "/dashboard/cliente/nodos",
    element: <ClientPage />,
  },
  {
    path: "/dashboard/cliente/alertas",
    element: <ClientPage />,
  },
  {
    path: "/dashboard/cliente/ia-config",
    element: <ClientPage />,
  },
  {
    path: "/dashboard/cliente/docs",
    element: <ClientPage />,
  },
];

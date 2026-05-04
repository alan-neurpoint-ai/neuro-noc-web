import { lazy } from "react";
import type { RouteObject } from "react-router";

const UserPage = lazy(() => import("../../pages/User/UserPage"));

export const userRoutes: RouteObject[] = [
  {
    path: "/dashboard/usuario",
    element: <UserPage />,
  },
  {
    path: "/dashboard/usuario/alertas",
    element: <UserPage />,
  },
  {
    path: "/dashboard/usuario/docs",
    element: <UserPage />,
  },
];

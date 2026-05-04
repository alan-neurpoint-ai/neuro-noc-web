import { type RouteObject } from "react-router";
import { superadminRoutes } from "./routes/superadmin.routes";
import { adminRoutes } from "./routes/admin.routes";
import { clientRoutes } from "./routes/client.routes";
import { userRoutes } from "./routes/user.routes";

export const ROLE_ROUTES_MAP: Record<string, RouteObject[]> = {
  super_admin: superadminRoutes,
  admin: adminRoutes,
  cliente: clientRoutes,
  usuario: userRoutes,
};

export const getAllProtectedRoutes = (): RouteObject[] => {
  return Object.values(ROLE_ROUTES_MAP).flat();
};

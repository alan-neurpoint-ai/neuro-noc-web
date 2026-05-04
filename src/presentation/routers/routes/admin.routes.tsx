import { lazy } from "react";
import type { RouteObject } from "react-router";

const AdminLayout = lazy(() => import("../../pages/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("../../pages/Admin/AdminDashboard"));
const AdminUsers = lazy(() => import("../../pages/Admin/sections/AdminUsers"));
const AdminContacts = lazy(
  () => import("../../pages/Admin/sections/AdminContacts"),
);
const AdminContactDetail = lazy(
  () => import("../../pages/Admin/components/Contacts/AdminContactDetail"),
);
const AdminAlerts = lazy(
  () => import("../../pages/Admin/sections/AdminAlerts"),
);
const AdminAlertDetail = lazy(
  () => import("../../pages/Admin/components/Alerts/AlertDetail"),
);
const AdminIAConfig = lazy(
  () => import("../../pages/Admin/sections/AdminIAConfig"),
);
const AdminDocs = lazy(() => import("../../pages/Admin/sections/AdminDocs"));
const AdminSettings = lazy(
  () => import("../../pages/Admin/sections/AdminSettings"),
);

export const adminRoutes: RouteObject[] = [
  {
    path: "/dashboard/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "usuarios", element: <AdminUsers /> },
      { path: "contactos", element: <AdminContacts /> },
      { path: "contactos/:contactId", element: <AdminContactDetail /> },
      { path: "alertas", element: <AdminAlerts /> },
      { path: "alertas/:alertId", element: <AdminAlertDetail /> },
      { path: "ia-config", element: <AdminIAConfig /> },
      { path: "docs", element: <AdminDocs /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
];

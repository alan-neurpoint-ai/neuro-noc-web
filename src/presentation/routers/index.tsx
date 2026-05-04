import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./ProtectedRoute";

const AdminLayout = lazy(() =>
  import("../pages/Admin/AdminLayout").then((module) => ({
    default: module.AdminLayout,
  })),
);

const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const SuperadminPage = lazy(() => import("../pages/Superadmin/SuperadminPage"));
const ClientsPage = lazy(
  () => import("../pages/Superadmin/clients/ClientsPage"),
);
const ClientEditPage = lazy(
  () => import("../pages/Superadmin/clients/edit/ClientEditPage"),
);
const ClientPage = lazy(() => import("../pages/Client/ClientPage"));
const UserPage = lazy(() => import("../pages/User/UserPage"));

const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard"));
const AdminContacts = lazy(
  () => import("../pages/Admin/sections/AdminContacts"),
);
const AdminUsers = lazy(() => import("../pages/Admin/sections/AdminUsers"));
const AdminAlerts = lazy(() => import("../pages/Admin/sections/AdminAlerts"));
const AdminAlertDetail = lazy(
  () => import("../pages/Admin/components/AlertDetail"),
);
const AdminIAConfig = lazy(
  () => import("../pages/Admin/sections/AdminIAConfig"),
);
const AdminDocs = lazy(() => import("../pages/Admin/sections/AdminDocs"));
const AdminSettings = lazy(
  () => import("../pages/Admin/sections/AdminSettings"),
);

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-accent animate-pulse">Cargando...</div>
  </div>
);

export default function Index() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/dashboard/super_admin"
            element={
              <ProtectedRoute>
                <SuperadminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/super_admin/clientes"
            element={
              <ProtectedRoute>
                <ClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/super_admin/clientes/:clientId/edit"
            element={
              <ProtectedRoute>
                <ClientEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="contactos" element={<AdminContacts />} />
            <Route path="alertas" element={<AdminAlerts />} />
            <Route path="alertas/:alertId" element={<AdminAlertDetail />} />
            <Route path="ia-config" element={<AdminIAConfig />} />
            <Route path="docs" element={<AdminDocs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route
            path="/dashboard/cliente"
            element={
              <ProtectedRoute>
                <ClientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/cliente/nodos"
            element={
              <ProtectedRoute>
                <ClientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/cliente/alertas"
            element={
              <ProtectedRoute>
                <ClientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/cliente/ia-config"
            element={
              <ProtectedRoute>
                <ClientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/cliente/docs"
            element={
              <ProtectedRoute>
                <ClientPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/usuario"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/usuario/alertas"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/usuario/docs"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

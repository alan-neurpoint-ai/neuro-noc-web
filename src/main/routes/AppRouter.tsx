import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ProtectedRoute } from "../../modules/auth/presentation/components/ProtectedRoute";
import { LoginPage } from "../../modules/auth/presentation/pages/LoginPage";
import { DashboardLayout } from "../../modules/dashboard/presentation/layouts/DashboardLayout";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

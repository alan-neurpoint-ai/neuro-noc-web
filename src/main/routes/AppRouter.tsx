import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ProtectedRoute } from '../../modules/auth/presentation/components/ProtectedRoute';
import LoginPage from '../../modules/auth/presentation/pages/LoginPage';
import { DashboardLayout } from '../../modules/dashboard/presentation/layouts/DashboardLayout';
import { DashboardPage } from '../../modules/dashboard/presentation/pages/DashboardPage';
import { OrganizationsPage } from '../../modules/organizations/presentation/pages/OrganizationsPage';
import { OrganizationDetailPage } from '../../modules/organizations/presentation/pages/OrganizationDetailPage';
import { ContactListPage } from '../../modules/contacts/presentation/pages/ContactListPage';
import { TemporalContextListPage } from '../../modules/contexts/presentation/pages/TemporalContextListPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/dashboard/organizations"
              element={<OrganizationsPage />}
            />
            <Route
              path="/dashboard/organizations/:id"
              element={<OrganizationDetailPage />}
            />
            <Route path="/dashboard/contacts" element={<ContactListPage />} />
            <Route path="/dashboard/temporal-contexts" element={<TemporalContextListPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

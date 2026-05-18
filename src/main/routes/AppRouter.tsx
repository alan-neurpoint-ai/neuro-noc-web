import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ProtectedRoute } from '../../modules/auth/presentation/components/ProtectedRoute';
import LoginPage from '../../modules/auth/presentation/pages/LoginPage';
import { DashboardLayout } from '../../modules/dashboard/presentation/layouts/DashboardLayout';
import { DashboardPage } from '../../modules/dashboard/presentation/pages/DashboardPage';
import { OrganizationsPage } from '../../modules/organizations/presentation/pages/OrganizationsPage';
import { OrganizationDetailPage } from '../../modules/organizations/presentation/pages/OrganizationDetailPage';
import { ContactListPage } from '../../modules/contacts/presentation/pages/ContactListPage';
import { TemporalContextListPage } from '../../modules/contexts/presentation/pages/TemporalContextListPage';
import { TemporalContextFormPage } from '../../modules/contexts/presentation/pages/TemporalContextFormPage';
import { BusinessRuleListPage } from '../../modules/rules/presentation/pages/BusinessRuleListPage';
import { BusinessRuleFormPage } from '../../modules/rules/presentation/pages/BusinessRuleFormPage';
import { TechnicalDocumentationListPage } from '../../modules/documentation/presentation/pages/TechnicalDocumentationListPage';
import { TechnicalDocumentationDetailPage } from '../../modules/documentation/presentation/pages/TechnicalDocumentationDetailPage';
import { AIConfigurationListPage } from '../../modules/ai/presentation/pages/AIConfigurationListPage';

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
            <Route path="/dashboard/temporal-contexts/create" element={<TemporalContextFormPage />} />
            <Route path="/dashboard/temporal-contexts/:id" element={<TemporalContextFormPage />} />
            <Route path="/dashboard/rules" element={<BusinessRuleListPage />} />
            <Route path="/dashboard/rules/create" element={<BusinessRuleFormPage />} />
            <Route path="/dashboard/rules/:id" element={<BusinessRuleFormPage />} />
            <Route path="/dashboard/documentation" element={<TechnicalDocumentationListPage />} />
            <Route path="/dashboard/documentation/:id" element={<TechnicalDocumentationDetailPage />} />
            <Route path="/dashboard/ai-config" element={<AIConfigurationListPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

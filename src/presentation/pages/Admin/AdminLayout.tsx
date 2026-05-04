import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Sidebar, Topbar } from "../../components/ui";
import { useAuthStore } from "../../store/AuthStore";
import { useUserData } from "../../hooks/useUserData";
import { useOrganizations } from "../../hooks/useOrganizations";

import type { Organization } from "../../components/ui/Topbar/Topbar";
import { SelectedClientProvider } from "./context/SelectedClientContext";

const AdminLayout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { userData, isLoading: isLoadingUser } = useUserData();
  const {
    organizations,
    currentOrg,
    isLoading: isLoadingOrgs,
    handleOrgChange,
  } = useOrganizations(userData?.id);
  const [selectedClient, setSelectedClient] = useState<Organization | null>(
    currentOrg,
  );

  useEffect(() => {
    if (currentOrg) {
      setSelectedClient(currentOrg);
    }
  }, [currentOrg]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleClientChange = (org: Organization) => {
    setSelectedClient(org);
    handleOrgChange(org);
  };

  if (isLoadingUser || isLoadingOrgs) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar user={userData} onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-accent animate-pulse">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-linear-to-br from-background via-background to-accent/5">
      <Sidebar user={userData} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar
          organizations={organizations}
          currentOrg={selectedClient || organizations[0]}
          onOrgChange={handleClientChange}
        />

        <SelectedClientProvider selectedClient={selectedClient}>
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-8">
              <Outlet />
            </div>
          </div>
        </SelectedClientProvider>
      </div>
    </div>
  );
};

export default AdminLayout;

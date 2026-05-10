import { Outlet, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Sidebar } from "../../../../core/presentation/components/ui/Sidebar";
import { Topbar } from "../../../../core/presentation/components/ui/Topbar";
import { useAuthStore } from "../../../auth/presentation/stores/useAuthStore";
import { authService } from "../../../auth/infrastructure/services/auth.service";
import { organizationService } from "../../../organizations/infrastructure/services/organization.service";
import { navigationService } from "../../../../core/services/navigation.service";
import { DashboardSummary } from "../components/DashboardSummary";
import type {
  RoleName,
  OrganizationOption,
} from "../../../../core/types/navigation/navigation.types";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const {
    user,
    logout: clearAuth,
    selectedOrganization,
    setSelectedOrganization,
  } = useAuthStore();
  const [activeNavId, setActiveNavId] = useState("dashboard");
  const [orgOptions, setOrgOptions] = useState<OrganizationOption[]>([]);

  const roleName = user?.role?.name as RoleName | undefined;
  const navItems = navigationService.getNavigationByRole(roleName);

  useEffect(() => {
    const loadOrganizations = async () => {
      if (!user?.organizationId) return;

      try {
        const currentOrgId = user.organizationId;
        const currentOrgName = user.organization?.name || "Interno";

        const childrenOrgs = await organizationService.getOrganizationsByParent(
          currentOrgId,
        );

        const options: OrganizationOption[] = [
          {
            value: currentOrgId,
            label: "Interno",
            description: currentOrgName,
          },
          ...childrenOrgs.map((org) => ({
            value: org.id,
            label: org.name,
            description: org.slug,
          })),
        ];

        setOrgOptions(options);

        if (!selectedOrganization) {
          setSelectedOrganization({
            id: currentOrgId,
            name: currentOrgName,
            slug: options[0].description,
            isInternal: true,
          });
        }
      } catch (error) {
        console.error("Error loading organizations:", error);
      }
    };

    loadOrganizations();
  }, [roleName, user, selectedOrganization, setSelectedOrganization]);

  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email?.split("@")[0] || "Usuario";

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
    clearAuth();
    navigate("/login");
  };

  const handleNavigate = (id: string, path: string) => {
    setActiveNavId(id);
    navigate(path);
  };

  const handleOrgChange = (value: string | number) => {
    const org = orgOptions.find((o) => o.value === value);
    if (org) {
      const isInterno = org.value === user?.organizationId;
      setSelectedOrganization({
        id: org.value,
        name: org.label,
        slug: org.description,
        isInternal: isInterno,
      });
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0f1e] text-white overflow-hidden">
      <Sidebar
        navItems={navItems}
        userName={userName}
        userRole={user?.role?.name || "user"}
        userCompany={user?.organization?.name || "NeuroNOC"}
        activeId={activeNavId}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          envOptions={orgOptions}
          currentEnv={selectedOrganization?.id}
          onEnvChange={handleOrgChange}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-[#0d1224]">
          <div className="max-w-7xl mx-auto space-y-6">
            <DashboardSummary />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

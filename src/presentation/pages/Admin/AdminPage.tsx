import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Sidebar, Topbar } from "../../components/ui";
import { useAuthStore } from "../../store/AuthStore";
import { useUserData } from "../../hooks/useUserData";
import { useOrganizations } from "../../hooks/useOrganizations";
import { useAdminAnalytics } from "../../hooks/useAdminAnalytics";
import { CustomLineChart } from "../../components/ui/LineChart/LineChart";
import { AdminHeader } from "./components/AdminHeader";
import { StatsGrid } from "./components/StatsGrid";

export default function AdminPage() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { userData, isLoading: isLoadingUser } = useUserData();
  const {
    organizations,
    currentOrg,
    isLoading: isLoadingOrgs,
    handleOrgChange,
  } = useOrganizations(userData?.id);
  const {
    analytics,
    isLoading: isLoadingAnalytics,
    fetchAnalytics,
  } = useAdminAnalytics();

  useEffect(() => {
    if (currentOrg) {
      fetchAnalytics(currentOrg.id, currentOrg.isInternal === true);
    }
  }, [currentOrg, fetchAnalytics]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isLoadingUser || isLoadingOrgs) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar user={userData} onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-accent animate-pulse">
            Cargando información del usuario...
          </div>
        </div>
      </div>
    );
  }

  const isInternal = currentOrg?.isInternal === true;
  const hasData = analytics.alertsOverTime.length > 0;

  return (
    <div className="flex h-screen  to-accent/5">
      <Sidebar user={userData} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar
          organizations={organizations}
          currentOrg={currentOrg || organizations[0]}
          onOrgChange={handleOrgChange}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            <AdminHeader currentOrg={currentOrg} isInternal={isInternal} />

            {hasData && (
              <div className="mb-8">
                <CustomLineChart
                  data={analytics.alertsOverTime.map((item) => ({
                    ...item,
                    alerts: item.value,
                  }))}
                  title="Evolución de Alertas"
                  subtitle={
                    isInternal
                      ? "Últimos 7 días - Todos los clientes"
                      : `Últimos 7 días - ${currentOrg?.name}`
                  }
                  dataKey="value"
                  color="#c5a059"
                />
              </div>
            )}

            <StatsGrid analytics={analytics} isLoading={isLoadingAnalytics} />
          </div>
        </div>
      </div>
    </div>
  );
}

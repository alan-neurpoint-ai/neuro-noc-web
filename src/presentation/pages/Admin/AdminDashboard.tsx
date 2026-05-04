import { useEffect } from "react";
import { useSelectedClient } from "./context/SelectedClientContext";
import { useAdminAnalytics } from "../../hooks/useAdminAnalytics";
import { CustomLineChart } from "../../components/ui/LineChart/LineChart";
import { AdminHeader } from "./components/AdminHeader";
import { StatsGrid } from "./components/StatsGrid";

export default function AdminDashboard() {
  const { selectedClient } = useSelectedClient();
  const { analytics, isLoading, fetchAnalytics } = useAdminAnalytics();

  useEffect(() => {
    if (selectedClient) {
      const isInternal = selectedClient.isInternal === true;
      fetchAnalytics(selectedClient.id, isInternal);
    }
  }, [selectedClient, fetchAnalytics]);

  const isInternal = selectedClient?.isInternal === true;
  const hasData = analytics.alertsOverTime.length > 0;

  return (
    <div>
      <AdminHeader currentOrg={selectedClient} isInternal={isInternal} />

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
                : `Últimos 7 días - ${selectedClient?.name}`
            }
            dataKey="value"
            color="#c5a059"
          />
        </div>
      )}

      <StatsGrid analytics={analytics} isLoading={isLoading} />
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../core/supabase";
import { LineChart, type DataPoint } from "../../../../core/presentation/components/ui/LineChart";
import { Card } from "../../../../core/presentation/components/ui/Card";
import { useAuthStore } from "../../../auth/presentation/stores/useAuthStore";
import { alertService } from "../../../monitoring/infrastructure/services/alert.service";

interface AlertMetrics {
  totalAlerts: number;
  criticalRate: number;
  resolvedAlerts: number;
  pendingAlerts: number;
  emailsSent: number;
  callsMade: number;
}

export const DashboardSummary = () => {
  const { selectedOrganization, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [alertsData, setAlertsData] = useState<{
    date: string;
    total: number;
    critical: number;
    warning: number;
    resolved: number;
  }[]>([]);
  const [metrics, setMetrics] = useState<AlertMetrics>({
    totalAlerts: 0,
    criticalRate: 0,
    resolvedAlerts: 0,
    pendingAlerts: 0,
    emailsSent: 0,
    callsMade: 0,
  });

  const isInternal = selectedOrganization?.isInternal;
  const currentOrgId = user?.organizationId;

  useEffect(() => {
    if (!selectedOrganization || !selectedOrganization.id || !currentOrgId) {
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setLoadingMetrics(true);
      try {
        const includeChildren = Boolean(isInternal && currentOrgId === selectedOrganization.id);
        const childrenIds: string[] = [];

        if (includeChildren) {
          const { data: children } = await supabase
            .from("organizations")
            .select("id")
            .eq("parent_organization_id", currentOrgId)
            .eq("is_active", true);

          if (children && children.length > 0) {
            childrenIds.push(...children.map((c: { id: string }) => c.id));
          }
        }

        const [alertsResult, metricsResult] = await Promise.all([
          alertService.getAlertsGroupedByWeek(
            selectedOrganization.id,
            includeChildren,
            childrenIds,
          ),
          alertService.getAlertMetrics(
            selectedOrganization.id,
            includeChildren,
            childrenIds,
          ),
        ]);

        setAlertsData(alertsResult);
        setMetrics(metricsResult);
      } catch (error) {
        console.error("Error loading data:", error);
        setAlertsData([]);
        setMetrics({
          totalAlerts: 0,
          criticalRate: 0,
          resolvedAlerts: 0,
          pendingAlerts: 0,
          emailsSent: 0,
          callsMade: 0,
        });
      } finally {
        setLoading(false);
        setLoadingMetrics(false);
      }
    };

    loadData();
  }, [selectedOrganization, isInternal, currentOrgId]);

  const chartData: DataPoint[] = useMemo(() => {
    return alertsData.map((d) => ({
      value: d.total,
      label: new Date(d.date).toLocaleDateString("es-ES", {
        weekday: "short",
        day: "numeric",
      }),
    }));
  }, [alertsData]);

  if (!selectedOrganization) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent" />
      </div>
    );
  }

  const viewLabel = isInternal
    ? "Vista Consolidada (Interno)"
    : selectedOrganization.name || "Organización";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-headline font-bold text-white">
            Alertas - Últimas 4 semanas
          </h2>
          <p className="text-xs text-white/50">{viewLabel}</p>
        </div>
      </div>

      {!loadingMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card variant="glass" className="p-3">
            <p className="text-[10px] font-headline text-white/40 uppercase">Total Alerts</p>
            <p className="text-xl font-bold text-white mt-1">{metrics.totalAlerts}</p>
          </Card>

          <Card variant="glass" className="p-3">
            <p className="text-[10px] font-headline text-white/40 uppercase">Tasa Crítica</p>
            <p className="text-xl font-bold text-red-400 mt-1">{metrics.criticalRate}%</p>
          </Card>

          <Card variant="glass" className="p-3">
            <p className="text-[10px] font-headline text-white/40 uppercase">Resueltas</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">{metrics.resolvedAlerts}</p>
          </Card>

          <Card variant="glass" className="p-3">
            <p className="text-[10px] font-headline text-white/40 uppercase">Pendientes</p>
            <p className="text-xl font-bold text-amber-400 mt-1">{metrics.pendingAlerts}</p>
          </Card>

          <Card variant="glass" className="p-3">
            <p className="text-[10px] font-headline text-white/40 uppercase">Correos</p>
            <p className="text-xl font-bold text-blue-400 mt-1">{metrics.emailsSent}</p>
          </Card>

          <Card variant="glass" className="p-3">
            <p className="text-[10px] font-headline text-white/40 uppercase">Llamadas</p>
            <p className="text-xl font-bold text-purple-400 mt-1">{metrics.callsMade}</p>
          </Card>
        </div>
      )}

      {chartData.length > 0 && chartData.some((d) => d.value > 0) ? (
        <div className="h-[120px]">
          <LineChart
            data={chartData}
            height={120}
            title="Alertas"
            subtitle="Total semanal"
            unit=""
            showDelta={false}
          />
        </div>
      ) : (
        <div className="h-[120px] flex items-center justify-center rounded-2xl bg-white/5 border border-white/10">
          <p className="text-white/40 text-sm">Sin alertas en las últimas 4 semanas</p>
        </div>
      )}
    </div>
  );
};
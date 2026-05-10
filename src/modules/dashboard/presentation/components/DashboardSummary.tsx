import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../core/supabase";
import { LineChart, type DataPoint } from "../../../../core/presentation/components/ui/LineChart";
import { useAuthStore } from "../../../auth/presentation/stores/useAuthStore";
import { alertService } from "../../../monitoring/infrastructure/services/alert.service";

export const DashboardSummary = () => {
  const { selectedOrganization, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [alertsData, setAlertsData] = useState<{
    date: string;
    total: number;
    critical: number;
    warning: number;
    resolved: number;
  }[]>([]);

  const isInternal = selectedOrganization?.isInternal;
  const currentOrgId = user?.organizationId;

  useEffect(() => {
    if (!selectedOrganization || !selectedOrganization.id || !currentOrgId) {
      return;
    }

    const loadAlerts = async () => {
      setLoading(true);
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

        const data = await alertService.getAlertsGroupedByWeek(
          selectedOrganization.id,
          includeChildren,
          childrenIds,
        );

        setAlertsData(data);
      } catch (error) {
        console.error("Error loading alerts:", error);
        setAlertsData([]);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
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

  const totalAlerts = useMemo(
    () => alertsData.reduce((acc, d) => acc + d.total, 0),
    [alertsData],
  );

  const criticalCount = useMemo(
    () => alertsData.reduce((acc, d) => acc + d.critical, 0),
    [alertsData],
  );

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-headline font-bold text-white">
            Alertas - Últimas 4 semanas
          </h2>
          <p className="text-xs text-white/50">{viewLabel}</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Críticas: {criticalCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Total: {totalAlerts}
          </span>
        </div>
      </div>

      {chartData.length > 0 && chartData.some((d) => d.value > 0) ? (
        <div className="h-[120px]">
          <LineChart
            data={chartData}
            height={120}
            title="Alertas"
            subtitle="Total diario"
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
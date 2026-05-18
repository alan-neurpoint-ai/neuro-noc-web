import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../../core/supabase';
import {
  LineChart,
  type DataPoint,
} from '../../../../core/presentation/components/ui/LineChart';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { DataTable } from '../../../../core/presentation/components/ui/DataTable';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { alertService } from '../../../monitoring/infrastructure/services/alert.service';
import { Loading } from '../../../../core/presentation/components/ui/Loading';

interface AlertMetrics {
  totalAlerts: number;
  criticalRate: number;
  resolvedAlerts: number;
  pendingAlerts: number;
  emailsSent: number;
  callsMade: number;
}

interface RecentAlert {
  id: string;
  host_name: string;
  issue: string;
  criticality: string;
  status: string;
  created_at: string;
  organization_id: string;
  organization_name?: string;
}

export const DashboardSummary = () => {
  const { selectedOrganization, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [alertsData, setAlertsData] = useState<
    {
      date: string;
      total: number;
      critical: number;
      warning: number;
      resolved: number;
    }[]
  >([]);
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([]);
  const [hasOrgChildren, setHasOrgChildren] = useState(false);
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
  const showOrganizationColumn = isInternal && hasOrgChildren;

  useEffect(() => {
    if (!selectedOrganization || !selectedOrganization.id || !currentOrgId) {
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setLoadingMetrics(true);
      try {
        const includeChildren = Boolean(
          isInternal && currentOrgId === selectedOrganization.id
        );
        const childrenIds: string[] = [];
        let allOrgIds: string[] = [];

        if (includeChildren) {
          const { data: children } = await supabase
            .from('organizations')
            .select('id, name')
            .eq('parent_organization_id', currentOrgId)
            .eq('is_active', true);

          const hasChildrenData = Boolean(children && children.length > 0);
          setHasOrgChildren(hasChildrenData);

          if (hasChildrenData && children) {
            childrenIds.push(...children.map((c: { id: string }) => c.id));
            allOrgIds = [currentOrgId, ...childrenIds];
          }
        } else {
          setHasOrgChildren(false);
        }

        const [alertsResult, metricsResult, recentResult] = await Promise.all([
          alertService.getAlertsGroupedByWeek(
            selectedOrganization.id,
            includeChildren,
            childrenIds
          ),
          alertService.getAlertMetrics(
            selectedOrganization.id,
            includeChildren,
            childrenIds
          ),
          alertService.getRecentAlerts(
            selectedOrganization.id,
            includeChildren,
            childrenIds,
            10
          ),
        ]);

        let alertsWithOrg = recentResult;
        if (allOrgIds.length > 1) {
          const { data: orgsData } = await supabase
            .from('organizations')
            .select('id, name')
            .in('id', allOrgIds);

          const orgMap = new Map(
            (orgsData || []).map((o: { id: string; name: string }) => [
              o.id,
              o.name,
            ])
          );
          alertsWithOrg = recentResult.map((a) => ({
            ...a,
            organization_name: orgMap.get(a.organization_id),
          }));
        }

        setAlertsData(alertsResult);
        setMetrics(metricsResult);
        setRecentAlerts(alertsWithOrg as RecentAlert[]);
      } catch (error) {
        console.error('Error loading data:', error);
        setAlertsData([]);
        setMetrics({
          totalAlerts: 0,
          criticalRate: 0,
          resolvedAlerts: 0,
          pendingAlerts: 0,
          emailsSent: 0,
          callsMade: 0,
        });
        setRecentAlerts([]);
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
      label: new Date(d.date).toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
      }),
    }));
  }, [alertsData]);

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'High':
        return 'text-red-400 bg-red-400/10';
      case 'Average':
        return 'text-amber-400 bg-amber-400/10';
      case 'Low':
        return 'text-blue-400 bg-blue-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROBLEM':
        return 'text-red-400';
      case 'RESOLVED':
        return 'text-emerald-400';
      case 'ACKNOWLEDGED':
        return 'text-amber-400';
      default:
        return 'text-gray-400';
    }
  };

  if (!selectedOrganization) {
    return null;
  }

  if (loading) {
    return (
      <Loading message="Cargando datos del dashboard..." variant="fullscreen" />
    );
  }

  const viewLabel = isInternal
    ? 'Vista Consolidada (Interno)'
    : selectedOrganization.name || 'Organización';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-base font-headline font-bold text-white">
            Alertas - Últimas 4 semanas
          </h2>
          <p className="text-xs text-white/50">{viewLabel}</p>
        </div>
      </div>

      <div className="space-y-2 mb-10">
        <h3 className="text-xs font-headline text-white/40 uppercase">
          Métricas
        </h3>
        {!loadingMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Card variant="glass" className="p-3">
              <p className="text-[10px] font-headline text-white/40 uppercase">
                Total Alerts
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {metrics.totalAlerts}
              </p>
            </Card>

            <Card variant="glass" className="p-3">
              <p className="text-[10px] font-headline text-white/40 uppercase">
                Tasa Crítica
              </p>
              <p className="text-xl font-bold text-red-400 mt-1">
                {metrics.criticalRate}%
              </p>
            </Card>

            <Card variant="glass" className="p-3">
              <p className="text-[10px] font-headline text-white/40 uppercase">
                Resueltas
              </p>
              <p className="text-xl font-bold text-emerald-400 mt-1">
                {metrics.resolvedAlerts}
              </p>
            </Card>

            <Card variant="glass" className="p-3">
              <p className="text-[10px] font-headline text-white/40 uppercase">
                Pendientes
              </p>
              <p className="text-xl font-bold text-amber-400 mt-1">
                {metrics.pendingAlerts}
              </p>
            </Card>

            <Card variant="glass" className="p-3">
              <p className="text-[10px] font-headline text-white/40 uppercase">
                Correos
              </p>
              <p className="text-xl font-bold text-blue-400 mt-1">
                {metrics.emailsSent}
              </p>
            </Card>

            <Card variant="glass" className="p-3">
              <p className="text-[10px] font-headline text-white/40 uppercase">
                Llamadas
              </p>
              <p className="text-xl font-bold text-purple-400 mt-1">
                {metrics.callsMade}
              </p>
            </Card>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-10">
        {chartData.length > 0 && chartData.some((d) => d.value > 0) ? (
          <div>
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
          <div className="h-30 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/40 text-sm">
              Sin alertas en las últimas 4 semanas
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-10">
        <DataTable
          title="Alertas Recientes"
          subtitle={`${recentAlerts.length} últimas alertas`}
          columns={[
            {
              header: 'Dispositivo',
              accessor: (alert: RecentAlert) => (
                <div>
                  <div className="text-white font-medium">
                    {alert.host_name}
                  </div>
                  <div className="text-white/40 text-[10px] truncate max-w-50">
                    {alert.issue}
                  </div>
                </div>
              ),
            },
            {
              header: 'Criticidad',
              accessor: (alert: RecentAlert) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getCriticalityColor(alert.criticality)}`}
                >
                  {alert.criticality}
                </span>
              ),
            },
            {
              header: 'Fecha',
              accessor: (alert: RecentAlert) => (
                <span className="text-white/60">
                  {new Date(alert.created_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              ),
            },
            ...(showOrganizationColumn
              ? [
                  {
                    header: 'Organización',
                    accessor: (alert: RecentAlert) => (
                      <span className="text-white/60">
                        {alert.organization_name || '-'}
                      </span>
                    ),
                  },
                ]
              : []),
            {
              header: 'Estado',
              accessor: (alert: RecentAlert) => (
                <span className={`font-medium ${getStatusColor(alert.status)}`}>
                  {alert.status}
                </span>
              ),
            },
          ]}
          data={recentAlerts}
        />
      </div>
    </div>
  );
};

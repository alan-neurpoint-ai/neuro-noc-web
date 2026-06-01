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
import {
  BiBell,
  BiError,
  BiCheckCircle,
  BiTime,
  BiEnvelope,
  BiPhone,
} from 'react-icons/bi';

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
        return 'text-text-muted bg-gray-400/10';
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
        return 'text-text-muted';
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

  const hasCharts = chartData.length > 0 && chartData.some((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-black text-text-main tracking-tighter uppercase">
            Panel de Monitoreo
          </h1>
          <p className="text-sm text-text-muted font-headline mt-0.5">
            Resumen general de alertas y métricas del sistema
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated/50 border border-border-subtle/50">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
          <span className="text-[10px] font-bold text-text-muted tracking-wide">
            {viewLabel}
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            label: 'Total Alertas',
            value: metrics.totalAlerts,
            icon: <BiBell size={18} />,
            accent: '#6366f1',
          },
          {
            label: 'Tasa Crítica',
            value: `${metrics.criticalRate}%`,
            icon: <BiError size={18} />,
            accent: '#f87171',
          },
          {
            label: 'Resueltas',
            value: metrics.resolvedAlerts,
            icon: <BiCheckCircle size={18} />,
            accent: '#34d399',
          },
          {
            label: 'Pendientes',
            value: metrics.pendingAlerts,
            icon: <BiTime size={18} />,
            accent: '#fbbf24',
          },
          {
            label: 'Correos',
            value: metrics.emailsSent,
            icon: <BiEnvelope size={18} />,
            accent: '#60a5fa',
          },
          {
            label: 'Llamadas',
            value: metrics.callsMade,
            icon: <BiPhone size={18} />,
            accent: '#b29af4',
          },
        ].map((card, i) => (
          <Card key={i} variant="glass" className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted">
                  {card.label}
                </p>
                <p className="text-2xl font-black font-mono tracking-tight text-text-main">
                  {card.value}
                </p>
              </div>
              <div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: `${card.accent}15`, color: card.accent }}
              >
                {card.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Line Chart */}
      {hasCharts ? (
        <LineChart
          data={chartData}
          height={140}
          title="Tendencia Semanal"
          subtitle="Alertas por semana"
          unit=""
          showDelta={true}
        />
      ) : (
        <Card variant="glass" className="p-6 flex items-center justify-center h-40">
          <p className="text-text-muted text-sm">
            Sin alertas en las últimas 4 semanas
          </p>
        </Card>
      )}

      {/* Recent Alerts Table */}
      <DataTable
        title="Alertas Recientes"
        subtitle={`${recentAlerts.length} últimas alertas registradas en el sistema`}
        columns={[
          {
            header: 'Dispositivo',
            accessor: (alert: RecentAlert) => (
              <div>
                <div className="text-text-main font-medium">
                  {alert.host_name}
                </div>
                <div className="text-text-muted text-[10px] truncate max-w-50">
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
              <span className="text-text-muted">
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
                    <span className="text-text-muted">
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
  );
};

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../../core/supabase';
import {
  LineChart,
  type DataPoint,
} from '../../../../core/presentation/components/ui/LineChart';
import { DonutChart } from '../../../../core/presentation/components/ui/DonutChart';
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
  BiTrendingUp,
  BiTrendingDown,
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

interface MetricCardConfig {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  accent: string;
  gradient: string;
}

function MetricCard({ label, value, icon, trend, accent, gradient }: MetricCardConfig) {
  return (
    <Card variant="glass" className="p-4 relative overflow-hidden group">
      <div className={`absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 ${gradient}`} />
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted">
            {label}
          </p>
          <p className="text-2xl font-black font-mono tracking-tight text-text-main">
            {value}
          </p>
          {trend && (
            <div
              className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                trend.positive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {trend.positive ? (
                <BiTrendingUp size={12} />
              ) : (
                <BiTrendingDown size={12} />
              )}
              {trend.value}
            </div>
          )}
        </div>
        <div
          className="p-2.5 rounded-xl transition-colors"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

function WeeklyBarChart({
  data,
}: {
  data: { label: string; total: number; critical: number }[];
}) {
  const maxValue = Math.max(...data.map((d) => d.total), 1);

  return (
    <Card variant="glass" className="p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary">
          <BiBell size={16} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">
            Comparativa Semanal
          </p>
          <p className="text-[11px] text-text-muted">
            Volumen de alertas por semana
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 h-36 px-2">
        {data.map((item, i) => {
          const height = (item.total / maxValue) * 100;
          const critHeight = (item.critical / maxValue) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="relative w-full max-w-10 h-full flex flex-col justify-end">
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${Math.max(critHeight, 0.5)}%`,
                    backgroundColor: '#f87171',
                    opacity: 0.9,
                  }}
                />
                <div
                  className="w-full rounded-t-md -mt-0.5 transition-all duration-500"
                  style={{
                    height: `${Math.max(height - critHeight, 0.5)}%`,
                    backgroundColor: '#6366f1',
                    opacity: 0.6,
                  }}
                />
              </div>
              <span className="text-[8px] font-bold font-mono text-text-muted uppercase tracking-tight">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-border-subtle">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-[#6366f1]/60" />
          <span className="text-[9px] text-text-muted">Advertencia</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-400/80" />
          <span className="text-[9px] text-text-muted">Crítica</span>
        </div>
      </div>
    </Card>
  );
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

  const criticalityData = useMemo(() => {
    const totalCritical = alertsData.reduce((sum, w) => sum + w.critical, 0);
    const totalWarning = alertsData.reduce((sum, w) => sum + w.warning, 0);
    const totalResolved = alertsData.reduce((sum, w) => sum + w.resolved, 0);
    const total = totalCritical + totalWarning + totalResolved;
    if (total === 0) return [];
    return [
      { label: 'Críticas', value: totalCritical, color: '#f87171' },
      { label: 'Advertencia', value: totalWarning, color: '#fbbf24' },
      { label: 'Resueltas', value: totalResolved, color: '#34d399' },
    ];
  }, [alertsData]);

  const weeklyBarData = useMemo(() => {
    return alertsData.map((d) => ({
      label: new Date(d.date).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
      }),
      total: d.total,
      critical: d.critical,
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

  const metricCards: MetricCardConfig[] = [
    {
      label: 'Total Alertas',
      value: metrics.totalAlerts,
      icon: <BiBell size={18} />,
      accent: '#6366f1',
      gradient: 'bg-gradient-to-br from-brand-primary to-transparent',
    },
    {
      label: 'Tasa Crítica',
      value: `${metrics.criticalRate}%`,
      icon: <BiError size={18} />,
      accent: '#f87171',
      gradient: 'bg-gradient-to-br from-red-500 to-transparent',
      trend: { value: '12% vs periodo anterior', positive: false },
    },
    {
      label: 'Resueltas',
      value: metrics.resolvedAlerts,
      icon: <BiCheckCircle size={18} />,
      accent: '#34d399',
      gradient: 'bg-gradient-to-br from-emerald-500 to-transparent',
    },
    {
      label: 'Pendientes',
      value: metrics.pendingAlerts,
      icon: <BiTime size={18} />,
      accent: '#fbbf24',
      gradient: 'bg-gradient-to-br from-amber-500 to-transparent',
    },
    {
      label: 'Correos',
      value: metrics.emailsSent,
      icon: <BiEnvelope size={18} />,
      accent: '#60a5fa',
      gradient: 'bg-gradient-to-br from-blue-500 to-transparent',
    },
    {
      label: 'Llamadas',
      value: metrics.callsMade,
      icon: <BiPhone size={18} />,
      accent: '#b29af4',
      gradient: 'bg-gradient-to-br from-purple-500 to-transparent',
    },
  ];

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
        {metricCards.map((card, i) => (
          <MetricCard key={i} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line Chart */}
        <div className={hasCharts ? '' : 'hidden'}>
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
        </div>

        {/* Donut Chart */}
        {criticalityData.length > 0 ? (
          <DonutChart
            data={criticalityData}
            size={170}
            thickness={20}
            title="Distribución por Criticidad"
            unit=""
          />
        ) : (
          <Card variant="glass" className="p-6 flex items-center justify-center h-40">
            <p className="text-text-muted text-sm">Sin datos de criticidad</p>
          </Card>
        )}
      </div>

      {/* Weekly Bar Chart */}
      {weeklyBarData.length > 0 && <WeeklyBarChart data={weeklyBarData} />}

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

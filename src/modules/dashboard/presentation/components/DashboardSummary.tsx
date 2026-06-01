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

interface BarItem {
  label: string;
  total: number;
  critical: number;
}

function VerticalBarChart({ data }: { data: BarItem[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-4" style={{ height: 140 }}>
        {data.map((item, i) => {
          const totalH = (item.total / maxVal) * 100;
          const critH = (item.critical / maxVal) * 100;
          const warningH = totalH - critH > 0 ? totalH - critH : 0;
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center h-full justify-end relative group"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {isHovered && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-bg-elevated border border-border-default shadow-lg z-10 whitespace-nowrap">
                  <span className="text-[10px] font-mono font-bold text-text-main">
                    {item.total}
                  </span>
                  <span className="text-[9px] text-text-muted ml-1">total</span>
                </div>
              )}
              <div className="w-full max-w-[48px] flex flex-col justify-end h-full relative rounded-t-md overflow-hidden">
                <div
                  className="w-full rounded-t-md transition-all duration-500 ease-out"
                  style={{
                    height: `${Math.max(warningH, 0.5)}%`,
                    backgroundColor: '#818cf8',
                    opacity: 0.7,
                  }}
                />
                <div
                  className="w-full transition-all duration-500 ease-out"
                  style={{
                    height: `${Math.max(critH, 0.5)}%`,
                    backgroundColor: '#f87171',
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-3">
        {data.map((item, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[9px] font-mono font-bold text-text-muted uppercase tracking-tight">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RingSegment {
  label: string;
  value: number;
  color: string;
}

function RingChart({ data, title }: { data: RingSegment[]; title: string }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) return null;

  const segments = data.map((d, i) => {
    const pct = d.value / total;
    const offset = data.slice(0, i).reduce((s, prev) => s + prev.value / total, 0);
    return {
      ...d,
      pct: (pct * 100).toFixed(1),
      dasharray: `${pct * 100} ${100 - pct * 100}`,
      dashoffset: -offset * 100,
    };
  });

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-44 h-44">
        <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={seg.color}
              strokeWidth={activeIdx === i ? 4.5 : 3.5}
              strokeDasharray={seg.dasharray}
              strokeDashoffset={seg.dashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            />
          ))}
          <circle cx="21" cy="21" r="12.5" fill="var(--bg-card)" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">
            {activeIdx !== null ? segments[activeIdx].label : 'Total'}
          </span>
          <span className="text-xl font-black font-mono text-text-main mt-0.5">
            {activeIdx !== null ? `${segments[activeIdx].pct}%` : total}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-4">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 cursor-pointer transition-opacity"
            style={{ opacity: activeIdx !== null && activeIdx !== i ? 0.4 : 1 }}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[10px] font-medium text-text-muted">
              {seg.label}
            </span>
            <span className="text-[10px] font-mono font-bold text-text-main">
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
  bar,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bar?: { pct: number; color: string };
}) {
  return (
    <Card variant="glass" className="p-4 group relative overflow-hidden">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted mb-1.5">
            {label}
          </p>
          <p className="text-2xl font-black font-mono tracking-tight text-text-main">
            {value}
          </p>
        </div>
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}12`, color }}
        >
          {icon}
        </div>
      </div>
      {bar && (
        <div className="w-full h-1.5 rounded-full bg-bg-elevated/80 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(bar.pct, 100)}%`, backgroundColor: bar.color }}
          />
        </div>
      )}
    </Card>
  );
}

export const DashboardSummary = () => {
  const { selectedOrganization, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [alertsData, setAlertsData] = useState<
    { date: string; total: number; critical: number; warning: number; resolved: number }[]
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
    if (!selectedOrganization || !selectedOrganization.id || !currentOrgId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const includeChildren = Boolean(isInternal && currentOrgId === selectedOrganization.id);
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
          alertService.getAlertsGroupedByWeek(selectedOrganization.id, includeChildren, childrenIds),
          alertService.getAlertMetrics(selectedOrganization.id, includeChildren, childrenIds),
          alertService.getRecentAlerts(selectedOrganization.id, includeChildren, childrenIds, 10),
        ]);

        let alertsWithOrg = recentResult;
        if (allOrgIds.length > 1) {
          const { data: orgsData } = await supabase
            .from('organizations')
            .select('id, name')
            .in('id', allOrgIds);

          const orgMap = new Map(
            (orgsData || []).map((o: { id: string; name: string }) => [o.id, o.name])
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
        setMetrics({ totalAlerts: 0, criticalRate: 0, resolvedAlerts: 0, pendingAlerts: 0, emailsSent: 0, callsMade: 0 });
        setRecentAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedOrganization, isInternal, currentOrgId]);

  const chartData: DataPoint[] = useMemo(
    () =>
      alertsData.map((d) => ({
        value: d.total,
        label: new Date(d.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      })),
    [alertsData]
  );

  const barData = useMemo(
    () =>
      alertsData.map((d) => ({
        label: new Date(d.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        total: d.total,
        critical: d.critical,
      })),
    [alertsData]
  );

  const criticalityRing = useMemo(() => {
    const totalCritical = alertsData.reduce((s, w) => s + w.critical, 0);
    const totalWarning = alertsData.reduce((s, w) => s + w.warning, 0);
    const totalResolved = alertsData.reduce((s, w) => s + w.resolved, 0);
    return [
      { label: 'Críticas', value: totalCritical, color: '#f87171' },
      { label: 'Advertencia', value: totalWarning, color: '#fbbf24' },
      { label: 'Resueltas', value: totalResolved, color: '#34d399' },
    ];
  }, [alertsData]);

  const getCriticalityColor = (c: string) => {
    switch (c) {
      case 'High': return 'text-red-400 bg-red-400/10';
      case 'Average': return 'text-amber-400 bg-amber-400/10';
      case 'Low': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-text-muted bg-gray-400/10';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'PROBLEM': return 'text-red-400';
      case 'RESOLVED': return 'text-emerald-400';
      case 'ACKNOWLEDGED': return 'text-amber-400';
      default: return 'text-text-muted';
    }
  };

  if (!selectedOrganization) return null;

  if (loading) {
    return <Loading message="Cargando datos del dashboard..." variant="fullscreen" />;
  }

  const viewLabel = isInternal ? 'Vista Consolidada' : selectedOrganization.name || 'Organización';
  const hasCharts = chartData.length > 0 && chartData.some((d) => d.value > 0);
  const resolveRate = metrics.totalAlerts > 0 ? Math.round((metrics.resolvedAlerts / metrics.totalAlerts) * 100) : 0;

  return (
    <div className="space-y-5">
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
        <MetricCard label="Total Alertas" value={metrics.totalAlerts} icon={<BiBell size={16} />} color="#6366f1" />
        <MetricCard label="Tasa Crítica" value={`${metrics.criticalRate}%`} icon={<BiError size={16} />} color="#f87171"
          bar={{ pct: metrics.criticalRate, color: '#f87171' }} />
        <MetricCard label="Resueltas" value={metrics.resolvedAlerts} icon={<BiCheckCircle size={16} />} color="#34d399"
          bar={{ pct: resolveRate, color: '#34d399' }} />
        <MetricCard label="Pendientes" value={metrics.pendingAlerts} icon={<BiTime size={16} />} color="#fbbf24"
          bar={{ pct: metrics.totalAlerts > 0 ? (metrics.pendingAlerts / metrics.totalAlerts) * 100 : 0, color: '#fbbf24' }} />
        <MetricCard label="Correos" value={metrics.emailsSent} icon={<BiEnvelope size={16} />} color="#60a5fa" />
        <MetricCard label="Llamadas" value={metrics.callsMade} icon={<BiPhone size={16} />} color="#b29af4" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line Chart */}
        <div className={hasCharts ? 'lg:col-span-2' : 'lg:col-span-2'}>
          {hasCharts ? (
            <LineChart
              data={chartData}
              height={140}
              title="Tendencia Semanal"
              subtitle="Volumen de alertas por semana"
              unit=""
              showDelta={true}
            />
          ) : (
            <Card variant="glass" className="p-6 flex items-center justify-center h-40">
              <p className="text-text-muted text-sm">Sin alertas en las últimas 4 semanas</p>
            </Card>
          )}
        </div>

        {/* Ring Chart */}
        <div>
          <Card variant="glass" className="p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary">
                <BiError size={14} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">
                  Distribución
                </p>
                <p className="text-[11px] text-text-muted">Por criticidad</p>
              </div>
            </div>
            <RingChart data={criticalityRing} title="Criticidad" />
          </Card>
        </div>
      </div>

      {/* Vertical Bar Chart */}
      {barData.length > 0 && (
        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary">
                <BiBell size={14} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">
                  Comparativa Semanal
                </p>
                <p className="text-[11px] text-text-muted">Alertas críticas vs advertencia</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#818cf8]/70" />
                <span className="text-[9px] font-medium text-text-muted uppercase tracking-wider">Advertencia</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#f87171]/85" />
                <span className="text-[9px] font-medium text-text-muted uppercase tracking-wider">Crítica</span>
              </div>
            </div>
          </div>
          <VerticalBarChart data={barData} />
        </Card>
      )}

      {/* Recent Alerts Table */}
      <DataTable
        title="Alertas Recientes"
        subtitle={`${recentAlerts.length} últimas alertas registradas`}
        columns={[
          {
            header: 'Dispositivo',
            accessor: (alert: RecentAlert) => (
              <div>
                <div className="text-text-main font-medium">{alert.host_name}</div>
                <div className="text-text-muted text-[10px] truncate max-w-50">{alert.issue}</div>
              </div>
            ),
          },
          {
            header: 'Criticidad',
            accessor: (alert: RecentAlert) => (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getCriticalityColor(alert.criticality)}`}>
                {alert.criticality}
              </span>
            ),
          },
          {
            header: 'Fecha',
            accessor: (alert: RecentAlert) => (
              <span className="text-text-muted">
                {new Date(alert.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </span>
            ),
          },
          ...(showOrganizationColumn
            ? [{
                header: 'Organización',
                accessor: (alert: RecentAlert) => (
                  <span className="text-text-muted">{alert.organization_name || '-'}</span>
                ),
              }]
            : []),
          {
            header: 'Estado',
            accessor: (alert: RecentAlert) => (
              <span className={`font-medium ${getStatusColor(alert.status)}`}>{alert.status}</span>
            ),
          },
        ]}
        data={recentAlerts}
      />
    </div>
  );
};
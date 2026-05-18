import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  BiBarChart,
  BiPieChart,
  BiTable,
  BiError,
  BiCheckCircle,
  BiXCircle,
} from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { DataTable } from '../../../../core/presentation/components/ui/DataTable';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { AlertRow } from '../../../../core/types/monitoring/alerts.sql';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = [
  '#6366f1',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#14b8a6',
];

export const MonitoringAlertsPage = () => {
  const navigate = useNavigate();
  const { user, selectedOrganization } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);

  const targetOrgId = selectedOrganization?.id || user?.organizationId;

  // Función para obtener todas las organizaciones (padre + hijos)
  const getOrganizationIds = async (orgId: string): Promise<string[]> => {
    const ids = [orgId];

    // Obtener hijos directos
    const { data: children } = await supabase
      .from('organizations')
      .select('id')
      .eq('parent_organization_id', orgId)
      .eq('is_active', true);

    const childList = children as { id: string }[] | null;
    if (childList && childList.length > 0) {
      // Agregar los hijos
      const childIds = childList.map((c) => c.id);
      ids.push(...childIds);
    }

    return ids;
  };

  useEffect(() => {
    if (!targetOrgId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAlerts([]);
      setLoading(false);
      return;
    }

    const fetchAlerts = async () => {
      setLoading(true);
      try {
        // Obtener organizaciones (padre + hijos)
        const allOrgIds = await getOrganizationIds(targetOrgId);

        let query = supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false });

        // Si tiene hijos, filtrar por todas las orgs, si no solo por la padre
        if (allOrgIds.length > 1) {
          query = query.in('organization_id', allOrgIds);
        } else {
          query = query.eq('organization_id', targetOrgId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setAlerts((data as AlertRow[]) || []);
      } catch (error) {
        console.error('Error loading alerts:', error);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchAlerts();
  }, [targetOrgId]);

  // Obtener contactos más contactados desde alert_actions
  const getContactFrequency = async () => {
    if (!targetOrgId) return [];

    try {
      // Obtener organizaciones (mismo filtro que alertas)
      const allOrgIds = await getOrganizationIds(targetOrgId);

      // Obtener alerts de esas organizaciones
      const { data: alertsInOrg } = await supabase
        .from('alerts')
        .select('id')
        .in('organization_id', allOrgIds);

      const alertList = alertsInOrg as { id: string }[] | null;
      const alertIds = (alertList || []).map((a) => a.id);
      if (alertIds.length === 0) return [];

      // Obtener alert_actions de esas alertas con contact_id
      const { data: alertActions } = await supabase
        .from('alert_actions')
        .select('contact_id')
        .in('alert_id', alertIds)
        .not('contact_id', 'is', null);

      const actions = alertActions as { contact_id: string }[] | null;
      if (!actions || actions.length === 0) return [];

      // Contar ocurrencias por contact_id
      const contactCounts: Record<string, number> = {};
      actions.forEach((action: { contact_id: string }) => {
        if (action.contact_id) {
          contactCounts[action.contact_id] =
            (contactCounts[action.contact_id] || 0) + 1;
        }
      });

      // Obtener los nombres de los contactos
      const contactIds = Object.keys(contactCounts);
      if (contactIds.length === 0) return [];

      const { data: contacts } = await supabase
        .from('contacts')
        .select('id, full_name')
        .in('id', contactIds);

      const contactList = contacts as
        | { id: string; full_name: string }[]
        | null;
      // Mapear nombres
      const contactMap = new Map(
        (contactList || []).map((c) => [c.id, c.full_name])
      );

      return Object.entries(contactCounts)
        .map(([contactId, value]) => ({
          name: contactMap.get(contactId) || contactId.substring(0, 20),
          value,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
    } catch (error) {
      console.error('Error getting contact frequency:', error);
      return [];
    }
  };

  // Gráfico de barras - problemas más frecuentes
  const getIssueFrequency = () => {
    const issueCounts: Record<string, number> = {};
    alerts.forEach((alert) => {
      issueCounts[alert.issue] = (issueCounts[alert.issue] || 0) + 1;
    });

    return Object.entries(issueCounts)
      .map(([name, value]) => ({
        name: name.length > 25 ? name.substring(0, 25) + '...' : name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  const [contactFrequencyData, setContactFrequencyData] = useState<
    { name: string; value: number }[]
  >([]);
  const [contactLoading, setContactLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      setContactLoading(true);
      const data = await getContactFrequency();
      setContactFrequencyData(data);
      setContactLoading(false);
    };
    fetchContactData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetOrgId]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCriticalityBadge = (criticality: string) => {
    switch (criticality?.toLowerCase()) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
            Crítico
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase">
            Alto
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
            Medio
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
            Bajo
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/5 text-white/40 border border-white/10 uppercase">
            {criticality || '-'}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return (
          <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <BiCheckCircle /> Resuelto
          </span>
        );
      case 'active':
        return (
          <span className="flex items-center gap-1 text-amber-400 text-xs font-medium">
            <BiError /> Activo
          </span>
        );
      default:
        return <span className="text-white/40 text-xs">{status || '-'}</span>;
    }
  };

  const columns = [
    {
      header: 'Problema',
      accessor: (item: AlertRow) => (
        <div className="flex items-center gap-2">
          <BiError className="text-amber-400" />
          <span className="text-white font-medium">{item.issue}</span>
        </div>
      ),
    },
    {
      header: 'Host',
      accessor: 'host_name' as keyof AlertRow,
      className: 'text-white/60 font-mono text-xs',
    },
    {
      header: 'Criticidad',
      accessor: (item: AlertRow) => getCriticalityBadge(item.criticality),
    },
    {
      header: 'Estado',
      accessor: (item: AlertRow) => getStatusBadge(item.status),
    },
    {
      header: 'Fecha',
      accessor: (item: AlertRow) => (
        <span className="text-white/50 text-xs font-mono">
          {formatDate(item.created_at)}
        </span>
      ),
    },
  ];

  if (loading) {
    return <Loading message="Cargando alertas..." />;
  }

  return (
    <div className="space-y-6">
      <div className="px-2">
        <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
          Monitoreo de Alertas
        </h1>
        <p className="text-sm text-white/40 font-headline">
          Análisis de incidentes y contactos
        </p>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Problemas frecuentes */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BiBarChart className="text-brand-accent" />
            Problemas Más Frecuentes
          </h3>
          {alerts.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getIssueFrequency()}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={10}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={10}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-white/40">
              No hay datos para mostrar
            </div>
          )}
        </Card>

        {/* Gráfico de pastel - Contactos por frecuencia */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BiPieChart className="text-brand-accent" />
            Contactos Más Contactados
          </h3>
          {contactLoading ? (
            <div className="h-64 flex items-center justify-center text-white/40">
              Cargando...
            </div>
          ) : contactFrequencyData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contactFrequencyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {contactFrequencyData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-white/40">
              No hay datos para mostrar
            </div>
          )}
        </Card>
      </div>

      {/* Tabla de alertas */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BiTable className="text-brand-accent" />
          Todas las Alertas
          <span className="text-xs font-normal text-white/40 ml-2">
            ({alerts.length} registros)
          </span>
        </h3>

        {alerts.length > 0 ? (
          <DataTable
            columns={columns}
            data={alerts}
            isLoading={false}
            onRowClick={(alert) =>
              navigate(`/dashboard/monitoring-alerts/${alert.id}`)
            }
          />
        ) : (
          <div className="text-center py-12">
            <BiXCircle className="text-6xl text-white/10 mx-auto mb-4" />
            <p className="text-white/40">No hay alertas registradas</p>
          </div>
        )}
      </Card>
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { AlertRow } from '../../../../core/types/monitoring/alerts.sql';
import { IssueFrequencyChart } from '../components/IssueFrequencyChart';
import { ContactFrequencyChart } from '../components/ContactFrequencyChart';
import { AlertsTable } from '../components/AlertsTable';
import { useNotifications } from '../../../../core/hooks/useNotifications';

const POLL_INTERVAL_MS = 30000; // 30 segundos

export const MonitoringAlertsPage = () => {
  const navigate = useNavigate();
  const { user, selectedOrganization } = useAuthStore();
  const { sendNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const knownAlertIds = useRef<Set<string>>(new Set());
  const notificationsEnabled = user?.notificationsEnabled === true;
  const [contactFrequencyData, setContactFrequencyData] = useState<
    { name: string; value: number }[]
  >([]);
  const [contactLoading, setContactLoading] = useState(true);

  const targetOrgId = selectedOrganization?.id || user?.organizationId;

  const getOrganizationIds = async (orgId: string): Promise<string[]> => {
    const ids = [orgId];
    const { data: children } = await supabase
      .from('organizations')
      .select('id')
      .eq('parent_organization_id', orgId)
      .eq('is_active', true);
    const childList = children as { id: string }[] | null;
    if (childList && childList.length > 0) {
      ids.push(...childList.map((c) => c.id));
    }
    return ids;
  };

  const fetchAlerts = async () => {
    if (!targetOrgId) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const allOrgIds = await getOrganizationIds(targetOrgId);
      let query = supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

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

  const getContactFrequency = async () => {
    if (!targetOrgId) return [];

    try {
      const allOrgIds = await getOrganizationIds(targetOrgId);
      const { data: alertsInOrg } = await supabase
        .from('alerts')
        .select('id')
        .in('organization_id', allOrgIds);
      const alertList = alertsInOrg as { id: string }[] | null;
      const alertIds = (alertList || []).map((a) => a.id);
      if (alertIds.length === 0) return [];

      const { data: alertActions } = await supabase
        .from('alert_actions')
        .select('contact_id')
        .in('alert_id', alertIds)
        .not('contact_id', 'is', null);

      const actions = alertActions as { contact_id: string }[] | null;
      if (!actions || actions.length === 0) return [];

      const contactCounts: Record<string, number> = {};
      actions.forEach((action: { contact_id: string }) => {
        if (action.contact_id) {
          contactCounts[action.contact_id] =
            (contactCounts[action.contact_id] || 0) + 1;
        }
      });

      const contactIds = Object.keys(contactCounts);
      if (contactIds.length === 0) return [];

      const { data: contacts } = await supabase
        .from('contacts')
        .select('id, full_name')
        .in('id', contactIds);
      const contactList = contacts as
        | { id: string; full_name: string }[]
        | null;
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetOrgId]);

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

  // Notificaciones de nuevas alertas (polling)
  useEffect(() => {
    if (!notificationsEnabled) return;

    // Sembrar knownAlertIds con las alertas ya cargadas
    if (alerts.length > 0 && knownAlertIds.current.size === 0) {
      knownAlertIds.current = new Set(alerts.map((a) => a.id));
    }

    const checkForNewAlerts = async () => {
      if (!targetOrgId) return;

      try {
        const allOrgIds = await getOrganizationIds(targetOrgId);
        let query = supabase
          .from('alerts')
          .select('id, issue, description, criticality')
          .order('created_at', { ascending: false })
          .limit(10);

        if (allOrgIds.length > 1) {
          query = query.in('organization_id', allOrgIds);
        } else {
          query = query.eq('organization_id', targetOrgId);
        }

        const { data, error } = await query;
        if (error) throw error;

        const latestAlerts = (data as Pick<AlertRow, 'id' | 'issue' | 'description' | 'criticality'>[]) || [];
        const previousKnown = knownAlertIds.current;

        for (const alert of latestAlerts) {
          if (!previousKnown.has(alert.id)) {
            const severityLabel =
              alert.criticality === 'critical'
                ? '🔴 Crítica'
                : alert.criticality === 'high'
                  ? '🟠 Alta'
                  : alert.criticality === 'medium'
                    ? '🟡 Media'
                    : '🟢 Baja';

            sendNotification(
              `[${severityLabel}] ${alert.issue}`,
              {
                body: alert.description?.slice(0, 120) ?? 'Nueva alerta registrada',
                tag: `alert-${alert.id}`,
              },
            );
          }
        }

        // Actualizar el conjunto de IDs conocidos
        const newIds = new Set(latestAlerts.map((a) => a.id));
        knownAlertIds.current = newIds;
      } catch (error) {
        console.error('[Notifications] Error polling new alerts:', error);
      }
    };

    const intervalId = setInterval(checkForNewAlerts, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationsEnabled, targetOrgId]);

  if (loading) {
    return <Loading message="Cargando alertas..." />;
  }

  return (
    <div className="space-y-6">
      <div className="px-2">
        <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase">
          Monitoreo de Alertas
        </h1>
        <p className="text-sm text-text-muted font-headline">
          Análisis de incidentes y contactos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <IssueFrequencyChart alerts={alerts} />
        </Card>
        <Card>
          <ContactFrequencyChart
            data={contactFrequencyData}
            loading={contactLoading}
          />
        </Card>
      </div>

      <Card>
        <AlertsTable
          alerts={alerts}
          onRowClick={(alert) =>
            navigate(`/dashboard/monitoring-alerts/${alert.id}`)
          }
        />
      </Card>
    </div>
  );
};

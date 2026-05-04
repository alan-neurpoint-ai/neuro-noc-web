import { useState, useEffect, useCallback } from "react";
import { AlertRepositoryImpl } from "../../data/repositories/AlertRepositoryImpl";
import { AlertActionRepositoryImpl } from "../../data/repositories/AlertActionRepositoryImpl";
import { ContactRepositoryImpl } from "../../data/repositories/ContactRepositoryImpl"; // ← Nuevo
import type { Alert } from "../../core/entities/supabase/Alert";
import type { AlertAction } from "../../core/entities/supabase/AlertAction";
import type { Contact } from "../../core/entities/supabase/Contact";

const alertRepository = new AlertRepositoryImpl();
const alertActionRepository = new AlertActionRepositoryImpl();
const contactRepository = new ContactRepositoryImpl(); // ← Nuevo

interface AlertStats {
  total: number;
  critical: number;
  resolved: number;
  pending: number;
}

interface AlertWithDetails extends Alert {
  actions?: AlertAction[];
  contact?: Contact | null;
}

export const useAlerts = (organizationId?: string) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AlertStats>({
    total: 0,
    critical: 0,
    resolved: 0,
    pending: 0,
  });
  const [alertsOverTime, setAlertsOverTime] = useState<
    { name: string; value: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<AlertWithDetails | null>(
    null,
  );
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const fetchAlerts = useCallback(async () => {
    if (!organizationId) return;

    setIsLoading(true);
    try {
      const alertsData = await alertRepository.findAll(organizationId);
      setAlerts(alertsData);

      const total = alertsData.length;
      const critical = alertsData.filter(
        (a) => a.criticality === "Critical",
      ).length;
      const resolved = alertsData.filter(
        (a) => a.status === "RESOLVED" || a.status === "DISCARDED",
      ).length;
      setStats({ total, critical, resolved, pending: total - resolved });

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      }).reverse();

      const alertsByDay = last7Days.map((date) => ({
        name: date.slice(5),
        value: alertsData.filter((a) => a.created_at?.startsWith(date)).length,
      }));

      setAlertsOverTime(alertsByDay);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  const fetchAlertById = useCallback(async (alertId: string) => {
    setIsLoadingDetail(true);
    try {
      const alert = await alertRepository.findById(alertId);
      const actions = await alertActionRepository.findAll(alertId);

      let contact = null;
      if (actions && actions.length > 0 && actions[0].contact_id) {
        contact = await contactRepository.findById(actions[0].contact_id);
      }

      if (alert) {
        setSelectedAlert({ ...alert, actions, contact });
      }
    } catch (error) {
      console.error("Error fetching alert details:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const updateAlertStatus = useCallback(
    async (id: string, status: Alert["status"], diagnosis?: string) => {
      try {
        if (status === "RESOLVED" || status === "DISCARDED") {
          await alertRepository.update(id, {
            status,
            resolved_at: new Date().toISOString(),
            diagnosis:
              diagnosis ||
              (status === "DISCARDED" ? "Alerta descartada" : undefined),
          });
        } else {
          await alertRepository.update(id, { status });
        }
        await fetchAlerts();
        if (selectedAlert?.id === id) {
          setSelectedAlert((prev) => (prev ? { ...prev, status } : null));
        }
        return true;
      } catch (error) {
        console.error("Error updating alert status:", error);
        return false;
      }
    },
    [fetchAlerts, selectedAlert],
  );

  const resolveAlert = useCallback(
    async (id: string, diagnosis?: string) => {
      return await updateAlertStatus(id, "RESOLVED", diagnosis);
    },
    [updateAlertStatus],
  );

  const acknowledgeAlert = useCallback(
    async (id: string) => {
      return await updateAlertStatus(id, "ACKNOWLEDGED");
    },
    [updateAlertStatus],
  );

  const discardAlert = useCallback(
    async (id: string) => {
      return await updateAlertStatus(
        id,
        "DISCARDED",
        "Alerta descartada - No requiere acción",
      );
    },
    [updateAlertStatus],
  );

  const markAsProblem = useCallback(
    async (id: string) => {
      return await updateAlertStatus(id, "PROBLEM");
    },
    [updateAlertStatus],
  );

  const clearSelectedAlert = useCallback(() => {
    setSelectedAlert(null);
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    stats,
    alertsOverTime,
    isLoading,
    selectedAlert,
    isLoadingDetail,
    fetchAlertById,
    resolveAlert,
    acknowledgeAlert,
    discardAlert,
    markAsProblem,
    updateAlertStatus,
    clearSelectedAlert,
  };
};

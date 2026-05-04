import { useState, useEffect, useCallback } from "react";
import { AlertRepositoryImpl } from "../../data/repositories/AlertRepositoryImpl";
import { AlertActionRepositoryImpl } from "../../data/repositories/AlertActionRepositoryImpl";
import { ContactRepositoryImpl } from "../../data/repositories/ContactRepositoryImpl";
import type { Alert } from "../../core/entities/supabase/Alert";
import type { AlertAction } from "../../core/entities/supabase/AlertAction";
import type { Contact } from "../../core/entities/supabase/Contact";
import { AlertStatisticsService } from "../../data/services/AlertStatisticsService";

const alertRepository = new AlertRepositoryImpl();
const alertActionRepository = new AlertActionRepositoryImpl();
const contactRepository = new ContactRepositoryImpl();

interface AlertWithDetails extends Alert {
  actions?: AlertAction[];
  contact?: Contact | null;
}

export const useAlerts = (organizationId?: string) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState({
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

      const statsData = AlertStatisticsService.calculateStats(alertsData);
      setStats(statsData);

      const timeData = AlertStatisticsService.calculateTimeSeries(alertsData);
      setAlertsOverTime(timeData);
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
    (id: string, diagnosis?: string) =>
      updateAlertStatus(id, "RESOLVED", diagnosis),
    [updateAlertStatus],
  );

  const acknowledgeAlert = useCallback(
    (id: string) => updateAlertStatus(id, "ACKNOWLEDGED"),
    [updateAlertStatus],
  );

  const discardAlert = useCallback(
    (id: string) =>
      updateAlertStatus(
        id,
        "DISCARDED",
        "Alerta descartada - No requiere acción",
      ),
    [updateAlertStatus],
  );

  const markAsProblem = useCallback(
    (id: string) => updateAlertStatus(id, "PROBLEM"),
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

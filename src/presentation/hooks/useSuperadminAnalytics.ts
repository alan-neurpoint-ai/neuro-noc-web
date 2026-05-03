import { useState, useCallback } from "react";
import { supabase } from "../../data/sources/supabase";
import type {
  Client,
  ClientStats,
  UseSuperadminAnalyticsReturn,
} from "../../core/entities/analytics";

export const useSuperadminAnalytics = (): UseSuperadminAnalyticsReturn => {
  const [stats, setStats] = useState<ClientStats>({
    totalClients: 0,
    activeClients: 0,
    totalAlerts: 0,
    criticalAlerts: 0,
    totalAiConfigs: 0,
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: clientsData, error: clientsError } = await supabase
        .from("organizations")
        .select("*")
        .eq("org_type", "client")
        .order("created_at", { ascending: false });

      if (clientsError) throw new Error(clientsError.message);

      if (clientsData) {
        const activeClients = clientsData.filter((c) => c.is_active).length;
        setStats((prev) => ({
          ...prev,
          totalClients: clientsData.length,
          activeClients: activeClients,
        }));
        setClients(clientsData);
      }

      const { data: alerts, error: alertError } = await supabase
        .from("alerts")
        .select("criticality, status, organization_id");

      if (alertError) throw new Error(alertError.message);

      if (alerts) {
        const totalAlerts = alerts.length;
        const criticalAlerts = alerts.filter(
          (a) => a.criticality === "Critical" && a.status !== "RESOLVED",
        ).length;

        setStats((prev) => ({
          ...prev,
          totalAlerts: totalAlerts,
          criticalAlerts: criticalAlerts,
        }));

        if (clientsData) {
          const clientsWithAlerts: Client[] = clientsData.map((client) => {
            const clientAlerts = alerts.filter(
              (a) => a.organization_id === client.id,
            );
            return {
              id: client.id,
              name: client.name,
              slug: client.slug,
              parent_organization_id: client.parent_organization_id,
              org_type: client.org_type,
              is_active: client.is_active,
              created_at: client.created_at,
              updated_at: client.updated_at,
              alertCount: clientAlerts.length,
              criticalAlertCount: clientAlerts.filter(
                (a) => a.criticality === "Critical" && a.status !== "RESOLVED",
              ).length,
            };
          });
          setClients(clientsWithAlerts);
        }
      }

      const { count: aiConfigs, error: aiError } = await supabase
        .from("ai_configurations")
        .select("*", { count: "exact", head: true });

      if (aiError) throw new Error(aiError.message);

      if (aiConfigs !== null) {
        setStats((prev) => ({
          ...prev,
          totalAiConfigs: aiConfigs,
        }));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching analytics";
      setError(errorMessage);
      console.error("Error fetching analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stats,
    clients,
    isLoading,
    error,
    fetchAnalytics,
    refetch: fetchAnalytics,
  };
};

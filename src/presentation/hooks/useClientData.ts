import { useEffect, useState } from "react";
import type { AlertStats } from "../../core/entities/analytics";
import type { Organization } from "../components/ui/Topbar/Topbar";
import { supabase } from "../../data/sources/supabase";

export const useClientData = (
  selectedClient: Organization | null,
  clients: any[],
) => {
  const [clientStats, setClientStats] = useState<AlertStats>({
    total: 0,
    critical: 0,
    resolved: 0,
  });
  const [selectedClientDetails, setSelectedClientDetails] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    if (!selectedClient || selectedClient.id === "all") {
      setSelectedClientDetails(null);
      return;
    }

    const fetchClientDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", selectedClient.id)
          .single();

        if (!error && data) {
          setSelectedClientDetails(data);
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
      }
    };

    fetchClientDetails();
  }, [selectedClient]);

  useEffect(() => {
    if (!selectedClient) return;

    const fetchClientStats = async () => {
      setIsLoadingStats(true);
      try {
        if (selectedClient.id === "all") {
          const { data: alerts } = await supabase
            .from("alerts")
            .select("criticality, status, organization_id")
            .in(
              "organization_id",
              clients.map((c) => c.id),
            );

          if (alerts) {
            setClientStats({
              total: alerts.length,
              critical: alerts.filter(
                (a: { criticality: string; status: string }) =>
                  a.criticality === "Critical" && a.status !== "RESOLVED",
              ).length,
              resolved: alerts.filter(
                (a: { status: string }) => a.status === "RESOLVED",
              ).length,
            });
          }
        } else {
          const { data: alerts } = await supabase
            .from("alerts")
            .select("criticality, status")
            .eq("organization_id", selectedClient.id);

          if (alerts) {
            setClientStats({
              total: alerts.length,
              critical: alerts.filter(
                (a: { criticality: string; status: string }) =>
                  a.criticality === "Critical" && a.status !== "RESOLVED",
              ).length,
              resolved: alerts.filter(
                (a: { status: string }) => a.status === "RESOLVED",
              ).length,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching client stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchClientStats();
  }, [selectedClient, clients]);

  return { clientStats, selectedClientDetails, isLoadingStats };
};

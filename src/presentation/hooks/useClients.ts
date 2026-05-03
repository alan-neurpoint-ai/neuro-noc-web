import { useState, useCallback } from "react";
import { supabase } from "../../data/sources/supabase";

interface Client {
  id: string;
  name: string;
  slug: string;
  org_type: string;
  parent_organization_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  alertCount?: number;
  criticalAlertCount?: number;
  parentName?: string;
}

interface UseClientsReturn {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  toggleClientStatus: (id: string, isActive: boolean) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClients = (): UseClientsReturn => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: clientsData, error: clientsError } = await supabase
        .from("organizations")
        .select("*")
        .eq("org_type", "client")
        .order("created_at", { ascending: false });

      if (clientsError) throw new Error(clientsError.message);

      const parentIds =
        clientsData
          ?.filter((c) => c.parent_organization_id)
          .map((c) => c.parent_organization_id) || [];

      let parentNames: Record<string, string> = {};

      if (parentIds.length > 0) {
        const { data: parentsData } = await supabase
          .from("organizations")
          .select("id, name")
          .in("id", parentIds);

        if (parentsData) {
          parentNames = parentsData.reduce(
            (acc, p) => {
              acc[p.id] = p.name;
              return acc;
            },
            {} as Record<string, string>,
          );
        }
      }

      const { data: alerts } = await supabase
        .from("alerts")
        .select("criticality, status, organization_id");

      const clientsWithData =
        clientsData?.map((client) => {
          const clientAlerts =
            alerts?.filter((a) => a.organization_id === client.id) || [];

          return {
            ...client,
            parentName: client.parent_organization_id
              ? parentNames[client.parent_organization_id]
              : null,
            alertCount: clientAlerts.length,
            criticalAlertCount: clientAlerts.filter(
              (a) => a.criticality === "Critical" && a.status !== "RESOLVED",
            ).length,
          };
        }) || [];

      setClients(clientsWithData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching clients";
      setError(errorMessage);
      console.error("Error fetching clients:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleClientStatus = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        const { error: updateError } = await supabase
          .from("organizations")
          .update({
            is_active: !isActive,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (updateError) throw new Error(updateError.message);

        setClients((prev) =>
          prev.map((client) =>
            client.id === id ? { ...client, is_active: !isActive } : client,
          ),
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error updating client status";
        setError(errorMessage);
        console.error("Error updating client status:", err);
      }
    },
    [],
  );

  const deleteClient = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("organizations")
        .delete()
        .eq("id", id);

      if (deleteError) throw new Error(deleteError.message);

      setClients((prev) => prev.filter((client) => client.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error deleting client";
      setError(errorMessage);
      console.error("Error deleting client:", err);
    }
  }, []);

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    toggleClientStatus,
    deleteClient,
  };
};

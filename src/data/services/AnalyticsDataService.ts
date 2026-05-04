import { supabase } from "../sources/supabase";

export class AnalyticsDataService {
  async fetchAlertsData(orgId: string, isInternal: boolean) {
    let alertsData = [];
    let actionsData = [];
    let nodesData = [];

    if (isInternal) {
      const { data: clients } = await supabase
        .from("organizations")
        .select("id")
        .eq("parent_organization_id", orgId)
        .eq("org_type", "client");

      const clientIds = clients?.map((c) => c.id) || [];

      if (clientIds.length > 0) {
        const { data: alerts } = await supabase
          .from("alerts")
          .select("*")
          .in("organization_id", clientIds)
          .order("created_at", { ascending: true });

        alertsData = alerts || [];

        const { data: actions } = await supabase
          .from("alert_actions")
          .select("*")
          .in("alert_id", alerts?.map((a) => a.id) || []);

        actionsData = actions || [];

        const { data: nodes } = await supabase
          .from("nodes")
          .select("*")
          .in("organization_id", clientIds);

        nodesData = nodes || [];
      }
    } else {
      const { data: alerts } = await supabase
        .from("alerts")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: true });

      alertsData = alerts || [];

      const { data: actions } = await supabase
        .from("alert_actions")
        .select("*")
        .in("alert_id", alerts?.map((a) => a.id) || []);

      actionsData = actions || [];

      const { data: nodes } = await supabase
        .from("nodes")
        .select("*")
        .eq("organization_id", orgId);

      nodesData = nodes || [];
    }

    return { alertsData, actionsData, nodesData };
  }
}
    
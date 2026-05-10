import { supabase } from "../../../../core/supabase";

interface AlertData {
  id: string;
  organization_id: string;
  status: string;
  criticality: string;
  created_at: string;
}

interface AlertsByDate {
  date: string;
  total: number;
  critical: number;
  warning: number;
  resolved: number;
}

export const alertService = {
  async getAlertsByOrganization(
    orgId: string,
    includeChildren: boolean,
    childrenIds: string[],
  ): Promise<AlertData[]> {
    let query = supabase
      .from("alerts")
      .select("id, organization_id, status, criticality, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (includeChildren && childrenIds.length > 0) {
      query = query.in("organization_id", [orgId, ...childrenIds]);
    } else {
      query = query.eq("organization_id", orgId);
    }

    const { data, error } = await query.limit(200);

    if (error) throw error;
    return (data as AlertData[]) || [];
  },

  async getAlertsGroupedByWeek(
    orgId: string,
    includeChildren: boolean,
    childrenIds: string[],
  ): Promise<AlertsByDate[]> {
    const alerts = await this.getAlertsByOrganization(
      orgId,
      includeChildren,
      childrenIds,
    );

    const last4Weeks: AlertsByDate[] = [];
    const today = new Date();

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() - i * 7);

      const dateStr = weekStart.toISOString().split("T")[0];

      const weekAlerts = alerts.filter((a) => {
        const alertDate = new Date(a.created_at || "");
        return alertDate >= weekStart && alertDate <= weekEnd;
      });

      last4Weeks.push({
        date: dateStr,
        total: weekAlerts.length,
        critical: weekAlerts.filter(
          (a) => a.criticality === "critical" && a.status === "PROBLEM",
        ).length,
        warning: weekAlerts.filter(
          (a) => a.criticality === "warning" && a.status === "PROBLEM",
        ).length,
        resolved: weekAlerts.filter((a) => a.status === "RESOLVED").length,
      });
    }

    return last4Weeks;
  },
};
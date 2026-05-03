import type { AnalyticsData } from "../../core/entities/analytics/analytics";
import { supabase } from "../sources/supabase";

export const analyticsService = {
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
  },

  calculateAlertsOverTime(
    alertsData: any[],
  ): { name: string; value: number }[] {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    return last7Days.map((date) => ({
      name: date.slice(5),
      value: alertsData.filter((a) => a.created_at?.startsWith(date)).length,
    }));
  },

  calculateAvgResponseTime(alertsData: any[]): number {
    const resolvedAlerts = alertsData.filter(
      (a) => a.status === "RESOLVED" && a.resolved_at,
    );
    if (resolvedAlerts.length === 0) return 0;

    const totalResponseTime = resolvedAlerts.reduce((sum, alert) => {
      const created = new Date(alert.created_at);
      const resolved = new Date(alert.resolved_at);
      const diffMinutes =
        (resolved.getTime() - created.getTime()) / (1000 * 60);
      return sum + diffMinutes;
    }, 0);

    return Math.round(totalResponseTime / resolvedAlerts.length);
  },

  processAnalyticsData(
    alertsData: any[],
    actionsData: any[],
    nodesData: any[],
  ): AnalyticsData {
    const totalAlerts = alertsData.length;
    const resolvedAlerts = alertsData.filter(
      (a) => a.status === "RESOLVED",
    ).length;
    const criticalAlerts = alertsData.filter(
      (a) => a.criticality === "Critical",
    ).length;
    const resolutionRate =
      totalAlerts > 0 ? (resolvedAlerts / totalAlerts) * 100 : 0;

    return {
      alertsOverTime: this.calculateAlertsOverTime(alertsData),
      totalAlerts,
      resolvedAlerts,
      criticalAlerts,
      avgResponseTime: this.calculateAvgResponseTime(alertsData),
      actionsSent: actionsData.length,
      emailsSent: actionsData.filter((a) => a.email_execution_id).length,
      resolutionRate,
      activeNodes: nodesData.filter((n) => n.is_active !== false).length,
    };
  },
};

import type { AnalyticsData } from "../../core/entities/analytics/analytics";

export class AnalyticsDomainService {
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
  }

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
  }

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
  }
}

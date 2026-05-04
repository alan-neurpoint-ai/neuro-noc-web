import type { Alert } from "../../core/entities/supabase/Alert";

export interface AlertStats {
  total: number;
  critical: number;
  resolved: number;
  pending: number;
}

export interface TimeDataPoint {
  name: string;
  value: number;
}

export class AlertStatisticsService {
  static calculateStats(alerts: Alert[]): AlertStats {
    const total = alerts.length;
    const critical = alerts.filter((a) => a.criticality === "Critical").length;
    const resolved = alerts.filter(
      (a) => a.status === "RESOLVED" || a.status === "DISCARDED",
    ).length;

    return {
      total,
      critical,
      resolved,
      pending: total - resolved,
    };
  }
  static calculateTimeSeries(
    alerts: Alert[],
    days: number = 7,
  ): TimeDataPoint[] {
    const lastDays = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    return lastDays.map((date) => ({
      name: date.slice(5),
      value: alerts.filter((a) => a.created_at?.startsWith(date)).length,
    }));
  }

  static calculateTrend(
    current: number,
    previous: number,
  ): { value: number; isPositive: boolean } {
    if (previous === 0) return { value: 0, isPositive: false };
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(Math.round(change)), isPositive: change >= 0 };
  }

  static calculateResolutionRate(total: number, resolved: number): number {
    if (total === 0) return 0;
    return (resolved / total) * 100;
  }
}

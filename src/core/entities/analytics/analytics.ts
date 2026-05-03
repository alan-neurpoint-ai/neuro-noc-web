import type { Organization } from "../supabase/Organization";

export interface AnalyticsData {
  alertsOverTime: { name: string; value: number }[];
  totalAlerts: number;
  resolvedAlerts: number;
  criticalAlerts: number;
  avgResponseTime: number;
  actionsSent: number;
  emailsSent: number;
  resolutionRate: number;
  activeNodes: number;
}

export interface OrganizationWithInternal extends Organization {
  isInternal?: boolean;
}

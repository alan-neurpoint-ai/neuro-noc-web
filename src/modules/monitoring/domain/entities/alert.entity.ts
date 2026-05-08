export type AlertCriticality =
  | "Information"
  | "Low"
  | "Average"
  | "High"
  | "Critical";
export type AlertStatus = "PROBLEM" | "RESOLVED" | "ACKNOWLEDGED";

export interface AlertEntity {
  id: string;
  organizationId: string;
  hostName: string;
  triggerId: string | null;
  issue: string;
  description: string | null;
  recommendations: string | null;
  criticality: AlertCriticality;
  diagnosis: string | null;
  status: AlertStatus;
  isSuppressed: boolean;
  createdAt: Date;
  resolvedAt: Date | null;
}

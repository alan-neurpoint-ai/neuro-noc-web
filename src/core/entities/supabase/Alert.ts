export interface Alert {
  id: string;
  organization_id: string;
  host_name: string;
  trigger_id: string | null;
  issue: string;
  description: string | null;
  recommendations: string | null;
  criticality: "Information" | "Low" | "Average" | "High" | "Critical";
  diagnosis: string | null;
  status: "PROBLEM" | "ACKNOWLEDGED" | "RESOLVED";
  is_suppressed: boolean;
  created_at: string;
  resolved_at: string | null;
}

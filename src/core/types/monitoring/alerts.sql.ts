export interface AlertRow {
  id: string;
  organization_id: string;
  host_name: string;
  trigger_id: string | null;
  issue: string;
  description: string | null;
  recommendations: string | null;
  criticality: string;
  diagnosis: string | null;
  status: string;
  is_suppressed: boolean | null;
  created_at: string | null;
  resolved_at: string | null;
}

export type AlertInsert = Omit<AlertRow, "id" | "created_at" | "resolved_at">;

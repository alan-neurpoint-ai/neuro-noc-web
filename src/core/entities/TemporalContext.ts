export interface TemporalContext {
  id: string;
  name: string;
  description: string | null;
  affected_nodes: any | null;
  start_date: string;
  end_date: string;
  status: "active" | "expired" | "cancelled";
  organization_id: string | null;
  created_by: string | null;
  deleted_by: string | null;
  deletion_reason: string | null;
  created_at: string;
  deleted_at: string | null;
}

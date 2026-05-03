export interface BusinessRule {
  id: string;
  name: string;
  description: string | null;
  affected_targets: any | null;
  execution_schedule: string | null;
  status: "active" | "inactive";
  organization_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  organization_id: string | null;
  created_at: string;
  status: "active" | "inactive";
}

export interface RoleRow {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  organization_id: string | null;
  status: string | null;
  created_at: string;
}

export type RoleInsert = Partial<Omit<RoleRow, "id" | "created_at">>;
export type RoleUpdate = Partial<RoleRow>;

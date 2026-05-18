export interface PermissionRow {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  created_at: string;
  status: string | null;
}

export type PermissionInsert = Partial<
  Omit<PermissionRow, "id" | "created_at">
>;
export type PermissionUpdate = Partial<PermissionRow>;

import { type PermissionRow } from "./permissions.sql";

export interface RolePermissionRow {
  role_id: string;
  permission_id: string;
}
export type RolePermissionInsert = RolePermissionRow;
export interface RolePermissionWithRelation {
  permissions: PermissionRow | PermissionRow[] | null;
}

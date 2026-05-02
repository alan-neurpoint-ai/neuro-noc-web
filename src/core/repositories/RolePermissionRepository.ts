import { type RolePermission } from "../entities/RolePermission";

export interface RolePermissionRepository {
  findByRole(roleId: string): Promise<RolePermission[]>;
  findByPermission(permissionId: string): Promise<RolePermission[]>;
  assign(roleId: string, permissionId: string): Promise<void>;
  remove(roleId: string, permissionId: string): Promise<void>;
  removeAllByRole(roleId: string): Promise<void>;
  removeAllByPermission(permissionId: string): Promise<void>;
}

import type { PermissionEntity } from "../../../permissions/domain/entities/permission.entity";

export interface RolePermissionRepository {
  assignPermission(roleId: string, permissionId: string): Promise<void>;
  removePermission(roleId: string, permissionId: string): Promise<void>;
  getPermissionsByRole(roleId: string): Promise<PermissionEntity[]>;
}

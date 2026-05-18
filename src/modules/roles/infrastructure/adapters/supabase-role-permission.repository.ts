import { supabase } from "../../../../core/supabase";
import type { PermissionEntity } from "../../../permissions/domain/entities/permission.entity";
import type { RolePermissionRepository } from "../../domain/ports/role-permission.repository";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rolePermissionsTable = () => supabase.from("role_permissions") as any;

export const createSupabaseRolePermissionRepository =
  (): RolePermissionRepository => ({
    async assignPermission(
      roleId: string,
      permissionId: string,
    ): Promise<void> {
      const { error } = await rolePermissionsTable().insert({
        role_id: roleId,
        permission_id: permissionId,
      });

      if (error) throw new Error(`[RolePermissionRepo]: ${error.message}`);
    },

    async removePermission(
      roleId: string,
      permissionId: string,
    ): Promise<void> {
      const { error } = await rolePermissionsTable()
        .delete()
        .eq("role_id", roleId)
        .eq("permission_id", permissionId);

      if (error) throw new Error(`[RolePermissionRepo]: ${error.message}`);
    },

    async getPermissionsByRole(roleId: string): Promise<PermissionEntity[]> {
      const { data, error } = await rolePermissionsTable()
        .select(
          `
          permissions!inner (
            id,
            name,
            resource,
            action,
            description,
            status,
            created_at
          )
        `,
        )
        .eq("role_id", roleId);

      if (error) throw new Error(`[RolePermissionRepo]: ${error.message}`);
      if (!data) return [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((item: any) => ({
        id: item.permissions.id,
        name: item.permissions.name,
        resource: item.permissions.resource,
        action: item.permissions.action,
        description: item.permissions.description ?? null,
        status: item.permissions.status ?? "active",
        createdAt: new Date(item.permissions.created_at),
      }));
    },
  });

import { supabase } from "../../../../core/supabase";
import type { RoleRow } from "../../../../core/types/auth/roles.sql";
import type { RoleEntity } from "../../domain/entities/role.entity";
import type { RoleRepository } from "../../domain/ports/role.repository";

export const createSupabaseRoleRepository = (): RoleRepository => {
  const mapToEntity = (row: RoleRow): RoleEntity => ({
    id: row.id,
    name: row.name,
    displayName: row.display_name,
    description: row.description,
    organizationId: row.organization_id,
    status: row.status ?? "inactive",
    createdAt: new Date(row.created_at),
  });

  return {
    async getAll(): Promise<RoleEntity[]> {
      const { data, error } = await supabase.from("roles").select("*");
      if (error) throw new Error(`[RoleRepository]: ${error.message}`);
      return ((data as RoleRow[]) || []).map(mapToEntity);
    },

    async getById(id: string): Promise<RoleEntity | null> {
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) return null;

      return mapToEntity(data as RoleRow);
    },

    async getByOrganization(orgId: string): Promise<RoleEntity[]> {
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .eq("organization_id", orgId);

      if (error) throw new Error(error.message);
      return ((data as RoleRow[]) || []).map(mapToEntity);
    },
  };
};

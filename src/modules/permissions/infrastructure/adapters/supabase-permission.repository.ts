import { supabase } from "../../../../core/supabase";
import type { PermissionRow } from "../../../../core/types/permissions.sql";
import type { PermissionEntity } from "../../domain/entities/permission.entity";
import type { PermissionRepository } from "../../domain/ports/permission.repository";

export const createSupabasePermissionRepository = (): PermissionRepository => {
  const mapToEntity = (row: PermissionRow): PermissionEntity => ({
    id: row.id,
    name: row.name,
    resource: row.resource,
    action: row.action,
    description: row.description,
    status: row.status ?? "active",
    createdAt: new Date(row.created_at),
  });

  return {
    async getAll(): Promise<PermissionEntity[]> {
      const { data, error } = await supabase.from("permissions").select("*");
      if (error) throw new Error(`[PermissionRepository]: ${error.message}`);
      return ((data as PermissionRow[]) || []).map(mapToEntity);
    },

    async getById(id: string): Promise<PermissionEntity | null> {
      const { data, error } = await supabase
        .from("permissions")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) return null;
      return mapToEntity(data as PermissionRow);
    },

    async getByResource(resource: string): Promise<PermissionEntity[]> {
      const { data, error } = await supabase
        .from("permissions")
        .select("*")
        .eq("resource", resource);
      if (error) throw new Error(error.message);
      return ((data as PermissionRow[]) || []).map(mapToEntity);
    },
  };
};

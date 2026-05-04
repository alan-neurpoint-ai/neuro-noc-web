import { type Role } from "../../core/entities/supabase/Role";
import type { RoleRepository } from "../../core/repositories/supabase/RoleRepository";
import { supabase } from "../sources/supabase/client";

export class RoleRepositoryImpl implements RoleRepository {
  async findAll(organizationId?: string | null): Promise<Role[]> {
    let query = supabase.from("roles").select("*");

    if (organizationId === null) {
      query = query.is("organization_id", null);
    } else if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async findById(id: string): Promise<Role | null> {
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findByName(
    name: string,
    organizationId?: string | null,
  ): Promise<Role | null> {
    let query = supabase.from("roles").select("*").eq("name", name);

    if (organizationId === null) {
      query = query.is("organization_id", null);
    } else if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }

  async create(data: Omit<Role, "id" | "created_at">): Promise<Role> {
    const { data: created, error } = await supabase
      .from("roles")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<Role, "id" | "created_at">>,
  ): Promise<Role> {
    const { data: updated, error } = await supabase
      .from("roles")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("roles").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

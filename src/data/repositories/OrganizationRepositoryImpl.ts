import { type Organization } from "../../core/entities/supabase/Organization";
import type { OrganizationRepository } from "../../core/repositories/supabase/OrganizationRepository";
import { supabase } from "../sources/supabase/client";

export class OrganizationRepositoryImpl implements OrganizationRepository {
  async findAll(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findById(id: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findActive(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(
    data: Omit<Organization, "id" | "created_at" | "updated_at">,
  ): Promise<Organization> {
    const { data: created, error } = await supabase
      .from("organizations")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<Organization, "id" | "created_at" | "updated_at">>,
  ): Promise<Organization> {
    const { data: updated, error } = await supabase
      .from("organizations")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("organizations")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  async getHierarchy(orgId: string): Promise<any> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("parent_organization_id", orgId);

    if (error) throw new Error(error.message);
    return data || [];
  }

  async getSubOrganizations(orgId: string): Promise<Organization[]> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("parent_organization_id", orgId)
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }
}

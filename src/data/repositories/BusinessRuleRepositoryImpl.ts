import { type BusinessRule } from "../../core/entities/supabase/BusinessRule";
import type { BusinessRuleRepository } from "../../core/repositories/supabase/BusinessRuleRepository";
import { supabase } from "../sources/supabase/client";

export class BusinessRuleRepositoryImpl implements BusinessRuleRepository {
  async findAll(organizationId?: string): Promise<BusinessRule[]> {
    let query = supabase
      .from("business_rule")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async findById(id: string): Promise<BusinessRule | null> {
    const { data, error } = await supabase
      .from("business_rule")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findActive(organizationId?: string): Promise<BusinessRule[]> {
    let query = supabase
      .from("business_rule")
      .select("*")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async findByName(name: string): Promise<BusinessRule | null> {
    const { data, error } = await supabase
      .from("business_rule")
      .select("*")
      .eq("name", name)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async create(
    data: Omit<BusinessRule, "id" | "created_at" | "updated_at" | "deleted_at">,
  ): Promise<BusinessRule> {
    const { data: created, error } = await supabase
      .from("business_rule")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return created;
  }

  async update(
    id: string,
    data: Partial<
      Omit<BusinessRule, "id" | "created_at" | "updated_at" | "deleted_at">
    >,
  ): Promise<BusinessRule> {
    const { data: updated, error } = await supabase
      .from("business_rule")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("business_rule")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  async softDelete(
    id: string,
    deletedBy: string,
    reason?: string,
  ): Promise<void> {
    const { error } = await supabase
      .from("business_rule")
      .update({
        deleted_at: new Date().toISOString(),
        updated_by: deletedBy,
        description: reason || null,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}

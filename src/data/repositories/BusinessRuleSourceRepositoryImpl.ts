import { supabase } from "../sources/supabase/client";
import { type BusinessRuleSource } from "../../core/entities/supabase/BusinessRuleSource";
import { type BusinessRuleSourceRepository } from "../../core/repositories/supabase/BusinessRuleSourceRepository";

export class BusinessRuleSourceRepositoryImpl implements BusinessRuleSourceRepository {
  async findByDocumentation(
    documentationId: string,
  ): Promise<BusinessRuleSource[]> {
    const { data, error } = await supabase
      .from("business_rule_source")
      .select("*")
      .eq("documentation_id", documentationId)
      .eq("status", "active");

    if (error) throw new Error(error.message);
    return data || [];
  }

  // Implementaciones mínimas para cumplir con la interfaz
  async findAll(businessRuleId?: string): Promise<BusinessRuleSource[]> {
    let query = supabase.from("business_rule_source").select("*");
    if (businessRuleId) query = query.eq("business_rule_id", businessRuleId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async findById(id: string): Promise<BusinessRuleSource | null> {
    const { data, error } = await supabase
      .from("business_rule_source")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async create(
    data: Omit<BusinessRuleSource, "id" | "created_at">,
  ): Promise<BusinessRuleSource> {
    const { data: res, error } = await supabase
      .from("business_rule_source")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return res;
  }

  async update(
    id: string,
    data: Partial<Omit<BusinessRuleSource, "id" | "created_at">>,
  ): Promise<BusinessRuleSource> {
    const { data: res, error } = await supabase
      .from("business_rule_source")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return res;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("business_rule_source")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  async deleteByBusinessRule(businessRuleId: string): Promise<void> {
    const { error } = await supabase
      .from("business_rule_source")
      .delete()
      .eq("business_rule_id", businessRuleId);
    if (error) throw new Error(error.message);
  }
}

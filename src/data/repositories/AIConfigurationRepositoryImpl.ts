import { type AIConfiguration } from "../../core/entities/supabase/AIConfiguration";
import type { AIConfigurationRepository } from "../../core/repositories/supabase/AIConfigurationRepository";
import { supabase } from "../sources/supabase/client";

export class AIConfigurationRepositoryImpl implements AIConfigurationRepository {
  async findAll(organizationId: string): Promise<AIConfiguration[]> {
    const { data, error } = await supabase
      .from("ai_configurations")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findById(id: string): Promise<AIConfiguration | null> {
    const { data, error } = await supabase
      .from("ai_configurations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findActive(organizationId: string): Promise<AIConfiguration[]> {
    const { data, error } = await supabase
      .from("ai_configurations")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findByName(
    organizationId: string,
    aiName: string,
  ): Promise<AIConfiguration | null> {
    const { data, error } = await supabase
      .from("ai_configurations")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("ai_name", aiName)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async create(
    data: Omit<AIConfiguration, "id" | "created_at" | "updated_at">,
  ): Promise<AIConfiguration> {
    const { data: created, error } = await supabase
      .from("ai_configurations")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<AIConfiguration, "id" | "created_at" | "updated_at">>,
  ): Promise<AIConfiguration> {
    const { data: updated, error } = await supabase
      .from("ai_configurations")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("ai_configurations")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  async updateStatus(
    id: string,
    status: AIConfiguration["status"],
  ): Promise<void> {
    const { error } = await supabase
      .from("ai_configurations")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}

import { type AlertAction } from "../../core/entities/supabase/AlertAction";
import type { AlertActionRepository } from "../../core/repositories/supabase/AlertActionRepository";
import { supabase } from "../sources/supabase/client";

export class AlertActionRepositoryImpl implements AlertActionRepository {
  async findAll(alertId: string): Promise<AlertAction[]> {
    const { data, error } = await supabase
      .from("alert_actions")
      .select("*")
      .eq("alert_id", alertId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findById(id: string): Promise<AlertAction | null> {
    const { data, error } = await supabase
      .from("alert_actions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findByExecutionId(executionId: string): Promise<AlertAction | null> {
    const { data, error } = await supabase
      .from("alert_actions")
      .select("*")
      .or(
        `n8n_execution_id.eq.${executionId},email_execution_id.eq.${executionId},vapi_execution_id.eq.${executionId}`,
      )
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async create(
    data: Omit<AlertAction, "id" | "created_at">,
  ): Promise<AlertAction> {
    const { data: created, error } = await supabase
      .from("alert_actions")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<AlertAction, "id" | "created_at">>,
  ): Promise<AlertAction> {
    const { data: updated, error } = await supabase
      .from("alert_actions")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("alert_actions")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  async deleteByAlert(alertId: string): Promise<void> {
    const { error } = await supabase
      .from("alert_actions")
      .delete()
      .eq("alert_id", alertId);
    if (error) throw new Error(error.message);
  }
}

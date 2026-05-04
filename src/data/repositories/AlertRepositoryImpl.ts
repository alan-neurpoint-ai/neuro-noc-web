import { type Alert } from "../../core/entities/supabase/Alert";
import type { AlertRepository } from "../../core/repositories/supabase/AlertRepository";
import { supabase } from "../sources/supabase/client";

export class AlertRepositoryImpl implements AlertRepository {
  async findAll(organizationId: string): Promise<Alert[]> {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findById(id: string): Promise<Alert | null> {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findActive(organizationId: string): Promise<Alert[]> {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .eq("organization_id", organizationId)
      .neq("status", "RESOLVED")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findByStatus(
    organizationId: string,
    status: Alert["status"],
  ): Promise<Alert[]> {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findByCriticality(
    organizationId: string,
    criticality: Alert["criticality"],
  ): Promise<Alert[]> {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("criticality", criticality)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(
    data: Omit<Alert, "id" | "created_at" | "resolved_at">,
  ): Promise<Alert> {
    const { data: created, error } = await supabase
      .from("alerts")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<Alert, "id" | "created_at">>,
  ): Promise<Alert> {
    const updateData: any = { ...data };

    if (
      (data.status === "RESOLVED" || data.status === "DISCARDED") &&
      !data.resolved_at
    ) {
      updateData.resolved_at = new Date().toISOString();
    }

    if (data.status === "PROBLEM" || data.status === "ACKNOWLEDGED") {
      updateData.resolved_at = null;
    }

    const { data: updated, error } = await supabase
      .from("alerts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("alerts").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async resolve(id: string, diagnosis?: string): Promise<void> {
    const { error } = await supabase
      .from("alerts")
      .update({
        status: "RESOLVED",
        resolved_at: new Date().toISOString(),
        diagnosis: diagnosis || null,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async suppress(id: string, suppress: boolean): Promise<void> {
    const { error } = await supabase
      .from("alerts")
      .update({ is_suppressed: suppress })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}

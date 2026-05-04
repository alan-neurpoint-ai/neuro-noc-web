import { type TemporalContext } from "../../core/entities/supabase/TemporalContext";
import type { TemporalContextRepository } from "../../core/repositories/supabase/TemporalContextRepository";
import { supabase } from "../sources/supabase/client";

export class TemporalContextRepositoryImpl implements TemporalContextRepository {
  async findAll(organizationId?: string): Promise<TemporalContext[]> {
    let query = supabase
      .from("temporal_contexts")
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

  async findById(id: string): Promise<TemporalContext | null> {
    const { data, error } = await supabase
      .from("temporal_contexts")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findActive(organizationId?: string): Promise<TemporalContext[]> {
    const now = new Date().toISOString();
    let query = supabase
      .from("temporal_contexts")
      .select("*")
      .eq("status", "active")
      .lte("start_date", now)
      .gte("end_date", now)
      .is("deleted_at", null)
      .order("start_date", { ascending: true });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async findActiveByDate(date: Date): Promise<TemporalContext[]> {
    const dateStr = date.toISOString();
    const { data, error } = await supabase
      .from("temporal_contexts")
      .select("*")
      .eq("status", "active")
      .lte("start_date", dateStr)
      .gte("end_date", dateStr)
      .is("deleted_at", null)
      .order("start_date", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(
    data: Omit<TemporalContext, "id" | "created_at" | "deleted_at">,
  ): Promise<TemporalContext> {
    const { data: created, error } = await supabase
      .from("temporal_contexts")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<TemporalContext, "id" | "created_at" | "deleted_at">>,
  ): Promise<TemporalContext> {
    const { data: updated, error } = await supabase
      .from("temporal_contexts")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("temporal_contexts")
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
      .from("temporal_contexts")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: deletedBy,
        deletion_reason: reason || null,
        status: "cancelled",
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}

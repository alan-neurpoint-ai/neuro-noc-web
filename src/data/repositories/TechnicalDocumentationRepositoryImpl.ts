import { type TechnicalDocumentation } from "../../core/entities/supabase/TechnicalDocumentation";
import type { TechnicalDocumentationRepository } from "../../core/repositories/supabase/TechnicalDocumentationRepository";
import { supabase } from "../sources/supabase/client";

export class TechnicalDocumentationRepositoryImpl implements TechnicalDocumentationRepository {
  async findAll(organizationId?: string): Promise<TechnicalDocumentation[]> {
    let query = supabase
      .from("technical_documentation")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async findById(id: string): Promise<TechnicalDocumentation | null> {
    const { data, error } = await supabase
      .from("technical_documentation")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findByName(name: string): Promise<TechnicalDocumentation | null> {
    const { data, error } = await supabase
      .from("technical_documentation")
      .select("*")
      .eq("name", name)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async findByStatus(
    status: TechnicalDocumentation["status"],
  ): Promise<TechnicalDocumentation[]> {
    const { data, error } = await supabase
      .from("technical_documentation")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(
    data: Omit<TechnicalDocumentation, "id" | "created_at">,
  ): Promise<TechnicalDocumentation> {
    const { data: created, error } = await supabase
      .from("technical_documentation")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<TechnicalDocumentation, "id" | "created_at">>,
  ): Promise<TechnicalDocumentation> {
    const { data: updated, error } = await supabase
      .from("technical_documentation")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("technical_documentation")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  async updateStatus(
    id: string,
    status: TechnicalDocumentation["status"],
  ): Promise<void> {
    const { error } = await supabase
      .from("technical_documentation")
      .update({ status })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}

import { type Contact } from "../../core/entities/supabase/Contact";
import type { ContactRepository } from "../../core/repositories/supabase/ContactRepository";
import { supabase } from "../sources/supabase/client";

export class ContactRepositoryImpl implements ContactRepository {
  findActive(_organizationId: string): Promise<Contact[]> {
    throw new Error("Method not implemented.");
  }
  softDelete(_id: string, _reason?: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async findById(id: string): Promise<Contact | null> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findAll(organizationId: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("status", "active");

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findByEmail(email: string): Promise<Contact | null> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findInternal(organizationId: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("is_internal", true);

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findExternal(organizationId: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("is_internal", false);

    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(
    data: Omit<Contact, "id" | "created_at" | "updated_at">,
  ): Promise<Contact> {
    const { data: created, error } = await supabase
      .from("contacts")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<Contact, "id" | "created_at" | "updated_at">>,
  ): Promise<Contact> {
    const { data: updated, error } = await supabase
      .from("contacts")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

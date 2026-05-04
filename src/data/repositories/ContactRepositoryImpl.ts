import { type Contact } from "../../core/entities/supabase/Contact";
import type { ContactRepository } from "../../core/repositories/supabase/ContactRepository";
import { supabase } from "../sources/supabase/client";

type CreateContactDTO = Omit<Contact, "id" | "created_at" | "updated_at">;
type UpdateContactDTO = Partial<
  Omit<Contact, "id" | "created_at" | "updated_at">
>;
export class ContactRepositoryImpl implements ContactRepository {
  async findAll(filters?: {
    organizationId: string;
    status?: string;
  }): Promise<Contact[]> {
    if (!filters?.organizationId) {
      return [];
    }

    let query = supabase
      .from("contacts")
      .select("*")
      .eq("organization_id", filters.organizationId);

    if (filters.status) {
      query = query.eq("status", filters.status);
    } else {
      query = query.eq("status", "active");
    }

    const { data, error } = await query.order("full_name", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
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

  async create(data: CreateContactDTO): Promise<Contact> {
    const { data: created, error } = await supabase
      .from("contacts")
      .insert({ ...data, status: "active", notes: null })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return created;
  }

  async update(id: string, data: UpdateContactDTO): Promise<Contact> {
    const { data: updated, error } = await supabase
      .from("contacts")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  }

  async softDelete(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from("contacts")
      .update({
        status: "inactive",
        notes: reason || "Contacto eliminado del sistema",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async findByEmail(email: string): Promise<Contact | null> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async findInternal(organizationId: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("is_internal", true)
      .eq("status", "active");

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findExternal(organizationId: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("is_internal", false)
      .eq("status", "active");

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findActive(organizationId: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("status", "active");

    if (error) throw new Error(error.message);
    return data || [];
  }
}

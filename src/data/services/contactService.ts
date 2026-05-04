import { supabase } from "../sources/supabase";
import type { Contact } from "../../core/entities/supabase/Contact";

export const contactService = {
  async getContacts(organizationId: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("status", "active")
      .order("full_name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getContactById(id: string): Promise<Contact | null> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createContact(
    contact: Omit<
      Contact,
      "id" | "created_at" | "updated_at" | "status" | "notes"
    >,
  ): Promise<Contact> {
    const { data, error } = await supabase
      .from("contacts")
      .insert({
        ...contact,
        status: "active",
        notes: null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateContact(
    id: string,
    contact: Partial<Omit<Contact, "id" | "created_at" | "updated_at">>,
  ): Promise<Contact> {
    const { data, error } = await supabase
      .from("contacts")
      .update({ ...contact, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async softDeleteContact(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from("contacts")
      .update({
        status: "inactive",
        notes: reason || "Contacto eliminado del sistema",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  },
};

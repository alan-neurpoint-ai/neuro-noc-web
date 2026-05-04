import { supabase } from "../sources/supabase";
import type { Contact } from "../../core/entities/supabase/Contact";

export const contactService = {
  async getContacts(organizationId: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("organization_id", organizationId)
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
    contact: Omit<Contact, "id" | "created_at" | "updated_at">,
  ): Promise<Contact> {
    const { data, error } = await supabase
      .from("contacts")
      .insert(contact)
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

  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase.from("contacts").delete().eq("id", id);

    if (error) throw error;
  },

  async getUsers(
    organizationId: string,
  ): Promise<
    { id: string; email: string; first_name: string; last_name: string }[]
  > {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name")
      .eq("organization_id", organizationId)
      .eq("is_active", true);

    if (error) throw error;
    return data || [];
  },
};

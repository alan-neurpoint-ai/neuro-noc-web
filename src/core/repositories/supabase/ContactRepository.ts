import { type Contact } from "../../entities/supabase/Contact";

export interface ContactRepository {
  findAll(organizationId: string): Promise<Contact[]>;
  findById(id: string): Promise<Contact | null>;
  findByEmail(email: string): Promise<Contact | null>;
  findInternal(organizationId: string): Promise<Contact[]>;
  findExternal(organizationId: string): Promise<Contact[]>;
  findActive(organizationId: string): Promise<Contact[]>;
  create(
    data: Omit<Contact, "id" | "created_at" | "updated_at">,
  ): Promise<Contact>;
  update(
    id: string,
    data: Partial<Omit<Contact, "id" | "created_at" | "updated_at">>,
  ): Promise<Contact>;
  softDelete(id: string, reason?: string): Promise<void>;
}

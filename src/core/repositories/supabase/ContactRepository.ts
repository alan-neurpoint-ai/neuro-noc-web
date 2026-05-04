import { type BaseRepository } from "./BaseRepository";
import { type Contact } from "../../entities/supabase/Contact";

type CreateContactDTO = Omit<Contact, "id" | "created_at" | "updated_at">;
type UpdateContactDTO = Partial<
  Omit<Contact, "id" | "created_at" | "updated_at">
>;

interface ContactFilters {
  organizationId: string;
  status?: "active" | "inactive";
}

export interface ContactRepository extends BaseRepository<
  Contact,
  CreateContactDTO,
  UpdateContactDTO,
  ContactFilters
> {
  findByEmail(email: string): Promise<Contact | null>;
  findInternal(organizationId: string): Promise<Contact[]>;
  findExternal(organizationId: string): Promise<Contact[]>;
  findActive(organizationId: string): Promise<Contact[]>;
}

import { type ContactEntity } from "../entities/contact.entity";

export interface ContactRepository {
  getAllByOrganization(orgId: string): Promise<ContactEntity[]>;
  getById(id: string): Promise<ContactEntity | null>;
  create(contact: Partial<ContactEntity>): Promise<ContactEntity>;
  update(id: string, contact: Partial<ContactEntity>): Promise<ContactEntity>;
  delete(id: string): Promise<void>;
}

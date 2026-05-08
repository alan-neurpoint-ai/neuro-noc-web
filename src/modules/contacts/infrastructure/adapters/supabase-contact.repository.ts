import { supabase } from "../../../../core/supabase";
import type { ContactEntity } from "../../domain/entities/contact.entity";
import type { ContactRepository } from "../../domain/ports/contact.repository";
import type {
  ContactRow,
  ContactInsert,
} from "../../../../core/types/contacts.sql";

export const createSupabaseContactRepository = (): ContactRepository => {
  const mapToEntity = (row: ContactRow): ContactEntity => ({
    id: row.id,
    fullName: row.full_name,
    jobTitle: row.job_title,
    phoneNumber: row.phone_number,
    email: row.email,
    isInternal: row.is_internal ?? false,
    linkedUserId: row.linked_user_id,
    organizationId: row.organization_id,
    status: row.status ?? "active",
    notes: row.notes,
    createdAt: new Date(row.created_at || ""),
    updatedAt: new Date(row.updated_at || ""),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = () => supabase.from("contacts") as any;

  return {
    async getAllByOrganization(orgId: string): Promise<ContactEntity[]> {
      const { data, error } = await table()
        .select("*")
        .eq("organization_id", orgId);

      if (error) throw new Error(`[ContactRepo.getAll]: ${error.message}`);
      return ((data as unknown as ContactRow[]) || []).map(mapToEntity);
    },

    async getById(id: string): Promise<ContactEntity | null> {
      const { data, error } = await table().select("*").eq("id", id).single();

      if (error || !data) return null;
      return mapToEntity(data as unknown as ContactRow);
    },

    async create(contact: Partial<ContactEntity>): Promise<ContactEntity> {
      if (
        !contact.fullName ||
        !contact.phoneNumber ||
        !contact.email ||
        !contact.organizationId
      ) {
        throw new Error("[ContactRepo.create]: Missing required fields");
      }

      const insertData: ContactInsert = {
        full_name: contact.fullName,
        job_title: contact.jobTitle ?? null,
        phone_number: contact.phoneNumber,
        email: contact.email,
        is_internal: contact.isInternal ?? false,
        linked_user_id: contact.linkedUserId ?? null,
        organization_id: contact.organizationId,
        status: contact.status ?? "active",
        notes: contact.notes ?? null,
      };

      const { data, error } = await table()
        .insert(insertData)
        .select()
        .single();

      if (error) throw new Error(`[ContactRepo.create]: ${error.message}`);
      return mapToEntity(data as unknown as ContactRow);
    },

    async update(
      id: string,
      contact: Partial<ContactEntity>,
    ): Promise<ContactEntity> {
      const { data, error } = await table()
        .update({
          full_name: contact.fullName,
          job_title: contact.jobTitle,
          phone_number: contact.phoneNumber,
          email: contact.email,
          status: contact.status,
          notes: contact.notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(`[ContactRepo.update]: ${error.message}`);
      return mapToEntity(data as unknown as ContactRow);
    },

    async delete(id: string): Promise<void> {
      const { error } = await table().delete().eq("id", id);
      if (error) throw new Error(`[ContactRepo.delete]: ${error.message}`);
    },
  };
};

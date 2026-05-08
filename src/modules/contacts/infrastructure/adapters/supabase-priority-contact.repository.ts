import { supabase } from "../../../../core/supabase";
import type { PriorityContactEntity } from "../../domain/entities/priority-contact.entity";
import type { PriorityContactRepository } from "../../domain/ports/priority-contact.repository";
import type {
  PriorityContactRow,
  PriorityContactInsert,
} from "../../../../core/types/priority-contacts.sql";

export const createSupabasePriorityContactRepository =
  (): PriorityContactRepository => {
    const mapToEntity = (row: PriorityContactRow): PriorityContactEntity => ({
      id: row.id,
      organizationId: row.organization_id || "",
      contactId: row.contact_id || "",
      priorityLevel: row.priority_level,
      status: row.status ?? "active",
      createdAt: new Date(row.created_at || ""),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = () => supabase.from("organization_priority_contacts") as any;

    return {
      async getByOrganization(orgId: string): Promise<PriorityContactEntity[]> {
        const { data, error } = await table()
          .select("*")
          .eq("organization_id", orgId)
          .order("priority_level", { ascending: true });

        if (error) throw new Error(`[PriorityRepo.getByOrg]: ${error.message}`);
        return ((data as unknown as PriorityContactRow[]) || []).map(
          mapToEntity,
        );
      },

      async assignPriority(
        data: Partial<PriorityContactEntity>,
      ): Promise<PriorityContactEntity> {
        if (
          !data.organizationId ||
          !data.contactId ||
          data.priorityLevel === undefined
        ) {
          throw new Error("[PriorityRepo.assign]: Missing required fields");
        }

        const insertData: PriorityContactInsert = {
          organization_id: data.organizationId,
          contact_id: data.contactId,
          priority_level: data.priorityLevel,
          status: data.status ?? "active",
        };

        const { data: result, error } = await table()
          .insert(insertData)
          .select()
          .single();

        if (error) throw new Error(`[PriorityRepo.assign]: ${error.message}`);
        return mapToEntity(result as unknown as PriorityContactRow);
      },

      async updatePriority(id: string, level: number): Promise<void> {
        const { error } = await table()
          .update({ priority_level: level })
          .eq("id", id);

        if (error) throw new Error(`[PriorityRepo.update]: ${error.message}`);
      },

      async removePriority(id: string): Promise<void> {
        const { error } = await table().delete().eq("id", id);

        if (error) throw new Error(`[PriorityRepo.remove]: ${error.message}`);
      },
    };
  };

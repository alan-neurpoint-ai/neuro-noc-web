import { supabase } from "../../../../core/supabase";
import type { TemporalContextEntity } from "../../domain/entities/temporal-context.entity";
import type {
  TemporalContextRow,
  TemporalContextInsert,
} from "../../../../core/types/temporal-contexts.sql";
import type { TemporalContextRepository } from "../../domain/domain/ports/temporal-context.repository";

export const createSupabaseTemporalContextRepository =
  (): TemporalContextRepository => {
    const mapToEntity = (row: TemporalContextRow): TemporalContextEntity => ({
      id: row.id,
      name: row.name,
      description: row.description,
      affectedNodes: row.affected_nodes,
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      status: (row.status as "active" | "inactive" | "expired") ?? "active",
      organizationId: row.organization_id,
      createdBy: row.created_by,
      deletedBy: row.deleted_by,
      deletionReason: row.deletion_reason,
      createdAt: new Date(row.created_at || ""),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = () => supabase.from("temporal_contexts") as any;

    return {
      async getByOrganization(orgId: string): Promise<TemporalContextEntity[]> {
        const { data, error } = await table()
          .select("*")
          .eq("organization_id", orgId)
          .is("deleted_at", null);

        if (error) throw new Error(`[ContextRepo.getByOrg]: ${error.message}`);
        return ((data as unknown as TemporalContextRow[]) || []).map(
          mapToEntity,
        );
      },

      async getActiveByDate(
        orgId: string,
        date: Date,
      ): Promise<TemporalContextEntity[]> {
        const isoDate = date.toISOString();
        const { data, error } = await table()
          .select("*")
          .eq("organization_id", orgId)
          .is("deleted_at", null)
          .lte("start_date", isoDate)
          .gte("end_date", isoDate);

        if (error) throw new Error(`[ContextRepo.getActive]: ${error.message}`);
        return ((data as unknown as TemporalContextRow[]) || []).map(
          mapToEntity,
        );
      },

      async create(
        context: Partial<TemporalContextEntity>,
      ): Promise<TemporalContextEntity> {
        if (!context.name || !context.startDate || !context.endDate) {
          throw new Error(
            "[ContextRepo.create]: Missing required temporal fields",
          );
        }

        const insertData: TemporalContextInsert = {
          name: context.name,
          description: context.description ?? null,
          affected_nodes: context.affectedNodes
            ? JSON.parse(JSON.stringify(context.affectedNodes))
            : null,
          start_date: context.startDate.toISOString(),
          end_date: context.endDate.toISOString(),
          status: context.status ?? "active",
          organization_id: context.organizationId ?? null,
          created_by: context.createdBy ?? null,
        };

        const { data, error } = await table()
          .insert(insertData)
          .select()
          .single();

        if (error) throw new Error(`[ContextRepo.create]: ${error.message}`);
        return mapToEntity(data as unknown as TemporalContextRow);
      },

      async softDelete(
        id: string,
        userId: string,
        reason: string,
      ): Promise<void> {
        const { error } = await table()
          .update({
            deleted_at: new Date().toISOString(),
            deleted_by: userId,
            deletion_reason: reason,
          })
          .eq("id", id);

        if (error)
          throw new Error(`[ContextRepo.softDelete]: ${error.message}`);
      },
    };
  };

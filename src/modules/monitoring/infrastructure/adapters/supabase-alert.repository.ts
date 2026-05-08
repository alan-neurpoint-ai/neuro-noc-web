import { supabase } from "../../../../core/supabase";
import type {
  AlertEntity,
  AlertCriticality,
  AlertStatus,
} from "../../domain/entities/alert.entity";
import type { AlertRepository } from "../../domain/ports/alert.repository";
import type { AlertRow, AlertInsert } from "../../../../core/types/alerts.sql";

export const createSupabaseAlertRepository = (): AlertRepository => {
  const mapToEntity = (row: AlertRow): AlertEntity => ({
    id: row.id,
    organizationId: row.organization_id,
    hostName: row.host_name,
    triggerId: row.trigger_id,
    issue: row.issue,
    description: row.description,
    recommendations: row.recommendations,
    criticality: row.criticality as AlertCriticality,
    diagnosis: row.diagnosis,
    status: row.status as AlertStatus,
    isSuppressed: row.is_suppressed ?? false,
    createdAt: new Date(row.created_at || ""),
    resolvedAt: row.resolved_at ? new Date(row.resolved_at) : null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = () => supabase.from("alerts") as any;

  return {
    async getActiveByOrganization(orgId: string): Promise<AlertEntity[]> {
      const { data, error } = await table()
        .select("*")
        .eq("organization_id", orgId)
        .eq("status", "PROBLEM")
        .eq("is_suppressed", false)
        .order("criticality", { ascending: false });

      if (error) throw new Error(`[AlertRepo.getActive]: ${error.message}`);
      return ((data as unknown as AlertRow[]) || []).map(mapToEntity);
    },

    async getById(id: string): Promise<AlertEntity | null> {
      const { data, error } = await table().select("*").eq("id", id).single();
      if (error || !data) return null;
      return mapToEntity(data as unknown as AlertRow);
    },

    async create(alert: Partial<AlertEntity>): Promise<AlertEntity> {
      if (
        !alert.organizationId ||
        !alert.hostName ||
        !alert.issue ||
        !alert.criticality
      ) {
        throw new Error("[AlertRepo.create]: Missing required fields");
      }

      const insertData: AlertInsert = {
        organization_id: alert.organizationId,
        host_name: alert.hostName,
        trigger_id: alert.triggerId ?? null,
        issue: alert.issue,
        description: alert.description ?? null,
        recommendations: alert.recommendations ?? null,
        criticality: alert.criticality,
        diagnosis: alert.diagnosis ?? null,
        status: alert.status ?? "PROBLEM",
        is_suppressed: alert.isSuppressed ?? false,
      };

      const { data, error } = await table()
        .insert(insertData)
        .select()
        .single();
      if (error) throw new Error(`[AlertRepo.create]: ${error.message}`);
      return mapToEntity(data as unknown as AlertRow);
    },

    async updateStatus(
      id: string,
      status: AlertStatus,
      resolvedAt?: Date,
    ): Promise<void> {
      const updateData: Record<string, unknown> = { status };
      if (resolvedAt) updateData.resolved_at = resolvedAt.toISOString();

      const { error } = await table().update(updateData).eq("id", id);
      if (error) throw new Error(`[AlertRepo.updateStatus]: ${error.message}`);
    },

    async suppress(id: string, value: boolean): Promise<void> {
      const { error } = await table()
        .update({ is_suppressed: value })
        .eq("id", id);
      if (error) throw new Error(`[AlertRepo.suppress]: ${error.message}`);
    },
  };
};

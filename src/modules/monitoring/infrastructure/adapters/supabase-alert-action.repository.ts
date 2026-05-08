import { supabase } from "../../../../core/supabase";
import type { AlertActionEntity } from "../../domain/entities/alert-action.entity";
import type { AlertActionRepository } from "../../domain/ports/alert-action.repository";
import type {
  AlertActionRow,
  AlertActionInsert,
} from "../../../../core/types/monitoring/alert-actions.sql";

export const createSupabaseAlertActionRepository =
  (): AlertActionRepository => {
    const mapToEntity = (row: AlertActionRow): AlertActionEntity => ({
      id: row.id,
      alertId: row.alert_id,
      actionPerformed: row.action_performed,
      n8nExecutionId: row.n8n_execution_id,
      vapiExecutionId: row.vapi_execution_id,
      emailExecutionId: row.email_execution_id,
      contactId: row.contact_id,
      status: row.status ?? "active",
      createdAt: new Date(row.created_at || ""),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = () => supabase.from("alert_actions") as any;

    return {
      async getByAlert(alertId: string): Promise<AlertActionEntity[]> {
        const { data, error } = await table()
          .select("*")
          .eq("alert_id", alertId)
          .order("created_at", { ascending: false });

        if (error)
          throw new Error(`[AlertActionRepo.getByAlert]: ${error.message}`);
        return ((data as unknown as AlertActionRow[]) || []).map(mapToEntity);
      },

      async logAction(
        action: Partial<AlertActionEntity>,
      ): Promise<AlertActionEntity> {
        if (!action.alertId || !action.actionPerformed) {
          throw new Error(
            "[AlertActionRepo.log]: Missing alertId or actionPerformed",
          );
        }

        const insertData: AlertActionInsert = {
          alert_id: action.alertId,
          action_performed: action.actionPerformed,
          n8n_execution_id: action.n8nExecutionId ?? null,
          vapi_execution_id: action.vapiExecutionId ?? null,
          email_execution_id: action.emailExecutionId ?? null,
          contact_id: action.contactId ?? null,
          status: action.status ?? "active",
        };

        const { data, error } = await table()
          .insert(insertData)
          .select()
          .single();
        if (error) throw new Error(`[AlertActionRepo.log]: ${error.message}`);

        return mapToEntity(data as unknown as AlertActionRow);
      },

      async getExecutionStatus(id: string): Promise<AlertActionEntity | null> {
        const { data, error } = await table().select("*").eq("id", id).single();
        if (error || !data) return null;
        return mapToEntity(data as unknown as AlertActionRow);
      },
    };
  };

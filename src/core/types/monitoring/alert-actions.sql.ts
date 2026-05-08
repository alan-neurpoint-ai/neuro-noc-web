export interface AlertActionRow {
  id: string;
  alert_id: string;
  action_performed: string;
  n8n_execution_id: string | null;
  vapi_execution_id: string | null;
  email_execution_id: string | null;
  contact_id: string | null;
  status: string | null;
  created_at: string | null;
}

export type AlertActionInsert = Omit<AlertActionRow, "id" | "created_at">;

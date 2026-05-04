export interface AlertAction {
  id: string;
  alert_id: string;
  action_performed: string;
  n8n_execution_id: string | null;
  vapi_execution_id: string | null;
  email_execution_id: string | null;
  contact_id: string | null;
  created_at: string;
  status: "active" | "inactive";
}

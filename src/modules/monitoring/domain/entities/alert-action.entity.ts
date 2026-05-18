export interface AlertActionEntity {
  id: string;
  alertId: string;
  actionPerformed: string;
  n8nExecutionId: string | null;
  vapiExecutionId: string | null;
  emailExecutionId: string | null;
  contactId: string | null;
  status: string;
  createdAt: Date;
}

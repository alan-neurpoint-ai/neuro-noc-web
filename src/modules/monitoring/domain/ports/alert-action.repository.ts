import { type AlertActionEntity } from "../entities/alert-action.entity";

export interface AlertActionRepository {
  getByAlert(alertId: string): Promise<AlertActionEntity[]>;
  logAction(action: Partial<AlertActionEntity>): Promise<AlertActionEntity>;
  getExecutionStatus(id: string): Promise<AlertActionEntity | null>;
}

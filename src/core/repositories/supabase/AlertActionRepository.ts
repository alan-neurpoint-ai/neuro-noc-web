import { type AlertAction } from "../../entities/supabase/AlertAction";

export interface AlertActionRepository {
  findAll(alertId: string): Promise<AlertAction[]>;
  findById(id: string): Promise<AlertAction | null>;
  findByExecutionId(executionId: string): Promise<AlertAction | null>;
  create(data: Omit<AlertAction, "id" | "created_at">): Promise<AlertAction>;
  update(
    id: string,
    data: Partial<Omit<AlertAction, "id" | "created_at">>,
  ): Promise<AlertAction>;
  delete(id: string): Promise<void>;
  deleteByAlert(alertId: string): Promise<void>;
}

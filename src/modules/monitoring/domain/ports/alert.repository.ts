import { type AlertEntity } from "../entities/alert.entity";

export interface AlertRepository {
  getActiveByOrganization(orgId: string): Promise<AlertEntity[]>;
  getById(id: string): Promise<AlertEntity | null>;
  create(alert: Partial<AlertEntity>): Promise<AlertEntity>;
  updateStatus(id: string, status: string, resolvedAt?: Date): Promise<void>;
  suppress(id: string, value: boolean): Promise<void>;
}

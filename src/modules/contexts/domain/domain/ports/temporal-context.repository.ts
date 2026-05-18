import type { TemporalContextEntity } from "../../entities/temporal-context.entity";

export interface TemporalContextRepository {
  getByOrganization(orgId: string): Promise<TemporalContextEntity[]>;
  getActiveByDate(orgId: string, date: Date): Promise<TemporalContextEntity[]>;
  create(
    context: Partial<TemporalContextEntity>,
  ): Promise<TemporalContextEntity>;
  softDelete(id: string, userId: string, reason: string): Promise<void>;
}

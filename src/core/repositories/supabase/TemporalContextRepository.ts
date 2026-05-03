import { type TemporalContext } from "../../entities/supabase/TemporalContext";

export interface TemporalContextRepository {
  findAll(organizationId?: string): Promise<TemporalContext[]>;
  findById(id: string): Promise<TemporalContext | null>;
  findActive(organizationId?: string): Promise<TemporalContext[]>;
  findActiveByDate(date: Date): Promise<TemporalContext[]>;
  create(
    data: Omit<TemporalContext, "id" | "created_at" | "deleted_at">,
  ): Promise<TemporalContext>;
  update(
    id: string,
    data: Partial<Omit<TemporalContext, "id" | "created_at" | "deleted_at">>,
  ): Promise<TemporalContext>;
  delete(id: string): Promise<void>;
  softDelete(id: string, deletedBy: string, reason?: string): Promise<void>;
}

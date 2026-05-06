import { type TemporalContext } from "../../core/entities/supabase/TemporalContext";
import type { TemporalContextRepository } from "../../core/repositories/supabase/TemporalContextRepository";

export class TemporalContextService {
  private repository: TemporalContextRepository;
  constructor(repository: TemporalContextRepository) {
    this.repository = repository;
  }

  async getAllByOrganization(
    organizationId?: string,
  ): Promise<TemporalContext[]> {
    return this.repository.findAll(organizationId);
  }
  async fetchActiveContexts(
    organizationId?: string,
  ): Promise<TemporalContext[]> {
    return this.repository.findActive(organizationId);
  }

  async createTemporalContext(
    data: Omit<TemporalContext, "id" | "created_at" | "deleted_at">,
  ): Promise<TemporalContext> {
    // Validación lógica de fechas
    if (new Date(data.start_date) >= new Date(data.end_date)) {
      throw new Error(
        "INVALID_DATE_RANGE: Start date must be before end date.",
      );
    }

    return this.repository.create(data);
  }

  async updateTemporalContext(
    id: string,
    data: Partial<Omit<TemporalContext, "id" | "created_at" | "deleted_at">>,
  ): Promise<TemporalContext> {
    return this.repository.update(id, data);
  }

  async archiveContext(
    id: string,
    userId: string,
    reason?: string,
  ): Promise<void> {
    await this.repository.softDelete(id, userId, reason);
  }
}

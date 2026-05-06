import { type TechnicalDocumentation } from "../../core/entities/supabase/TechnicalDocumentation";
import type { TechnicalDocumentationRepository } from "../../core/repositories/supabase/TechnicalDocumentationRepository";

export class TechnicalDocumentationService {
  private repository: TechnicalDocumentationRepository;

  constructor(repository: TechnicalDocumentationRepository) {
    this.repository = repository;
  }

  async getAllByOrganization(
    organizationId?: string,
  ): Promise<TechnicalDocumentation[]> {
    return this.repository.findAll(organizationId);
  }

  async getDocumentationById(
    id: string,
  ): Promise<TechnicalDocumentation | null> {
    return this.repository.findById(id);
  }

  async registerNewDocumentation(
    data: Omit<TechnicalDocumentation, "id" | "created_at">,
  ): Promise<TechnicalDocumentation> {
    // Verificación de duplicidad por nombre
    const existing = await this.repository.findByName(data.name);
    if (existing) throw new Error(`DOCUMENTATION_ALREADY_EXISTS: ${data.name}`);

    return this.repository.create(data);
  }

  async updateDocumentation(
    id: string,
    data: Partial<Omit<TechnicalDocumentation, "id" | "created_at">>,
  ): Promise<TechnicalDocumentation> {
    return this.repository.update(id, data);
  }

  async setDocumentationStatus(
    id: string,
    status: TechnicalDocumentation["status"],
  ): Promise<void> {
    await this.repository.updateStatus(id, status);
  }

  async removeDocumentation(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

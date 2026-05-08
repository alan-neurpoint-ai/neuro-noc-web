import type { TechnicalDocumentationEntity } from "../domain/entities/technical-documentation.entity";

export interface TechnicalDocumentationRepository {
  getByOrganization(orgId: string): Promise<TechnicalDocumentationEntity[]>;
  getById(id: string): Promise<TechnicalDocumentationEntity | null>;
  create(
    doc: Partial<TechnicalDocumentationEntity>,
  ): Promise<TechnicalDocumentationEntity>;
  updateStatus(id: string, status: string): Promise<void>;
  delete(id: string): Promise<void>;
}

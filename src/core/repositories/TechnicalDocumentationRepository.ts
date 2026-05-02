import { type TechnicalDocumentation } from "../entities/TechnicalDocumentation";

export interface TechnicalDocumentationRepository {
  findAll(organizationId?: string): Promise<TechnicalDocumentation[]>;
  findById(id: string): Promise<TechnicalDocumentation | null>;
  findByName(name: string): Promise<TechnicalDocumentation | null>;
  findByStatus(
    status: TechnicalDocumentation["status"],
  ): Promise<TechnicalDocumentation[]>;
  create(
    data: Omit<TechnicalDocumentation, "id" | "created_at">,
  ): Promise<TechnicalDocumentation>;
  update(
    id: string,
    data: Partial<Omit<TechnicalDocumentation, "id" | "created_at">>,
  ): Promise<TechnicalDocumentation>;
  delete(id: string): Promise<void>;
  updateStatus(
    id: string,
    status: TechnicalDocumentation["status"],
  ): Promise<void>;
}

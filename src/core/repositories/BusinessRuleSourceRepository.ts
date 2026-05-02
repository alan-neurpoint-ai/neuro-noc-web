import { type BusinessRuleSource } from "../entities/BusinessRuleSource";

export interface BusinessRuleSourceRepository {
  findAll(businessRuleId?: string): Promise<BusinessRuleSource[]>;
  findById(id: string): Promise<BusinessRuleSource | null>;
  findByDocumentation(documentationId: string): Promise<BusinessRuleSource[]>;
  create(
    data: Omit<BusinessRuleSource, "id" | "created_at">,
  ): Promise<BusinessRuleSource>;
  update(
    id: string,
    data: Partial<Omit<BusinessRuleSource, "id" | "created_at">>,
  ): Promise<BusinessRuleSource>;
  delete(id: string): Promise<void>;
  deleteByBusinessRule(businessRuleId: string): Promise<void>;
}

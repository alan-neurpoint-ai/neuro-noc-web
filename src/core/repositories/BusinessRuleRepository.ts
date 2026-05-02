import { type BusinessRule } from "../entities/BusinessRule";

export interface BusinessRuleRepository {
  findAll(organizationId?: string): Promise<BusinessRule[]>;
  findById(id: string): Promise<BusinessRule | null>;
  findActive(organizationId?: string): Promise<BusinessRule[]>;
  findByName(name: string): Promise<BusinessRule | null>;
  create(
    data: Omit<BusinessRule, "id" | "created_at" | "updated_at" | "deleted_at">,
  ): Promise<BusinessRule>;
  update(
    id: string,
    data: Partial<
      Omit<BusinessRule, "id" | "created_at" | "updated_at" | "deleted_at">
    >,
  ): Promise<BusinessRule>;
  delete(id: string): Promise<void>;
  softDelete(id: string, deletedBy: string, reason?: string): Promise<void>;
}

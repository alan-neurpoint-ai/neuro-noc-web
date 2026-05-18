import { type BusinessRuleEntity } from "../entities/business-rule.entity";

export interface BusinessRuleRepository {
  getByOrganization(orgId: string): Promise<BusinessRuleEntity[]>;
  getById(id: string): Promise<BusinessRuleEntity | null>;
  create(rule: Partial<BusinessRuleEntity>): Promise<BusinessRuleEntity>;
  update(
    id: string,
    rule: Partial<BusinessRuleEntity>,
  ): Promise<BusinessRuleEntity>;
  softDelete(id: string): Promise<void>;
}

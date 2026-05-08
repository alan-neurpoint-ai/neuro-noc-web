import { type BusinessRuleSourceEntity } from "../entities/business-rule-source.entity";

export interface BusinessRuleSourceRepository {
  getByRule(ruleId: string): Promise<BusinessRuleSourceEntity[]>;
  linkSource(
    data: Partial<BusinessRuleSourceEntity>,
  ): Promise<BusinessRuleSourceEntity>;
  unlinkSource(id: string): Promise<void>;
}

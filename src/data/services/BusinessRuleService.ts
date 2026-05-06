import { type BusinessRule } from "../../core/entities/supabase/BusinessRule";
import type { BusinessRuleRepository } from "../../core/repositories/supabase/BusinessRuleRepository";
import type { BusinessRuleSourceRepository } from "../../core/repositories/supabase/BusinessRuleSourceRepository";

export class BusinessRuleService {
  private ruleRepository: BusinessRuleRepository;
  private sourceRepository?: BusinessRuleSourceRepository;
  constructor(
    ruleRepository: BusinessRuleRepository,
    sourceRepository?: BusinessRuleSourceRepository,
  ) {
    this.ruleRepository = ruleRepository;
    this.sourceRepository = sourceRepository;
  }

  async getRulesByDocumentation(
    documentationId: string,
  ): Promise<BusinessRule[]> {
    if (!this.sourceRepository)
      throw new Error("SOURCE_REPOSITORY_NOT_PROVIDED");
    const sources =
      await this.sourceRepository.findByDocumentation(documentationId);
    if (sources.length === 0) return [];
    const ruleIds = [...new Set(sources.map((s) => s.business_rule_id))].filter(
      Boolean,
    ) as string[];
    const rules = await Promise.all(
      ruleIds.map((id) => this.ruleRepository.findById(id)),
    );

    return rules.filter((r): r is BusinessRule => r !== null);
  }

  async listActiveRules(organizationId?: string): Promise<BusinessRule[]> {
    return this.ruleRepository.findActive(organizationId);
  }

  async defineRule(
    data: Omit<BusinessRule, "id" | "created_at" | "updated_at" | "deleted_at">,
  ): Promise<BusinessRule> {
    const existing = await this.ruleRepository.findByName(data.name);
    if (existing) throw new Error(`RULE_NAME_DUPLICATED: ${data.name}`);

    return this.ruleRepository.create(data);
  }

  async updateRule(
    id: string,
    data: Partial<
      Omit<BusinessRule, "id" | "created_at" | "updated_at" | "deleted_at">
    >,
  ): Promise<BusinessRule> {
    return this.ruleRepository.update(id, data);
  }

  async deactivateRule(
    id: string,
    userId: string,
    reason?: string,
  ): Promise<void> {
    await this.ruleRepository.softDelete(id, userId, reason);
  }

  // Métodos para Fuentes de la Regla (BusinessRuleSource)
  async linkSourceToRule(
    businessRuleId: string,
    documentationId: string,
    snippet: string,
    page?: string,
  ) {
    if (!this.sourceRepository)
      throw new Error("SOURCE_REPOSITORY_NOT_PROVIDED");

    return this.sourceRepository.create({
      business_rule_id: businessRuleId,
      documentation_id: documentationId,
      extracted_snippet: snippet,
      page_reference: page || null,
      status: "active",
    });
  }
}

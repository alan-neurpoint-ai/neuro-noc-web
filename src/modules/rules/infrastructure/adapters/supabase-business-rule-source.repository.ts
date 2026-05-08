import { supabase } from "../../../../core/supabase";
import type { BusinessRuleSourceEntity } from "../../domain/entities/business-rule-source.entity";
import type { BusinessRuleSourceRepository } from "../../domain/ports/business-rule-source.repository";
import type {
  BusinessRuleSourceRow,
  BusinessRuleSourceInsert,
} from "../../../../core/types/business-rule-sources.sql";

export const createSupabaseBusinessRuleSourceRepository =
  (): BusinessRuleSourceRepository => {
    const mapToEntity = (
      row: BusinessRuleSourceRow,
    ): BusinessRuleSourceEntity => ({
      id: row.id,
      businessRuleId: row.business_rule_id || "",
      documentationId: row.documentation_id || "",
      extractedSnippet: row.extracted_snippet,
      status: row.status ?? "active",
      createdAt: new Date(row.created_at || ""),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = () => supabase.from("business_rule_source") as any;

    return {
      async getByRule(ruleId: string): Promise<BusinessRuleSourceEntity[]> {
        const { data, error } = await table()
          .select("*")
          .eq("business_rule_id", ruleId);

        if (error)
          throw new Error(`[RuleSourceRepo.getByRule]: ${error.message}`);
        return ((data as unknown as BusinessRuleSourceRow[]) || []).map(
          mapToEntity,
        );
      },

      async linkSource(
        data: Partial<BusinessRuleSourceEntity>,
      ): Promise<BusinessRuleSourceEntity> {
        if (!data.businessRuleId || !data.documentationId) {
          throw new Error("[RuleSourceRepo.link]: Missing IDs");
        }

        const insertData: BusinessRuleSourceInsert = {
          business_rule_id: data.businessRuleId,
          documentation_id: data.documentationId,
          extracted_snippet: data.extractedSnippet ?? null,
          status: data.status ?? "active",
        };

        const { data: result, error } = await table()
          .insert(insertData)
          .select()
          .single();

        if (error) throw new Error(`[RuleSourceRepo.link]: ${error.message}`);
        return mapToEntity(result as unknown as BusinessRuleSourceRow);
      },

      async unlinkSource(id: string): Promise<void> {
        const { error } = await table().delete().eq("id", id);
        if (error) throw new Error(`[RuleSourceRepo.unlink]: ${error.message}`);
      },
    };
  };

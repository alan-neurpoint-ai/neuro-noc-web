import { supabase } from "../../../../core/supabase";
import type { BusinessRuleEntity } from "../../domain/entities/business-rule.entity";
import type { BusinessRuleRepository } from "../../domain/ports/business-rule.repository";
import type {
  BusinessRuleRow,
  BusinessRuleInsert,
} from "../../../../core/types/business-rules.sql";
import type { Json } from "../../../../core/types/database.types";

export const createSupabaseBusinessRuleRepository =
  (): BusinessRuleRepository => {
    const mapToEntity = (row: BusinessRuleRow): BusinessRuleEntity => ({
      id: row.id,
      name: row.name,
      description: row.description,
      affectedTargets: row.affected_targets,
      executionSchedule: row.execution_schedule,
      status: (row.status as "active" | "inactive" | "draft") || "active",
      organizationId: row.organization_id,
      createdBy: row.created_by,
      updatedBy: row.updated_by,
      createdAt: new Date(row.created_at || ""),
      updatedAt: new Date(row.updated_at || ""),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = () => supabase.from("business_rule") as any;

    return {
      async getByOrganization(orgId: string): Promise<BusinessRuleEntity[]> {
        // Filtramos por organización y excluimos las borradas lógicamente
        const { data, error } = await table()
          .select("*")
          .eq("organization_id", orgId)
          .is("deleted_at", null)
          .order("created_at", { ascending: false });

        if (error) throw new Error(`[RuleRepo.getByOrg]: ${error.message}`);
        return ((data as unknown as BusinessRuleRow[]) || []).map(mapToEntity);
      },

      async getById(id: string): Promise<BusinessRuleEntity | null> {
        const { data, error } = await table()
          .select("*")
          .eq("id", id)
          .is("deleted_at", null)
          .single();

        if (error || !data) return null;
        return mapToEntity(data as unknown as BusinessRuleRow);
      },

      async create(
        rule: Partial<BusinessRuleEntity>,
      ): Promise<BusinessRuleEntity> {
        if (!rule.name || !rule.organizationId) {
          throw new Error("[RuleRepo.create]: Missing required fields");
        }

        const insertData: BusinessRuleInsert = {
          name: rule.name,
          description: rule.description ?? null,
          affected_targets: (rule.affectedTargets as unknown as Json) ?? null,
          execution_schedule: rule.executionSchedule ?? null,
          status: rule.status ?? "active",
          organization_id: rule.organizationId,
          created_by: rule.createdBy ?? null,
          updated_by: rule.updatedBy ?? null,
        };

        const { data, error } = await table()
          .insert(insertData)
          .select()
          .single();

        if (error) throw new Error(`[RuleRepo.create]: ${error.message}`);
        return mapToEntity(data as unknown as BusinessRuleRow);
      },

      async update(
        id: string,
        rule: Partial<BusinessRuleEntity>,
      ): Promise<BusinessRuleEntity> {
        const { data, error } = await table()
          .update({
            name: rule.name,
            description: rule.description,
            affected_targets: rule.affectedTargets,
            execution_schedule: rule.executionSchedule,
            status: rule.status,
            updated_by: rule.updatedBy,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();

        if (error) throw new Error(`[RuleRepo.update]: ${error.message}`);
        return mapToEntity(data as unknown as BusinessRuleRow);
      },

      async softDelete(id: string): Promise<void> {
        const { error } = await table()
          .update({ deleted_at: new Date().toISOString() })
          .eq("id", id);

        if (error) throw new Error(`[RuleRepo.softDelete]: ${error.message}`);
      },
    };
  };

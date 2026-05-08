import { supabase } from "../../../../core/supabase";
import type { AIConfigurationEntity } from "../../domain/entities/ai-configuration.entity";
import type { AIConfigurationRepository } from "../../domain/ports/ai-configuration.repository";
import type {
  AIConfigurationRow,
  AIConfigurationInsert,
} from "../../../../core/types/knowledge/ai-configurations.sql";

export const createSupabaseAIConfigurationRepository =
  (): AIConfigurationRepository => {
    const mapToEntity = (row: AIConfigurationRow): AIConfigurationEntity => {
      const status =
        row.status === "active" ||
        row.status === "inactive" ||
        row.status === "testing"
          ? row.status
          : "active";

      return {
        id: row.id,
        aiName: row.ai_name,
        languages: (row.languages as string[]) || [],
        personalityPrompt: row.personality_prompt,
        status,
        organizationId: row.organization_id,
        createdBy: row.created_by,
        updatedBy: row.updated_by,
        createdAt: new Date(row.created_at || ""),
        updatedAt: new Date(row.updated_at || ""),
      };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = () => supabase.from("ai_configurations") as any;

    return {
      async getByOrganization(orgId: string): Promise<AIConfigurationEntity[]> {
        const { data, error } = await table()
          .select("*")
          .eq("organization_id", orgId)
          .order("ai_name", { ascending: true });

        if (error) throw new Error(`[AIRepo.getByOrg]: ${error.message}`);
        return ((data as unknown as AIConfigurationRow[]) || []).map(
          mapToEntity,
        );
      },

      async getById(id: string): Promise<AIConfigurationEntity | null> {
        const { data, error } = await table().select("*").eq("id", id).single();
        if (error || !data) return null;
        return mapToEntity(data as unknown as AIConfigurationRow);
      },

      async create(
        config: Partial<AIConfigurationEntity>,
      ): Promise<AIConfigurationEntity> {
        if (!config.aiName || !config.personalityPrompt || !config.languages) {
          throw new Error(
            "[AIRepo.create]: Missing required configuration fields",
          );
        }

        const insertData: AIConfigurationInsert = {
          ai_name: config.aiName,
          languages: config.languages as string[],
          personality_prompt: config.personalityPrompt,
          status: config.status ?? "active",
          organization_id: config.organizationId ?? null,
          created_by: config.createdBy ?? null,
          updated_by: config.updatedBy ?? null,
        };

        const { data, error } = await table()
          .insert(insertData)
          .select()
          .single();
        if (error) throw new Error(`[AIRepo.create]: ${error.message}`);
        return mapToEntity(data as unknown as AIConfigurationRow);
      },

      async update(
        id: string,
        config: Partial<AIConfigurationEntity>,
      ): Promise<AIConfigurationEntity> {
        const { data, error } = await table()
          .update({
            ai_name: config.aiName,
            languages: config.languages,
            personality_prompt: config.personalityPrompt,
            status: config.status,
            updated_by: config.updatedBy,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();

        if (error) throw new Error(`[AIRepo.update]: ${error.message}`);
        return mapToEntity(data as unknown as AIConfigurationRow);
      },
    };
  };

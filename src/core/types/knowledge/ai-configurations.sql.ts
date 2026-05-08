export interface AIConfigurationRow {
  id: string;
  ai_name: string;
  languages: string[] | null;
  personality_prompt: string;
  status: string | null;
  organization_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type AIConfigurationInsert = Omit<
  AIConfigurationRow,
  "id" | "created_at" | "updated_at"
>;
export type AIConfigurationUpdate = Partial<AIConfigurationRow>;

export interface AIConfigurationEntity {
  id: string;
  aiName: string;
  languages: string[];
  personalityPrompt: string;
  status: "active" | "inactive" | "testing";
  organizationId: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

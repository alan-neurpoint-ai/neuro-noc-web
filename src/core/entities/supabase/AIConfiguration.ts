export interface AIConfiguration {
  id: string;
  ai_name: string;
  languages: any;
  personality_prompt: string;
  status: "active" | "inactive" | "draft";
  organization_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

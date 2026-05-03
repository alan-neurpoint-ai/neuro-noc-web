import { type AIConfiguration } from "../../entities/supabase/AIConfiguration";

export interface AIConfigurationRepository {
  findAll(organizationId: string): Promise<AIConfiguration[]>;
  findById(id: string): Promise<AIConfiguration | null>;
  findActive(organizationId: string): Promise<AIConfiguration[]>;
  findByName(
    organizationId: string,
    aiName: string,
  ): Promise<AIConfiguration | null>;
  create(
    data: Omit<AIConfiguration, "id" | "created_at" | "updated_at">,
  ): Promise<AIConfiguration>;
  update(
    id: string,
    data: Partial<Omit<AIConfiguration, "id" | "created_at" | "updated_at">>,
  ): Promise<AIConfiguration>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: AIConfiguration["status"]): Promise<void>;
}

import type { AIConfiguration } from "../../core/entities/supabase/AIConfiguration";
import type { AIConfigurationRepository } from "../../core/repositories/supabase/AIConfigurationRepository";

export class AIConfigurationService {
  private repository: AIConfigurationRepository;

  constructor(repository: AIConfigurationRepository) {
    this.repository = repository;
  }

  async getAllConfigurations(
    organizationId: string,
  ): Promise<AIConfiguration[]> {
    return await this.repository.findAll(organizationId);
  }

  async getActiveConfigurations(
    organizationId: string,
  ): Promise<AIConfiguration[]> {
    return await this.repository.findActive(organizationId);
  }

  async getConfigurationById(id: string): Promise<AIConfiguration> {
    const config = await this.repository.findById(id);
    if (!config) throw new Error(`AI Configuration with ID ${id} not found.`);
    return config;
  }

  async createNewConfiguration(
    data: Omit<AIConfiguration, "id" | "created_at" | "updated_at">,
  ): Promise<AIConfiguration> {
    const existing = await this.repository.findByName(
      data.organization_id,
      data.ai_name,
    );
    if (existing) {
      throw new Error(
        `AI with name "${data.ai_name}" already exists in this organization.`,
      );
    }

    return await this.repository.create(data);
  }

  async updateConfiguration(
    id: string,
    data: Partial<Omit<AIConfiguration, "id" | "created_at" | "updated_at">>,
  ): Promise<AIConfiguration> {
    await this.getConfigurationById(id);
    return await this.repository.update(id, data);
  }

  async changeStatus(
    id: string,
    status: AIConfiguration["status"],
  ): Promise<void> {
    await this.getConfigurationById(id);
    await this.repository.updateStatus(id, status);
  }

  async removeConfiguration(id: string): Promise<void> {
    await this.getConfigurationById(id);
    await this.repository.delete(id);
  }
}

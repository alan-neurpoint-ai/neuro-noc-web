import { type AIConfigurationEntity } from "../entities/ai-configuration.entity";

export interface AIConfigurationRepository {
  getByOrganization(orgId: string): Promise<AIConfigurationEntity[]>;
  getById(id: string): Promise<AIConfigurationEntity | null>;
  create(
    config: Partial<AIConfigurationEntity>,
  ): Promise<AIConfigurationEntity>;
  update(
    id: string,
    config: Partial<AIConfigurationEntity>,
  ): Promise<AIConfigurationEntity>;
}

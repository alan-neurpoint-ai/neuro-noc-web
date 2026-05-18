import { type OrganizationEntity } from "../entities/organization.entity";

export interface OrganizationRepository {
  getAll(): Promise<OrganizationEntity[]>;
  getById(id: string): Promise<OrganizationEntity | null>;
  getChildren(parentId: string): Promise<OrganizationEntity[]>;
  create(org: Partial<OrganizationEntity>): Promise<OrganizationEntity>;
}

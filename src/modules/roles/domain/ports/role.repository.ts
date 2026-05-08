import type { RoleEntity } from "../entities/role.entity";

export interface RoleRepository {
  getAll(): Promise<RoleEntity[]>;
  getById(id: string): Promise<RoleEntity | null>;
  getByOrganization(orgId: string): Promise<RoleEntity[]>;
}

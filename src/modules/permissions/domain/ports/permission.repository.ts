import type { PermissionEntity } from "../entities/permission.entity";

export interface PermissionRepository {
  getAll(): Promise<PermissionEntity[]>;
  getById(id: string): Promise<PermissionEntity | null>;
  getByResource(resource: string): Promise<PermissionEntity[]>;
}

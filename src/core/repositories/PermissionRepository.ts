import { type Permission } from "../entities/Permission";

export interface PermissionRepository {
  findAll(): Promise<Permission[]>;
  findById(id: string): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  findByResource(resource: string): Promise<Permission[]>;
  create(data: Omit<Permission, "id" | "created_at">): Promise<Permission>;
  update(
    id: string,
    data: Partial<Omit<Permission, "id" | "created_at">>,
  ): Promise<Permission>;
  delete(id: string): Promise<void>;
}

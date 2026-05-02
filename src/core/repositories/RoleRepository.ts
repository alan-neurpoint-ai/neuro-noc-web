import { type Role } from "../entities/Role";

export interface RoleRepository {
  findAll(organizationId?: string | null): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findByName(
    name: string,
    organizationId?: string | null,
  ): Promise<Role | null>;
  create(data: Omit<Role, "id" | "created_at">): Promise<Role>;
  update(
    id: string,
    data: Partial<Omit<Role, "id" | "created_at">>,
  ): Promise<Role>;
  delete(id: string): Promise<void>;
}

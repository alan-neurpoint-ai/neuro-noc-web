import { type Organization } from "../entities/Organization";

export interface OrganizationRepository {
  findAll(): Promise<Organization[]>;
  findById(id: string): Promise<Organization | null>;
  findBySlug(slug: string): Promise<Organization | null>;
  findActive(): Promise<Organization[]>;
  create(
    data: Omit<Organization, "id" | "created_at" | "updated_at">,
  ): Promise<Organization>;
  update(
    id: string,
    data: Partial<Omit<Organization, "id" | "created_at" | "updated_at">>,
  ): Promise<Organization>;
  delete(id: string): Promise<void>;
}

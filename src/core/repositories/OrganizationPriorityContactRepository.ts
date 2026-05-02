import { type OrganizationPriorityContact } from "../entities/OrganizationPriorityContact";

export interface OrganizationPriorityContactRepository {
  findAll(organizationId: string): Promise<OrganizationPriorityContact[]>;
  findById(id: string): Promise<OrganizationPriorityContact | null>;
  findByPriority(
    organizationId: string,
    priorityLevel: number,
  ): Promise<OrganizationPriorityContact | null>;
  create(
    data: Omit<OrganizationPriorityContact, "id" | "created_at">,
  ): Promise<OrganizationPriorityContact>;
  updatePriorityLevel(id: string, priorityLevel: number): Promise<void>;
  delete(id: string): Promise<void>;
  deleteByContact(organizationId: string, contactId: string): Promise<void>;
}

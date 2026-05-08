import { type PriorityContactEntity } from "../entities/priority-contact.entity";

export interface PriorityContactRepository {
  getByOrganization(orgId: string): Promise<PriorityContactEntity[]>;
  assignPriority(
    data: Partial<PriorityContactEntity>,
  ): Promise<PriorityContactEntity>;
  updatePriority(id: string, level: number): Promise<void>;
  removePriority(id: string): Promise<void>;
}

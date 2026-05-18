export interface PriorityContactEntity {
  id: string;
  organizationId: string;
  contactId: string;
  priorityLevel: number;
  status: string;
  createdAt: Date;
}

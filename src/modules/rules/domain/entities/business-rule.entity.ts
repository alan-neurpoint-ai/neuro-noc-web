export interface BusinessRuleEntity {
  id: string;
  name: string;
  description: string | null;
  affectedTargets: unknown;
  executionSchedule: string | null;
  status: "active" | "inactive" | "draft";
  organizationId: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

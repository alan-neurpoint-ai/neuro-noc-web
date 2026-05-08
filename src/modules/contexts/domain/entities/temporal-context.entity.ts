export interface TemporalContextEntity {
  id: string;
  name: string;
  description: string | null;
  affectedNodes: unknown;
  startDate: Date;
  endDate: Date;
  status: "active" | "inactive" | "expired";
  organizationId: string | null;
  createdBy: string | null;
  deletedBy: string | null;
  deletionReason: string | null;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface OrganizationEntity {
  id: string;
  name: string;
  slug: string;
  parentOrganizationId: string | null;
  orgType: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

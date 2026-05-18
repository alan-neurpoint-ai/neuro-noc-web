export interface RoleEntity {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  organizationId: string | null;
  status: "active" | "inactive" | string;
  createdAt: Date;
}

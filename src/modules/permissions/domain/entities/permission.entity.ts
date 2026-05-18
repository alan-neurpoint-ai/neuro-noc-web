export interface PermissionEntity {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  status: "active" | "inactive" | string;
  createdAt: Date;
}

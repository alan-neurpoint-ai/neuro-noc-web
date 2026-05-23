export interface UserEntity {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  organizationId: string | null;
  roleId: string | null;
  isActive: boolean;
  themePreference: string | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  role?: { name: string } | null;
  organization?: { name: string; status: string } | null;
}

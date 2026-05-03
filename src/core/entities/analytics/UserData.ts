export interface UserData {
  name: string;
  role: string;
  email: string;
  organization: string;
  avatar?: string;
}

export interface UserOrganization {
  id: string;
  name: string;
  slug: string;
}

export interface UserWithOrganization {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  organization_id: string | null;
  role_id: string | null;
  role?: string;
  organization?: UserOrganization;
}

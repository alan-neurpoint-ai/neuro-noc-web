export interface Organization {
  id: string;
  name: string;
  slug: string;
  parent_organization_id: string | null;
  org_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserOrganization {
  id: string;
  name: string;
  slug: string;
}

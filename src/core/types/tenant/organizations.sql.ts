export interface OrganizationRow {
  id: string;
  name: string;
  slug: string;
  parent_organization_id: string | null;
  org_type: string;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export type OrganizationInsert = Omit<
  OrganizationRow,
  "id" | "created_at" | "updated_at"
>;
export type OrganizationUpdate = Partial<OrganizationRow>;

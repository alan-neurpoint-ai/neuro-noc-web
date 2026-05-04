import type { UserOrganization } from "../supabase/Organization";

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

import { supabase } from "../../../../core/supabase";

interface OrganizationRow {
  id: string;
  name: string;
  slug: string;
  parent_organization_id: string | null;
  org_type: string;
  is_active: boolean | null;
}

export const organizationService = {
  async getOrganizationsByParent(parentId: string): Promise<OrganizationRow[]> {
    const { data, error } = await supabase
      .from("organizations")
      .select("id, name, slug, parent_organization_id, org_type, is_active")
      .eq("parent_organization_id", parentId)
      .eq("is_active", true);

    if (error) throw error;
    return data || [];
  },

  async getClientOrganizations(providerId: string): Promise<OrganizationRow[]> {
    const { data, error } = await supabase
      .from("organizations")
      .select("id, name, slug, parent_organization_id, org_type, is_active")
      .eq("parent_organization_id", providerId)
      .eq("org_type", "client")
      .eq("is_active", true);

    if (error) throw error;
    return data || [];
  },

  async getAllActiveOrganizations(): Promise<OrganizationRow[]> {
    const { data, error } = await supabase
      .from("organizations")
      .select("id, name, slug, parent_organization_id, org_type, is_active")
      .eq("is_active", true);

    if (error) throw error;
    return data || [];
  },
};
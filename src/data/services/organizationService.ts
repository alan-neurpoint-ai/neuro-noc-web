import { supabase } from "../sources/supabase";
import type { Organization } from "../../presentation/components/ui/Topbar/Topbar";

export const organizationService = {
  async getUserOrganizationId(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("users")
      .select("organization_id")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data?.organization_id || null;
  },

  async getOrganizationById(orgId: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single();

    if (error) throw error;
    return data;
  },

  async getClientsByParent(parentOrgId: string): Promise<Organization[]> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("parent_organization_id", parentOrgId)
      .eq("org_type", "client")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  buildOrganizationsList(
    adminOrg: Organization,
    clients: Organization[],
  ): Organization[] {
    return [
      { ...adminOrg, isInternal: true },
      ...clients.map((client) => ({ ...client, isInternal: false })),
    ];
  },
};

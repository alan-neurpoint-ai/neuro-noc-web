import { useState, useEffect, useCallback } from "react";
import { organizationService } from "../../data/services/organizationService";
import type { Organization } from "../components/ui/Topbar/Topbar";

export const useOrganizations = (userId?: string) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrganizations = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const adminOrgId =
        await organizationService.getUserOrganizationId(userId);
      if (!adminOrgId) {
        setOrganizations([]);
        return;
      }

      const adminOrg =
        await organizationService.getOrganizationById(adminOrgId);
      if (!adminOrg) return;

      const clients = await organizationService.getClientsByParent(adminOrgId);
      const orgs = organizationService.buildOrganizationsList(
        adminOrg,
        clients,
      );

      setOrganizations(orgs);
      if (orgs.length > 0 && !currentOrg) {
        setCurrentOrg(orgs[0]);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentOrg]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleOrgChange = (org: Organization) => {
    setCurrentOrg(org);
  };

  return {
    organizations,
    currentOrg,
    isLoading,
    handleOrgChange,
    fetchOrganizations,
  };
};

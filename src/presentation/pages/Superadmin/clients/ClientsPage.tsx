import { useEffect, useState, useMemo } from "react";
import { Sidebar, Topbar } from "../../../components/ui/";
import { useAuthStore } from "../../../store/AuthStore";
import { useClients } from "../../../hooks/useClients";
import { useNavigate } from "react-router";
import type { Organization } from "../../../components/ui/Topbar/Topbar";
import { useClientData } from "../../../hooks/useClientData";
import {
  BILLING_COLUMNS,
  MOCK_BILLING_INFO,
} from "../../../utils/billingMockData";
import type { BillingItem } from "../../../../core/entities/analytics";
import { ClientHeader } from "./components/ClientHeader";
import { ClientInfo } from "./components/ClientInfo";
import { ClientStats } from "./components/ClientStats";
import { BillingTable } from "./components/BillingTable";

export default function ClientsPage() {
  const { user, userRole, logout } = useAuthStore();
  const navigate = useNavigate();
  const { clients, fetchClients } = useClients();
  const [selectedClient, setSelectedClient] = useState<Organization | null>(
    null,
  );
  const [billingCurrentPage, setBillingCurrentPage] = useState(1);
  const billingItemsPerPage = 10;

  const { clientStats, selectedClientDetails, isLoadingStats } = useClientData(
    selectedClient,
    clients,
  );

  const organizations: Organization[] = useMemo(() => {
    const clientOrgs = clients.map((client) => ({
      id: client.id,
      name: client.name,
      slug: client.slug,
      parent_organization_id: client.parent_organization_id,
      org_type: client.org_type,
      is_active: client.is_active,
    })) as unknown as Organization[];

    return [
      {
        id: "all",
        name: "Todos los Clientes",
        slug: "all",
        parent_organization_id: null,
        org_type: "view",
        is_active: true,
      } as unknown as Organization,
      ...clientOrgs,
    ];
  }, [clients]);

  const billingData: BillingItem[] = MOCK_BILLING_INFO.map((bill, idx) => ({
    id: `bill-${idx}`,
    period: bill.period,
    invoiceNumber: bill.invoiceNumber,
    amount: bill.amount,
    status: bill.status,
    dueDate: bill.dueDate,
  }));

  const billingTotalPages = Math.ceil(billingData.length / billingItemsPerPage);
  const paginatedBilling = billingData.slice(
    (billingCurrentPage - 1) * billingItemsPerPage,
    billingCurrentPage * billingItemsPerPage,
  );

  useEffect(() => {
    if (organizations.length > 0 && !selectedClient)
      setSelectedClient(organizations[0]);
  }, [organizations, selectedClient]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const handleOrgChange = (org: Organization) => {
    setSelectedClient(org);
    setBillingCurrentPage(1);
  };

  const userData = {
    name:
      `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
      user?.email ||
      "Usuario",
    role:
      userRole === "super_admin"
        ? "Super Administrador"
        : userRole || "Usuario",
    email: user?.email || "",
    organization: "Neuropoint AI",
  };

  const selectedClientName = selectedClient?.name || "Cargando...";
  const resolutionRate =
    clientStats.total > 0
      ? ((clientStats.resolved / clientStats.total) * 100).toFixed(1)
      : "0";

  return (
    <div className="flex h-screen ">
      <Sidebar user={userData} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar
          organizations={organizations}
          currentOrg={selectedClient || organizations[0]}
          onOrgChange={handleOrgChange}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            <ClientHeader
              selectedClientId={selectedClient?.id}
              selectedClientName={selectedClientName}
            />

            {selectedClient?.id !== "all" && selectedClientDetails && (
              <ClientInfo details={selectedClientDetails} />
            )}

            <ClientStats
              stats={clientStats}
              resolutionRate={resolutionRate}
              isLoadingStats={isLoadingStats}
              selectedClientName={selectedClientName}
            />

            {selectedClient?.id !== "all" && (
              <BillingTable
                data={paginatedBilling}
                columns={BILLING_COLUMNS}
                currentPage={billingCurrentPage}
                totalPages={billingTotalPages}
                onPageChange={setBillingCurrentPage}
                isLoading={isLoadingStats}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

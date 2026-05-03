import { useEffect, useState } from "react";
import { Sidebar, Card, Table } from "../../components/ui/";
import { useAuthStore } from "../../store/AuthStore";
import { useNavigate } from "react-router";

import {
  HiOfficeBuilding,
  HiBell,
  HiChip,
  HiChartBar,
  HiTrendingUp,
  HiCheckCircle,
  HiXCircle,
  HiUserGroup,
} from "react-icons/hi";
import { supabase } from "../../../data/sources/supabase";

interface ClientStats {
  totalClients: number;
  activeClients: number;
  totalAlerts: number;
  criticalAlerts: number;
  totalAiConfigs: number;
}

interface Client {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  alertCount?: number;
  criticalAlertCount?: number;
}

export default function SuperadminPage() {
  const { user, userRole, logout } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ClientStats>({
    totalClients: 0,
    activeClients: 0,
    totalAlerts: 0,
    criticalAlerts: 0,
    totalAiConfigs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const { data: clientsData, error: clientsError } = await supabase
        .from("organizations")
        .select("*")
        .eq("org_type", "client")
        .order("created_at", { ascending: false });

      if (!clientsError && clientsData) {
        const activeClients = clientsData.filter((c) => c.is_active).length;
        setStats((prev) => ({
          ...prev,
          totalClients: clientsData.length,
          activeClients: activeClients,
        }));
        setClients(clientsData);
      }

      const { data: alerts, error: alertError } = await supabase
        .from("alerts")
        .select("criticality, status, organization_id");

      if (!alertError && alerts) {
        const totalAlerts = alerts.length;
        const criticalAlerts = alerts.filter(
          (a) => a.criticality === "Critical" && a.status !== "RESOLVED",
        ).length;

        setStats((prev) => ({
          ...prev,
          totalAlerts: totalAlerts,
          criticalAlerts: criticalAlerts,
        }));

        if (clientsData) {
          const clientsWithAlerts = clientsData.map((client) => {
            const clientAlerts = alerts.filter(
              (a) => a.organization_id === client.id,
            );
            return {
              ...client,
              alertCount: clientAlerts.length,
              criticalAlertCount: clientAlerts.filter(
                (a) => a.criticality === "Critical" && a.status !== "RESOLVED",
              ).length,
            };
          });
          setClients(clientsWithAlerts);
        }
      }

      const { count: aiConfigs, error: aiError } = await supabase
        .from("ai_configurations")
        .select("*", { count: "exact", head: true });

      if (!aiError) {
        setStats((prev) => ({
          ...prev,
          totalAiConfigs: aiConfigs || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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

  const columns = [
    {
      header: "Nombre",
      accessor: (item: Client) => (
        <span className="font-medium text-text-primary">{item.name}</span>
      ),
    },
    {
      header: "Slug",
      accessor: "slug" as keyof Client,
    },
    {
      header: "Estado",
      accessor: (item: Client) => (
        <span
          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            item.is_active
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {item.is_active ? (
            <HiCheckCircle size={12} />
          ) : (
            <HiXCircle size={12} />
          )}
          {item.is_active ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      header: "Alertas",
      accessor: (item: Client) => <span>{item.alertCount || 0}</span>,
    },
    {
      header: "Críticas",
      accessor: (item: Client) => (
        <span
          className={
            item.criticalAlertCount && item.criticalAlertCount > 0
              ? "text-red-400 font-bold"
              : "text-text-secondary"
          }
        >
          {item.criticalAlertCount || 0}
        </span>
      ),
    },
    {
      header: "Fecha Creación",
      accessor: (item: Client) => (
        <span>{new Date(item.created_at).toLocaleDateString()}</span>
      ),
    },
  ];

  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const paginatedClients = clients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen">
      <Sidebar user={userData} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2">
              Panel de Control <span className="text-accent">Superadmin</span>
            </h1>
            <p className="text-text-muted">
              Visión general de todos los clientes y operaciones del sistema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card
              title="Clientes Totales"
              value={stats.totalClients}
              icon={<HiOfficeBuilding size={20} />}
            />
            <Card
              title="Clientes Activos"
              value={stats.activeClients}
              icon={<HiUserGroup size={20} />}
            />
            <Card
              title="Alertas Totales"
              value={stats.totalAlerts}
              icon={<HiBell size={20} />}
            />
            <Card
              title="Alertas Críticas"
              value={stats.criticalAlerts}
              icon={<HiTrendingUp size={20} />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card
              title="Configuraciones IA"
              value={stats.totalAiConfigs}
              icon={<HiChip size={20} />}
              subtitle="Asistentes IA configurados en el sistema"
            />

            <Card
              title="Tasa de Alertas Críticas"
              value={`${
                stats.totalAlerts > 0
                  ? ((stats.criticalAlerts / stats.totalAlerts) * 100).toFixed(
                      1,
                    )
                  : 0
              }%`}
              icon={<HiChartBar size={20} />}
              subtitle="Porcentaje de alertas críticas sobre total"
            />
          </div>

          <Table
            data={paginatedClients}
            columns={columns}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

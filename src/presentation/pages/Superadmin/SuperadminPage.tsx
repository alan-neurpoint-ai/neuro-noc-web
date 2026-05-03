import { useEffect, useState } from "react";
import { Sidebar, Card, Table } from "../../components/ui/";
import { useAuthStore } from "../../store/AuthStore";
import { useSuperadminAnalytics } from "../../hooks/useSuperadminAnalytics";
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

export default function SuperadminPage() {
  const { user, userRole, logout } = useAuthStore();
  const navigate = useNavigate();
  const { stats, clients, isLoading, fetchAnalytics } =
    useSuperadminAnalytics();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

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

  const columns: any[] = [
    {
      header: "Nombre",
      accessor: (item: any) => (
        <span className="font-medium text-text-primary">{item.name}</span>
      ),
    },
    {
      header: "Slug",
      accessor: (item: any) => <span>{item.slug}</span>,
    },
    {
      header: "Estado",
      accessor: (item: any) => (
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
      accessor: (item: any) => <span>{item.alertCount || 0}</span>,
    },
    {
      header: "Críticas",
      accessor: (item: any) => (
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
      accessor: (item: any) => (
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

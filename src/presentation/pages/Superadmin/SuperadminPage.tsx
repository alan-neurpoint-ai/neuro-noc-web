import { useEffect, useState } from "react";
import { Sidebar, Card, Table } from "../../components/ui/";
import { useSuperadminAnalytics } from "../../hooks/useSuperadminAnalytics";
import { useUserData } from "../../hooks/useUserData";
import { useAuthStore } from "../../store/AuthStore";
import { useNavigate } from "react-router";
import {
  HiOfficeBuilding,
  HiBell,
  HiChip,
  HiChartBar,
  HiTrendingUp,
  HiUserGroup,
} from "react-icons/hi";
import { columns } from "./columns";

export default function SuperadminPage() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { stats, clients, isLoading, fetchAnalytics } =
    useSuperadminAnalytics();
  const { userData, isLoading: isLoadingUser } = useUserData();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isLoadingUser) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar user={userData} onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-accent animate-pulse">
            Cargando información del usuario...
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const paginatedClients = clients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resolutionRate =
    stats.totalAlerts > 0
      ? (
          ((stats.totalAlerts - stats.criticalAlerts) / stats.totalAlerts) *
          100
        ).toFixed(1)
      : "100";

  return (
    <div className="flex h-screen bg-linear-to-br  to-accent/5">
      <Sidebar user={userData} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto p-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-8 bg-accent rounded-full" />
                <h1 className="text-4xl font-black tracking-tighter bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                  Panel de Control{" "}
                  <span className="text-accent">Superadmin</span>
                </h1>
              </div>
              <p className="text-text-muted text-sm ml-3">
                Visión general de todos los clientes y operaciones del sistema
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <Card
                title="Clientes Totales"
                value={stats.totalClients}
                icon={<HiOfficeBuilding size={20} />}
                subtitle="Organizaciones registradas"
              />
              <Card
                title="Clientes Activos"
                value={stats.activeClients}
                icon={<HiUserGroup size={20} />}
                subtitle={`${((stats.activeClients / stats.totalClients) * 100 || 0).toFixed(0)}% del total`}
              />
              <Card
                title="Alertas Totales"
                value={stats.totalAlerts}
                icon={<HiBell size={20} />}
                subtitle="Histórico de incidentes"
              />
              <Card
                title="Alertas Críticas"
                value={stats.criticalAlerts}
                icon={<HiTrendingUp size={20} />}
                subtitle="Requieren atención inmediata"
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
                title="Tasa de Resolución"
                value={`${resolutionRate}%`}
                icon={<HiChartBar size={20} />}
                subtitle="Alertas resueltas exitosamente"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="p-1.5 bg-accent/10 rounded-lg">
                  <HiUserGroup className="text-accent text-sm" />
                </div>
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-accent font-black">
                  Clientes del Sistema
                </h2>
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
      </div>
    </div>
  );
}

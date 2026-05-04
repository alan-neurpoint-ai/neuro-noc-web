import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelectedClient } from "../context/SelectedClientContext";
import { AlertStatsCards } from "../components/Alerts/AlertStatsCards";
import { AlertChart } from "../components/Alerts/AlertChart";
import { useAlerts } from "../../../hooks/useAlerts";
import { Table } from "../../../components/ui";
import { getAlertColumns } from "../../../utils/alertColumns";

export default function AdminAlerts() {
  const navigate = useNavigate();
  const { selectedClient } = useSelectedClient();
  const { alerts, stats, alertsOverTime, isLoading } = useAlerts(
    selectedClient?.id,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(alerts.length / itemsPerPage);
  const paginatedAlerts = alerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const clientName = selectedClient?.isInternal
    ? "todos los clientes"
    : selectedClient?.name || "seleccionada";

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-8 bg-accent rounded-full" />
          <h1 className="text-4xl font-black tracking-tighter bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
            Alertas de <span className="text-accent">{clientName}</span>
          </h1>
        </div>
        <p className="text-text-muted text-sm ml-3">
          Monitoreo y gestión de alertas del sistema
        </p>
      </div>

      <AlertStatsCards
        total={stats.total}
        critical={stats.critical}
        resolved={stats.resolved}
        pending={stats.pending}
      />

      {alertsOverTime.length > 0 && <AlertChart data={alertsOverTime} />}

      <Table
        data={paginatedAlerts}
        columns={getAlertColumns(navigate)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />
    </div>
  );
}

import { HiEye } from "react-icons/hi";
import { type NavigateFunction } from "react-router";
import {
  getCriticalityColor,
  getStatusColor,
  getStatusText,
} from "./alertColors";
import type { Alert } from "../../core/entities/supabase/Alert";

export const getAlertColumns = (navigate: NavigateFunction) => {
  const handleViewAlert = (alertId: string) => {
    navigate(`/dashboard/admin/alertas/${alertId}`);
  };

  return [
    {
      header: "Host",
      accessor: (item: Alert) => (
        <span className="font-medium text-text-primary">{item.host_name}</span>
      ),
    },
    {
      header: "Problema",
      accessor: (item: Alert) => (
        <div className="max-w-xs truncate" title={item.issue}>
          {item.issue}
        </div>
      ),
    },
    {
      header: "Criticidad",
      accessor: (item: Alert) => (
        <span
          className={`text-xs px-2 py-1 rounded-full border ${getCriticalityColor(item.criticality)}`}
        >
          {item.criticality}
        </span>
      ),
    },
    {
      header: "Estado",
      accessor: (item: Alert) => (
        <span
          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}
        >
          {getStatusText(item.status)}
        </span>
      ),
    },
    {
      header: "Fecha",
      accessor: (item: Alert) => (
        <span className="text-text-secondary text-sm">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Acciones",
      accessor: (item: Alert) => (
        <button
          onClick={() => handleViewAlert(item.id)}
          className="flex items-center gap-1 px-2 py-1 rounded-sm text-accent hover:bg-accent/20 transition-colors"
        >
          <HiEye size={16} />
          <span className="text-xs">Ver</span>
        </button>
      ),
    },
  ];
};

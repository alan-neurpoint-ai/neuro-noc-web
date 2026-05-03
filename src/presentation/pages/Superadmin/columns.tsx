import { HiCheckCircle, HiXCircle } from "react-icons/hi";

export const columns: any[] = [
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
        {item.is_active ? <HiCheckCircle size={12} /> : <HiXCircle size={12} />}
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

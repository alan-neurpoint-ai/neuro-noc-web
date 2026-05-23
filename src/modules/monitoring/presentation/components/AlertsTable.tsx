import { BiTable, BiError, BiCheckCircle, BiXCircle } from 'react-icons/bi';
import { DataTable } from '../../../../core/presentation/components/ui/DataTable';
import { AlertRow } from '../../../../core/types/monitoring/alerts.sql';

interface AlertsTableProps {
  alerts: AlertRow[];
  onRowClick: (alert: AlertRow) => void;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getCriticalityBadge = (criticality: string) => {
  switch (criticality?.toLowerCase()) {
    case 'critical':
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
          Crítico
        </span>
      );
    case 'high':
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase">
          Alto
        </span>
      );
    case 'medium':
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
          Medio
        </span>
      );
    case 'low':
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
          Bajo
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-hover-bg text-text-muted border border-border-default uppercase">
          {criticality || '-'}
        </span>
      );
  }
};

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'resolved':
      return (
        <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
          <BiCheckCircle /> Resuelto
        </span>
      );
    case 'active':
      return (
        <span className="flex items-center gap-1 text-amber-400 text-xs font-medium">
          <BiError /> Activo
        </span>
      );
    default:
      return <span className="text-text-muted text-xs">{status || '-'}</span>;
  }
};

export const AlertsTable = ({ alerts, onRowClick }: AlertsTableProps) => {
  const columns = [
    {
      header: 'Problema',
      accessor: (item: AlertRow) => (
        <div className="flex items-center gap-2">
          <BiError className="text-amber-400" />
          <span className="text-text-main font-medium">{item.issue}</span>
        </div>
      ),
    },
    {
      header: 'Host',
      accessor: 'host_name' as keyof AlertRow,
      className: 'text-text-muted font-mono text-xs',
    },
    {
      header: 'Criticidad',
      accessor: (item: AlertRow) => getCriticalityBadge(item.criticality),
    },
    {
      header: 'Estado',
      accessor: (item: AlertRow) => getStatusBadge(item.status),
    },
    {
      header: 'Fecha',
      accessor: (item: AlertRow) => (
        <span className="text-text-muted text-xs font-mono">
          {formatDate(item.created_at)}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
        <BiTable className="text-brand-accent" />
        Todas las Alertas
        <span className="text-xs font-normal text-text-muted ml-2">
          ({alerts.length} registros)
        </span>
      </h3>

      {alerts.length > 0 ? (
        <DataTable
          columns={columns}
          data={alerts}
          isLoading={false}
          onRowClick={onRowClick}
        />
      ) : (
        <div className="text-center py-12">
          <BiXCircle className="text-6xl text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">No hay alertas registradas</p>
        </div>
      )}
    </div>
  );
};

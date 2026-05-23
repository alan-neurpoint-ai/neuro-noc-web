import { BiError, BiTime, BiCheckCircle } from 'react-icons/bi';
import { AlertRow } from '../../../../core/types/monitoring/alerts.sql';

interface AlertInfoCardProps {
  alert: AlertRow;
  updatingStatus: boolean;
  onStatusChange: (status: string) => void;
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
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
          Crítico
        </span>
      );
    case 'high':
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase">
          Alto
        </span>
      );
    case 'medium':
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
          Medio
        </span>
      );
    case 'low':
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
          Bajo
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-hover-bg text-text-muted border border-border-default uppercase">
          {criticality || '-'}
        </span>
      );
  }
};

const getStatusBadge = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case 'resolved':
      return (
        <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
          <BiCheckCircle /> Resuelto
        </span>
      );
    case 'active':
      return (
        <span className="flex items-center gap-1 text-amber-400 text-sm font-medium">
          <BiError /> Activo
        </span>
      );
    default:
      return <span className="text-text-muted text-sm">{status || '-'}</span>;
  }
};

export const AlertInfoCard = ({
  alert,
  updatingStatus,
  onStatusChange,
}: AlertInfoCardProps) => {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <BiError className="text-4xl text-amber-400" />
          <div>
            <h2 className="text-xl font-bold text-text-main">{alert.issue}</h2>
            <p className="text-sm text-text-muted font-mono">{alert.host_name}</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          {getCriticalityBadge(alert.criticality)}
          {alert.status?.toLowerCase() === 'resolved' ? (
            getStatusBadge(alert.status)
          ) : (
            <select
              value={alert.status || ''}
              onChange={(e) => onStatusChange(e.target.value)}
              disabled={updatingStatus}
              className="bg-hover-bg border border-border-default rounded-lg px-3 py-1.5 text-sm text-text-main focus:outline-none focus:border-brand-accent disabled:opacity-50"
            >
              <option value="sin resolver" className="bg-bg-surface">
                Sin resolver
              </option>
              <option value="pending" className="bg-bg-surface">
                Pendiente
              </option>
              <option value="resolved" className="bg-bg-surface">
                Resuelto
              </option>
              <option value="discarded" className="bg-bg-surface">
                Descartado
              </option>
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Descripción
            </label>
            <p className="text-text-main mt-1">
              {alert.description || 'Sin descripción'}
            </p>
          </div>
          {alert.diagnosis && (
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Diagnóstico
              </label>
              <p className="text-text-main mt-1">{alert.diagnosis}</p>
            </div>
          )}
          {alert.recommendations && (
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Recomendaciones
              </label>
              <p className="text-text-main mt-1">{alert.recommendations}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Trigger ID
            </label>
            <p className="text-text-muted font-mono text-sm mt-1">
              {alert.trigger_id || '-'}
            </p>
          </div>
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Fecha de Creación
            </label>
            <p className="text-text-main mt-1 flex items-center gap-2">
              <BiTime className="text-text-muted" />
              {formatDate(alert.created_at)}
            </p>
          </div>
          {alert.resolved_at && (
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Fecha de Resolución
              </label>
              <p className="text-emerald-400 mt-1 flex items-center gap-2">
                <BiCheckCircle />
                {formatDate(alert.resolved_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

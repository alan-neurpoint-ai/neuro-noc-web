import {
  BiListUl,
  BiPhone,
  BiEnvelope,
  BiRun,
  BiUser,
  BiFile,
} from 'react-icons/bi';
import { AlertActionRow } from '../../../../core/types/monitoring/alert-actions.sql';
import { ContactRow } from '../../../../core/types/tenant/contacts.sql';

interface AlertActionWithContact extends AlertActionRow {
  contact?: ContactRow | null;
}

interface AlertActionsListProps {
  actions: AlertActionWithContact[];
  onOpenTranscript: (vapiId: string | null) => void;
  onOpenAudio: (vapiId: string | null) => void;
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

const getStatusBadge = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return (
        <span className="flex items-center gap-1 text-blue-400 text-xs">
          <BiRun /> Completado
        </span>
      );
    case 'active':
      return (
        <span className="flex items-center gap-1 text-amber-400 text-xs">
          <BiRun /> Activo
        </span>
      );
    default:
      return <span className="text-white/40 text-xs">{status || '-'}</span>;
  }
};

const getActionIcon = (action: string) => {
  const lower = action?.toLowerCase() || '';
  if (lower.includes('llamada') || lower.includes('transferencia'))
    return <BiPhone className="text-emerald-400" />;
  if (lower.includes('correo') || lower.includes('email'))
    return <BiEnvelope className="text-blue-400" />;
  return <BiRun className="text-amber-400" />;
};

const isCallAction = (action: string) => {
  const lower = action?.toLowerCase() || '';
  return lower.includes('llamada') || lower.includes('transferencia');
};

export const AlertActionsList = ({
  actions,
  onOpenTranscript,
  onOpenAudio,
}: AlertActionsListProps) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <BiListUl className="text-brand-accent" />
        Acciones Realizadas
        <span className="text-xs font-normal text-white/40 ml-2">
          ({actions.length} registros)
        </span>
      </h3>

      {actions.length > 0 ? (
        <div className="space-y-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    {getActionIcon(action.action_performed)}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {action.action_performed}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(action.status)}
                      {action.n8n_execution_id && (
                        <span className="text-xs text-white/40 font-mono">
                          n8n: {action.n8n_execution_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-white/40 font-mono">
                  {formatDate(action.created_at)}
                </span>
              </div>

              {action.contact && (
                <div className="mt-3 pl-11 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <BiUser className="text-white/40" />
                    <span>{action.contact.full_name}</span>
                  </div>
                  {action.contact.email && (
                    <div className="flex items-center gap-2 text-white/60">
                      <BiEnvelope className="text-white/40" />
                      <span>{action.contact.email}</span>
                    </div>
                  )}
                  {action.contact.phone_number && (
                    <div className="flex items-center gap-2 text-white/60">
                      <BiPhone className="text-white/40" />
                      <span>{action.contact.phone_number}</span>
                    </div>
                  )}
                </div>
              )}

              {isCallAction(action.action_performed) && (
                <div className="mt-3 pl-11 flex gap-2">
                  <button
                    onClick={() => onOpenTranscript(action.vapi_execution_id)}
                    className="px-3 py-1.5 text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition flex items-center gap-1"
                  >
                    <BiFile className="text-sm" />
                    Leer transcripción
                  </button>
                  {action.vapi_execution_id && (
                    <button
                      onClick={() => onOpenAudio(action.vapi_execution_id)}
                      className="px-3 py-1.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition flex items-center gap-1"
                    >
                      <BiPhone className="text-sm" />
                      Escuchar llamada
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <BiListUl className="text-4xl text-white/10 mx-auto mb-2" />
          <p className="text-white/40">No hay acciones registradas</p>
        </div>
      )}
    </div>
  );
};

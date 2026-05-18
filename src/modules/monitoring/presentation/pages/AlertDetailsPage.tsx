import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  BiArrowBack,
  BiError,
  BiCheckCircle,
  BiTime,
  BiUser,
  BiPhone,
  BiEnvelope,
  BiListUl,
  BiRun,
  BiFile,
} from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { AlertRow } from '../../../../core/types/monitoring/alerts.sql';
import { AlertActionRow } from '../../../../core/types/monitoring/alert-actions.sql';
import { ContactRow } from '../../../../core/types/tenant/contacts.sql';
import { VapiModal } from '../components/VapiModal';

interface AlertActionWithContact extends AlertActionRow {
  contact?: ContactRow | null;
}

export const AlertDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, selectedOrganization } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertRow | null>(null);
  const [actions, setActions] = useState<AlertActionWithContact[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Estados para VAPI modal
  const [vapiModalOpen, setVapiModalOpen] = useState(false);
  const [vapiModalType, setVapiModalType] = useState<
    'transcript' | 'audio' | null
  >(null);
  const [vapiCallId, setVapiCallId] = useState<string | null>(null);

  const targetOrgId = selectedOrganization?.id || user?.organizationId;

  const updateAlertStatus = async (newStatus: string) => {
    if (!alert) return;
    setUpdatingStatus(true);
    try {
      const updateObj =
        newStatus === 'resolved'
          ? { status: newStatus, resolved_at: new Date().toISOString() }
          : { status: newStatus };

      const { error } = await supabase
        .from('alerts')
        .update(updateObj as never)
        .eq('id', alert.id);

      if (error) throw error;
      setAlert((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              ...(newStatus === 'resolved'
                ? { resolved_at: new Date().toISOString() }
                : {}),
            }
          : null
      );
    } catch (error) {
      console.error('Error updating alert status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openVapiTranscript = (vapiId: string | null) => {
    if (vapiId) {
      setVapiCallId(vapiId);
      setVapiModalType('transcript');
      setVapiModalOpen(true);
    }
  };

  const openVapiAudio = (vapiId: string | null) => {
    if (vapiId) {
      setVapiCallId(vapiId);
      setVapiModalType('audio');
      setVapiModalOpen(true);
    }
  };

  const closeVapiModal = () => {
    setVapiModalOpen(false);
    setVapiModalType(null);
    setVapiCallId(null);
  };

  // Función para obtener organizaciones (padre + hijos)
  const getOrganizationIds = async (orgId: string): Promise<string[]> => {
    const ids = [orgId];

    const { data: children } = await supabase
      .from('organizations')
      .select('id')
      .eq('parent_organization_id', orgId)
      .eq('is_active', true);

    const childList = children as { id: string }[] | null;
    if (childList && childList.length > 0) {
      ids.push(...childList.map((c) => c.id));
    }

    return ids;
  };

  useEffect(() => {
    if (!id || !targetOrgId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener organizaciones (padre + hijos)
        const allOrgIds = await getOrganizationIds(targetOrgId);

        // Fetch alert - buscar en todas las orgs si tiene hijos
        let query = supabase.from('alerts').select('*').eq('id', id);

        if (allOrgIds.length > 1) {
          query = query.in('organization_id', allOrgIds);
        } else {
          query = query.eq('organization_id', targetOrgId);
        }

        const { data: alertData, error: alertError } = await query.single();

        if (alertError) throw alertError;
        setAlert(alertData as AlertRow);

        // Fetch alert actions
        const { data: actionsData, error: actionsError } = await supabase
          .from('alert_actions')
          .select('*')
          .eq('alert_id', id)
          .order('created_at', { ascending: false });

        if (actionsError) throw actionsError;

        // Fetch contacts for each action
        const actionsWithContacts = await Promise.all(
          (actionsData || []).map(async (action: AlertActionRow) => {
            let contact = null;
            if (action.contact_id) {
              const { data: contactData } = await supabase
                .from('contacts')
                .select('*')
                .eq('id', action.contact_id)
                .single();
              contact = contactData as ContactRow | null;
            }
            return { ...action, contact };
          })
        );

        setActions(actionsWithContacts);
      } catch (error) {
        console.error('Error loading alert details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, targetOrgId]);

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
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-white/10 text-white/50 border border-white/20 uppercase">
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
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-blue-400 text-sm font-medium">
            <BiCheckCircle /> Completado
          </span>
        );
      default:
        return <span className="text-white/40 text-sm">{status || '-'}</span>;
    }
  };

  const getActionIcon = (action: string) => {
    const lower = action?.toLowerCase() || '';
    if (lower.includes('llamada') || lower.includes('transferencia')) {
      return <BiPhone className="text-emerald-400" />;
    }
    if (lower.includes('correo') || lower.includes('email')) {
      return <BiEnvelope className="text-blue-400" />;
    }
    return <BiRun className="text-amber-400" />;
  };

  const isCallAction = (action: string) => {
    const lower = action?.toLowerCase() || '';
    return lower.includes('llamada') || lower.includes('transferencia');
  };

  if (loading) {
    return <Loading message="Cargando detalles de alerta..." />;
  }

  if (!alert) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <BiError className="text-6xl text-white/20 mb-4" />
        <p className="text-white/40 text-lg">Alerta no encontrada</p>
        <button
          onClick={() => navigate('/dashboard/monitoring-alerts')}
          className="mt-4 px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/80 transition"
        >
          Volver a alertas
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/monitoring-alerts')}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-white/60 hover:text-white"
        >
          <BiArrowBack className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
            Detalles de Alerta
          </h1>
          <p className="text-sm text-white/40 font-headline">
            Información completa y acciones
          </p>
        </div>
      </div>

      {/* Info Principal */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <BiError className="text-4xl text-amber-400" />
            <div>
              <h2 className="text-xl font-bold text-white">{alert.issue}</h2>
              <p className="text-sm text-white/40 font-mono">
                {alert.host_name}
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            {getCriticalityBadge(alert.criticality)}
            {alert.status?.toLowerCase() === 'resolved' ? (
              getStatusBadge(alert.status)
            ) : (
              <select
                value={alert.status || ''}
                onChange={(e) => updateAlertStatus(e.target.value)}
                disabled={updatingStatus}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-accent disabled:opacity-50"
              >
                <option value="sin resolver" className="bg-gray-800">
                  Sin resolver
                </option>
                <option value="pending" className="bg-gray-800">
                  Pendiente
                </option>
                <option value="resolved" className="bg-gray-800">
                  Resuelto
                </option>
                <option value="discarded" className="bg-gray-800">
                  Descartado
                </option>
              </select>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                Descripción
              </label>
              <p className="text-white/80 mt-1">
                {alert.description || 'Sin descripción'}
              </p>
            </div>
            {alert.diagnosis && (
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                  Diagnóstico
                </label>
                <p className="text-white/80 mt-1">{alert.diagnosis}</p>
              </div>
            )}
            {alert.recommendations && (
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                  Recomendaciones
                </label>
                <p className="text-white/80 mt-1">{alert.recommendations}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                Trigger ID
              </label>
              <p className="text-white/60 font-mono text-sm mt-1">
                {alert.trigger_id || '-'}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                Fecha de Creación
              </label>
              <p className="text-white/80 mt-1 flex items-center gap-2">
                <BiTime className="text-white/40" />
                {formatDate(alert.created_at)}
              </p>
            </div>
            {alert.resolved_at && (
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
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
      </Card>

      {/* Acciones */}
      <Card className="p-6">
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

                {/* Botones para llamadas */}
                {isCallAction(action.action_performed) && (
                  <div className="mt-3 pl-11 flex gap-2">
                    <button
                      onClick={() =>
                        openVapiTranscript(action.vapi_execution_id)
                      }
                      className="px-3 py-1.5 text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition flex items-center gap-1"
                    >
                      <BiFile className="text-sm" />
                      Leer transcripción
                    </button>
                    {action.vapi_execution_id && (
                      <button
                        onClick={() => openVapiAudio(action.vapi_execution_id)}
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
      </Card>

      {/* VAPI Modal para transcripción y audio */}
      <VapiModal
        isOpen={vapiModalOpen}
        type={vapiModalType}
        vapiId={vapiCallId}
        onClose={closeVapiModal}
      />
    </div>
  );
};

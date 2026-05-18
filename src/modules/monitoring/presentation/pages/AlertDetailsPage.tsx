import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { BiArrowBack, BiError } from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { AlertRow } from '../../../../core/types/monitoring/alerts.sql';
import { AlertActionRow } from '../../../../core/types/monitoring/alert-actions.sql';
import { ContactRow } from '../../../../core/types/tenant/contacts.sql';
import { AlertInfoCard } from '../components/AlertInfoCard';
import { AlertActionsList } from '../components/AlertActionsList';
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

  const [vapiModalOpen, setVapiModalOpen] = useState(false);
  const [vapiModalType, setVapiModalType] = useState<
    'transcript' | 'audio' | null
  >(null);
  const [vapiCallId, setVapiCallId] = useState<string | null>(null);

  const targetOrgId = selectedOrganization?.id || user?.organizationId;

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

  const fetchData = async () => {
    if (!id || !targetOrgId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const allOrgIds = await getOrganizationIds(targetOrgId);

      let query = supabase.from('alerts').select('*').eq('id', id);
      if (allOrgIds.length > 1) {
        query = query.in('organization_id', allOrgIds);
      } else {
        query = query.eq('organization_id', targetOrgId);
      }

      const { data: alertData, error: alertError } = await query.single();
      if (alertError) throw alertError;
      setAlert(alertData as AlertRow);

      const { data: actionsData, error: actionsError } = await supabase
        .from('alert_actions')
        .select('*')
        .eq('alert_id', id)
        .order('created_at', { ascending: false });

      if (actionsError) throw actionsError;

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, targetOrgId]);

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

      <Card>
        <AlertInfoCard
          alert={alert}
          updatingStatus={updatingStatus}
          onStatusChange={updateAlertStatus}
        />
      </Card>

      <Card>
        <AlertActionsList
          actions={actions}
          onOpenTranscript={openVapiTranscript}
          onOpenAudio={openVapiAudio}
        />
      </Card>

      <VapiModal
        isOpen={vapiModalOpen}
        type={vapiModalType}
        vapiId={vapiCallId}
        onClose={closeVapiModal}
      />
    </div>
  );
};

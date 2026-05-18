import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  BiArrowBack,
  BiUser,
  BiPhone,
  BiEnvelope,
  BiBuilding,
  BiCalendar,
  BiNote,
  BiEdit,
} from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { ContactRow } from '../../../../core/types/tenant/contacts.sql';
import { OrganizationRow } from '../../../../core/types/tenant/organizations.sql';
import { LinkedUserCard } from '../components/LinkedUserCard';
import { ContactEditForm } from '../components/ContactEditForm';

interface LinkedUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  role_id: string | null;
  is_active: boolean | null;
  last_login: string | null;
  created_at: string | null;
}

export const ContactDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, selectedOrganization } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<ContactRow | null>(null);
  const [organization, setOrganization] = useState<OrganizationRow | null>(
    null
  );
  const [linkedUser, setLinkedUser] = useState<LinkedUser | null>(null);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

      let query = supabase.from('contacts').select('*').eq('id', id);

      if (allOrgIds.length > 1) {
        query = query.in('organization_id', allOrgIds);
      } else {
        query = query.eq('organization_id', targetOrgId);
      }

      const { data: contactData, error: contactError } = await query.single();
      if (contactError) throw contactError;
      const contactRow = contactData as ContactRow;
      setContact(contactRow);

      if (contactRow?.organization_id) {
        const { data: orgData } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', contactRow.organization_id)
          .single();
        setOrganization(orgData as OrganizationRow | null);
      }

      if (contactRow?.linked_user_id) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', contactRow.linked_user_id)
          .single();
        if (userData) {
          setLinkedUser(userData as LinkedUser | null);
        }
      }
    } catch (error) {
      console.error('Error loading contact details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, targetOrgId, refreshKey]);

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
      case 'active':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Activo
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            Inactivo
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-white/10 text-white/50 border border-white/20">
            {status || '-'}
          </span>
        );
    }
  };

  const getInternalBadge = (isInternal: boolean | null) => {
    return isInternal ? (
      <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
        Interno
      </span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
        Externo
      </span>
    );
  };

  const handleEditSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  if (loading) {
    return <Loading message="Cargando detalles del contacto..." />;
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <BiUser className="text-6xl text-white/20 mb-4" />
        <p className="text-white/40 text-lg">Contacto no encontrado</p>
        <button
          onClick={() => navigate('/dashboard/contacts')}
          className="mt-4 px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/80 transition"
        >
          Volver a contactos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/contacts')}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-white/60 hover:text-white"
        >
          <BiArrowBack className="text-xl" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
            Detalles del Contacto
          </h1>
          <p className="text-sm text-white/40 font-headline">
            Información completa del contacto
          </p>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="p-2 rounded-lg bg-brand-accent/20 hover:bg-brand-accent/30 transition text-brand-accent"
        >
          <BiEdit className="text-xl" />
        </button>
      </div>

      {/* Info Principal */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-brand-accent/20">
              <BiUser className="text-3xl text-brand-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {contact.full_name}
              </h2>
              {contact.job_title && (
                <p className="text-sm text-white/40">{contact.job_title}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {getInternalBadge(contact.is_internal)}
            {getStatusBadge(contact.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/60">
              <BiPhone className="text-white/40" />
              <span>{contact.phone_number}</span>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <BiEnvelope className="text-white/40" />
              <span>{contact.email}</span>
            </div>
            {organization && (
              <div className="flex items-center gap-3 text-white/60">
                <BiBuilding className="text-white/40" />
                <span>{organization.name}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                <BiCalendar className="text-white/40" />
                Fecha de creación
              </label>
              <p className="text-white/80 mt-1">
                {formatDate(contact.created_at)}
              </p>
            </div>
            {contact.updated_at && (
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <BiCalendar className="text-white/40" />
                  Última actualización
                </label>
                <p className="text-white/80 mt-1">
                  {formatDate(contact.updated_at)}
                </p>
              </div>
            )}
          </div>
        </div>

        {contact.notes && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2 mb-2">
              <BiNote className="text-white/40" />
              Notas
            </label>
            <p className="text-white/80">{contact.notes}</p>
          </div>
        )}
      </Card>

      {/* Usuario Vinculado */}
      <Card>
        <LinkedUserCard user={linkedUser} onCreateUser={handleEditSuccess} />
      </Card>

      {/* Modal de edición */}
      <ContactEditForm
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        contact={contact}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

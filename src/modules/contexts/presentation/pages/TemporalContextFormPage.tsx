import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  BiArrowBack,
  BiSave,
  BiTrash,
  BiCalendar,
  BiInfoCircle,
} from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { Input } from '../../../../core/presentation/components/ui/Input';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { Modal } from '../../../../core/presentation/components/ui/Modal';
import { TemporalContextRow } from '../../../../core/types/monitoring/temporal-contexts.sql';

export const TemporalContextFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, selectedOrganization } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [context, setContext] = useState<TemporalContextRow | null>(null);

  const isEditing = !!id && id !== 'create';
  const targetOrgId = selectedOrganization?.id || user?.organizationId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (!targetOrgId) {
      navigate('/dashboard/temporal-contexts');
      return;
    }

    if (isEditing && id) {
      // Load existing context
      const fetchContext = async () => {
        setLoading(true);
        try {
          const { data, error } =
            await // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase.from('temporal_contexts') as any)
              .select('*')
              .eq('id', id)
              .single();

          if (error) throw error;
          setContext(data as TemporalContextRow);
          setFormData({
            name: data.name || '',
            description: data.description || '',
            start_date: data.start_date ? data.start_date.slice(0, 16) : '',
            end_date: data.end_date ? data.end_date.slice(0, 16) : '',
          });
        } catch (error) {
          console.error('Error loading context:', error);
          navigate('/dashboard/temporal-contexts');
        } finally {
          setTimeout(() => setLoading(false), 300);
        }
      };
      fetchContext();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [id, isEditing, navigate, targetOrgId]);

  const handleSave = async () => {
    if (!targetOrgId) return;
    if (!formData.name || !formData.start_date || !formData.end_date) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        organization_id: targetOrgId,
        status: 'active',
        created_by: user?.id,
      };

      if (isEditing && id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('temporal_contexts') as any)
          .update({
            name: formData.name,
            description: formData.description,
            start_date: new Date(formData.start_date).toISOString(),
            end_date: new Date(formData.end_date).toISOString(),
          })
          .eq('id', id);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('temporal_contexts') as any).insert(payload);
      }

      navigate('/dashboard/temporal-contexts');
    } catch (error) {
      console.error('Error saving context:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('temporal_contexts') as any)
        .update({ status: 'inactive' })
        .eq('id', id);

      navigate('/dashboard/temporal-contexts');
    } catch (error) {
      console.error('Error deleting context:', error);
    }
  };

  const formatDateForDisplay = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading message="Cargando contexto..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={<BiArrowBack size={20} />}
            onClick={() => navigate('/dashboard/temporal-contexts')}
            className="p-2"
          />
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
              {isEditing ? 'Editar Contexto' : 'Nuevo Contexto'}
            </h1>
            <p className="text-sm text-white/40 font-headline">
              {isEditing
                ? 'Modifica los datos del contexto temporal'
                : 'Crea un nuevo evento temporal'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              variant="ghost"
              icon={<BiTrash />}
              className="text-red-400 hover:text-red-300"
              onClick={() => setShowDeleteModal(true)}
            >
              ELIMINAR
            </Button>
          )}
          <Button
            variant="primary"
            icon={<BiSave />}
            onClick={handleSave}
            isLoading={saving}
          >
            GUARDAR
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Form */}
        <div className="lg:col-span-2">
          <Card className="p-6 space-y-6">
            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                <BiInfoCircle className="text-brand-accent" />
                Nombre del Contexto *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ej: Mantenimiento programada, Actualización de red..."
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe los detalles de este contexto temporal..."
                className="mt-2 w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-brand-primary/50 focus:outline-none resize-none font-body text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                  <BiCalendar className="text-brand-accent" />
                  Fecha de Inicio *
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className="mt-2 w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-brand-primary/50 focus:outline-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                  <BiCalendar className="text-brand-accent" />
                  Fecha de Fin *
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="mt-2 w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-brand-primary/50 focus:outline-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right - Info */}
        <div className="space-y-6">
          {isEditing && context && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Información Actual
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                    Estado
                  </label>
                  <div className="mt-2">
                    {context.status === 'active' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                        Activo
                      </span>
                    ) : context.status === 'expired' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                        Expirado
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-white/5 text-white/40 border border-white/10 uppercase">
                        Inactivo
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                    Creado
                  </label>
                  <p className="text-white/60 text-sm mt-1">
                    {formatDateForDisplay(context.created_at || null)}
                  </p>
                </div>
                {context.affected_nodes && (
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                      Nodos Afectados
                    </label>
                    <p className="text-white/60 text-sm mt-1">
                      {typeof context.affected_nodes === 'object'
                        ? JSON.stringify(context.affected_nodes)
                        : context.affected_nodes?.toString() || '-'}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card className="p-6 bg-brand-primary/5 border-brand-primary/20">
            <h3 className="text-sm font-bold text-brand-accent mb-2">
              Información
            </h3>
            <p className="text-xs text-white/60">
              Los contextos temporales definen ventanas de tiempo para eventos
              especiales, mantenimientos o cambios planificados en la red.
            </p>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <BiTrash className="text-3xl text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            ¿Inactivar contexto?
          </h3>
          <p className="text-sm text-white/60 mb-2">
            El contexto <strong className="text-white">{context?.name}</strong>{' '}
            será marcado como inactivo.
          </p>
          <p className="text-xs text-white/40 mb-6">
            Esta acción no eliminará el contexto, solo lo ocultará de la vista.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              CANCELAR
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              INACTIVAR
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

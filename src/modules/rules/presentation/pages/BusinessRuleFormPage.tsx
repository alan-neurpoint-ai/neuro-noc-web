import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { BiArrowBack, BiTrash, BiBrain } from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { Modal } from '../../../../core/presentation/components/ui/Modal';
import { BusinessRuleRow } from '../../../../core/types/knowledge/business-rules.sql';
import { ManualForm } from '../components/ManualRuleForm';
import { DocumentRuleForm } from '../components/DocumentRuleForm';
import { CreationTypeSelector } from '../components/CreationTypeSelector';

export const BusinessRuleFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, selectedOrganization } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [context, setContext] = useState<BusinessRuleRow | null>(null);

  const isEditing = !!id && id !== 'create';
  const targetOrgId = selectedOrganization?.id || user?.organizationId;

  const [creationType, setCreationType] = useState<'manual' | 'document'>(
    'manual'
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    execution_schedule: '',
    affected_targets: '',
  });

  useEffect(() => {
    if (!targetOrgId) {
      navigate('/dashboard/rules');
      return;
    }

    if (isEditing && id) {
      const fetchRule = async () => {
        setLoading(true);
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await (supabase.from('business_rule') as any)
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          setContext(data as BusinessRuleRow);
          setFormData({
            name: data.name || '',
            description: data.description || '',
            execution_schedule: data.execution_schedule
              ? data.execution_schedule.slice(0, 16)
              : '',
            affected_targets: data.affected_targets
              ? typeof data.affected_targets === 'string'
                ? data.affected_targets
                : JSON.stringify(data.affected_targets, null, 2)
              : '',
          });
        } catch (error) {
          console.error('Error loading rule:', error);
          navigate('/dashboard/rules');
        } finally {
          setTimeout(() => setLoading(false), 300);
        }
      };
      fetchRule();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [id, isEditing, navigate, targetOrgId]);

  const convertToJson = (text: string): unknown => {
    if (!text.trim()) return null;

    try {
      return JSON.parse(text);
    } catch {
      const items = text
        .split(/[,;\n]+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      if (text.includes(':')) {
        const obj: Record<string, string[]> = {};
        text.split(/[,;\n]+/).forEach((pair) => {
          const [key, ...values] = pair.split(':');
          if (key && values.length > 0) {
            obj[key.trim()] = values.map((v) => v.trim()).filter((v) => v);
          }
        });
        return obj;
      }

      return { targets: items };
    }
  };

  const handleSave = () => {
    doActualSave();
  };

  const doActualSave = async () => {
    if (!targetOrgId) return;
    if (!formData.name) {
      alert('Por favor complete el nombre de la regla');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        execution_schedule: formData.execution_schedule
          ? new Date(formData.execution_schedule).toISOString()
          : null,
        affected_targets: convertToJson(formData.affected_targets),
        organization_id: targetOrgId,
        status: 'active',
        created_by: user?.id,
      };

      if (isEditing && id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('business_rule') as any)
          .update({
            name: formData.name,
            description: formData.description,
            execution_schedule: formData.execution_schedule
              ? new Date(formData.execution_schedule).toISOString()
              : null,
            affected_targets: formData.affected_targets
              ? JSON.parse(formData.affected_targets)
              : null,
          })
          .eq('id', id);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('business_rule') as any).insert(payload);
      }

      navigate('/dashboard/rules');
    } catch (error) {
      console.error('Error saving rule:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('business_rule') as any)
        .update({ status: 'inactive' })
        .eq('id', id);

      navigate('/dashboard/rules');
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const formatDate = (dateStr: string | null) => {
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
    return <Loading message="Cargando regla..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={<BiArrowBack size={20} />}
            onClick={() => navigate('/dashboard/rules')}
            className="p-2"
          />
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
              {isEditing ? 'Editar Regla' : 'Nueva Regla de Negocio'}
            </h1>
            <p className="text-sm text-white/40 font-headline">
              {isEditing
                ? 'Modifica los datos de la regla'
                : 'Crea una nueva regla de negocio'}
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
        </div>
      </div>

      {!isEditing && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BiBrain className="text-brand-accent" />
            Tipo de Creación
          </h3>
          <CreationTypeSelector
            creationType={creationType}
            onChange={setCreationType}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 space-y-6">
            {creationType === 'manual' ? (
              <ManualForm
                formData={formData}
                setFormData={setFormData}
                saving={saving}
                onSave={handleSave}
              />
            ) : (
              <DocumentRuleForm
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {isEditing && context && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Información Actual
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                    Creado
                  </label>
                  <p className="text-white/60 text-sm mt-1">
                    {formatDate(context.created_at)}
                  </p>
                </div>
                {context.affected_targets && (
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                      Objetivos Afectados
                    </label>
                    <p className="text-white/60 text-sm mt-1">
                      {typeof context.affected_targets === 'object'
                        ? JSON.stringify(context.affected_targets)
                        : context.affected_targets?.toString() || '-'}
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
              Las reglas de negocio definen automatizaciones que se ejecutan en
              tu sistema. Puedes crearlas manualmente o procesarlas desde
              documentos técnicos.
            </p>
          </Card>
        </div>
      </div>

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
            ¿Inactivar regla?
          </h3>
          <p className="text-sm text-white/60 mb-2">
            La regla <strong className="text-white">{context?.name}</strong>{' '}
            será marcada como inactiva.
          </p>
          <p className="text-xs text-white/40 mb-6">
            Esta acción no eliminará la regla, solo la ocultará de la vista.
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

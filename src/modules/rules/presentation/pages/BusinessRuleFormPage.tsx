import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  BiArrowBack,
  BiSave,
  BiTrash,
  BiFile,
  BiLink,
  BiBrain,
  BiUpload,
} from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { Input } from '../../../../core/presentation/components/ui/Input';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { Modal } from '../../../../core/presentation/components/ui/Modal';
import { BusinessRuleRow } from '../../../../core/types/knowledge/business-rules.sql';

const N8N_WEBHOOK_URL = 'https://cesar.n8n-wsk.com/webhook/base-conocimientos';

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

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    execution_schedule: '',
    affected_targets: '',
  });

  const [creationType, setCreationType] = useState<'manual' | 'document'>(
    'manual'
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

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

  const handleSave = async () => {
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
        affected_targets: formData.affected_targets
          ? JSON.parse(formData.affected_targets)
          : null,
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
      {/* Header */}
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

      {/* Creation Type Selector (only for new rules) */}
      {!isEditing && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BiBrain className="text-brand-accent" />
            Tipo de Creación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setCreationType('manual')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                creationType === 'manual'
                  ? 'border-brand-primary bg-brand-primary/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <BiFile className="text-xl text-brand-accent" />
                <span className="font-bold text-white">Creación Manual</span>
              </div>
              <p className="text-xs text-white/50">
                Completa el formulario directamente y guarda en la base de datos
              </p>
            </button>

            <button
              onClick={() => setCreationType('document')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                creationType === 'document'
                  ? 'border-brand-primary bg-brand-primary/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <BiLink className="text-xl text-brand-accent" />
                <span className="font-bold text-white">Desde Documento</span>
              </div>
              <p className="text-xs text-white/50">
                Procesa un documento técnico y lo envía a un webhook externo
              </p>
            </button>
          </div>
        </Card>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Form */}
        <div className="lg:col-span-2">
          <Card className="p-6 space-y-6">
            {/* Solo mostrar campos manuales cuando es creación manual */}
            {creationType === 'manual' && (
              <>
                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                    Nombre de la Regla *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej: Validar horario de mantenimiento, Verificar estado de nodos..."
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
                    placeholder="Describe los detalles de esta regla de negocio..."
                    className="mt-2 w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-brand-primary/50 focus:outline-none resize-none font-body text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                    Programación de Ejecución
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.execution_schedule}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        execution_schedule: e.target.value,
                      })
                    }
                    className="mt-2 w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-brand-primary/50 focus:outline-none"
                    style={{ colorScheme: 'dark' }}
                  />
                  <p className="text-[10px] text-white/30 mt-1">
                    Define cuándo se ejecuta esta regla automáticamente
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                    Objetivos Afectados (JSON)
                  </label>
                  <textarea
                    value={formData.affected_targets}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        affected_targets: e.target.value,
                      })
                    }
                    placeholder='Ej: {"nodes": ["node1", "node2"], "services": ["api", "db"]}'
                    className="mt-2 w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-brand-primary/50 focus:outline-none resize-none font-mono text-sm"
                  />
                  <p className="text-[10px] text-white/30 mt-1">
                    Define los nodos o servicios afectados por esta regla
                    (formato JSON)
                  </p>
                </div>
              </>
            )}

            {/* Botón para subir documento */}
            {creationType === 'document' && (
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                    Seleccionar Archivo
                  </label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.md,.json,.yaml,.yml"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-primary file:text-white file:cursor-pointer file:transition-all file:duration-200 hover:file:brightness-110"
                    />
                  </div>
                  <p className="text-[10px] text-white/30 mt-1">
                    Formatos aceptados: PDF, DOC, DOCX, TXT, MD, JSON, YAML
                  </p>
                </div>

                <Button
                  variant="action"
                  icon={<BiUpload />}
                  onClick={async () => {
                    console.log('Botón clicked, selectedFile:', selectedFile);
                    if (!selectedFile) {
                      alert('Por favor selecciona un archivo primero');
                      return;
                    }
                    setUploadingFile(true);
                    console.log('Subiendo archivo:', selectedFile.name);

                    try {
                      // Enviar archivo como binary (multipart/form-data)
                      const formData = new FormData();
                      formData.append('file', selectedFile);
                      formData.append('file_name', selectedFile.name);
                      formData.append('organization_id', targetOrgId || '');
                      formData.append('created_by', user?.id || '');

                      const response = await fetch(N8N_WEBHOOK_URL, {
                        method: 'POST',
                        body: formData,
                      });

                      if (response.ok) {
                        alert(
                          `Archivo "${selectedFile.name}" enviado exitosamente al webhook!`
                        );
                        navigate('/dashboard/rules');
                      } else {
                        throw new Error('Error del webhook');
                      }
                    } catch (error) {
                      console.error('Error processing file:', error);
                      alert('Error al procesar el archivo');
                    } finally {
                      setUploadingFile(false);
                    }
                  }}
                  disabled={!selectedFile || uploadingFile}
                  isLoading={uploadingFile}
                  className="w-full"
                >
                  SUBIR DOCUMENTO
                </Button>
              </div>
            )}
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
                    ) : context.status === 'inactive' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-white/5 text-white/40 border border-white/10 uppercase">
                        Inactivo
                      </span>
                    ) : context.status === 'draft' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                        Borrador
                      </span>
                    ) : (
                      <span className="text-white/40">-</span>
                    )}
                  </div>
                </div>
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

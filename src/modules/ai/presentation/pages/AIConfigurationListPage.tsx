import { useState, useEffect } from 'react';
import { BiPlus, BiSave, BiTrash, BiBrain, BiX, BiUser, BiCheckCircle } from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { Input } from '../../../../core/presentation/components/ui/Input';
import { Modal } from '../../../../core/presentation/components/ui/Modal';
import { AIConfigurationRow } from '../../../../core/types/knowledge/ai-configurations.sql';

export const AIConfigurationListPage = () => {
  const { user, selectedOrganization } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [configs, setConfigs] = useState<AIConfigurationRow[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const targetOrgId = selectedOrganization?.id || user?.organizationId;

  // Form state - only one config at a time for profile view
  const [formData, setFormData] = useState({
    ai_name: '',
    personality_prompt: '',
    languages: [] as string[],
    newLanguage: '',
    id: '',
  });

  useEffect(() => {
    if (!targetOrgId) {
      setConfigs([]);
      setLoading(false);
      return;
    }

    const fetchConfigs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('ai_configurations')
          .select('*')
          .eq('organization_id', targetOrgId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;
        
        const configsData = (data as AIConfigurationRow[]) || [];
        setConfigs(configsData);
        
        // Load first config into form
        if (configsData.length > 0) {
          setFormData({
            ai_name: configsData[0].ai_name || '',
            personality_prompt: configsData[0].personality_prompt || '',
            languages: Array.isArray(configsData[0].languages) ? configsData[0].languages : [],
            newLanguage: '',
            id: configsData[0].id,
          });
        }
      } catch (error) {
        console.error('Error loading AI configurations:', error);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchConfigs();
  }, [targetOrgId]);

  const handleAddLanguage = () => {
    if (formData.newLanguage.trim()) {
      setFormData({
        ...formData,
        languages: [...formData.languages, formData.newLanguage.trim()],
        newLanguage: '',
      });
    }
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!targetOrgId) return;

    try {
      if (formData.id) {
        // Update existing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('ai_configurations') as any)
          .update({
            ai_name: formData.ai_name,
            personality_prompt: formData.personality_prompt,
            languages: formData.languages,
            updated_by: user?.id,
          })
          .eq('id', formData.id);
      } else {
        // Create new
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('ai_configurations') as any).insert({
          ai_name: formData.ai_name,
          personality_prompt: formData.personality_prompt,
          languages: formData.languages,
          organization_id: targetOrgId,
          status: 'active',
          created_by: user?.id,
        });
      }

      // Refresh
      const { data } = await supabase
        .from('ai_configurations')
        .select('*')
        .eq('organization_id', targetOrgId)
        .order('created_at', { ascending: false })
        .limit(1);

      const configsData = (data as AIConfigurationRow[]) || [];
      setConfigs(configsData);
      if (configsData.length > 0) {
        setFormData({
          ai_name: configsData[0].ai_name || '',
          personality_prompt: configsData[0].personality_prompt || '',
          languages: Array.isArray(configsData[0].languages) ? configsData[0].languages : [],
          newLanguage: '',
          id: configsData[0].id,
        });
      }
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving AI configuration:', error);
    }
  };

  const handleDelete = async () => {
    if (!formData.id || !confirm('¿Estás seguro de eliminar esta configuración?')) return;

    try {
      await supabase
        .from('ai_configurations')
        .delete()
        .eq('id', formData.id);

      setFormData({
        ai_name: '',
        personality_prompt: '',
        languages: [],
        newLanguage: '',
        id: '',
      });
      setConfigs([]);
    } catch (error) {
      console.error('Error deleting AI configuration:', error);
    }
  };

  const startCreating = () => {
    setFormData({
      ai_name: '',
      personality_prompt: '',
      languages: [],
      newLanguage: '',
      id: '',
    });
    setIsCreating(true);
  };

  if (loading) {
    return <Loading message="Cargando configuración..." />;
  }

  const hasConfig = configs.length > 0 && !isCreating;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
            Personalidad IA
          </h1>
          <p className="text-sm text-white/40 font-headline">
            Configura el comportamiento de tu agente inteligente
          </p>
        </div>

        {!hasConfig && !isCreating && (
          <Button
            variant="action"
            icon={<BiPlus />}
            onClick={startCreating}
          >
            CREAR CONFIGURACIÓN
          </Button>
        )}
      </div>

      {/* Perfil - Formulario directo en la página */}
      <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(103,45,169,0.3) 0%, rgba(139,92,246,0.2) 100%)' }}
          >
            <BiBrain className="text-4xl text-brand-accent" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              {formData.ai_name || 'Nuevo Agente IA'}
            </h2>
            <p className="text-sm text-white/40">
              {formData.id ? 'Configuración activa' : 'Sin configurar'}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            {hasConfig && (
              <>
                <Button
                  variant="primary"
                  icon={<BiSave />}
                  onClick={() => setShowConfirmModal(true)}
                >
                  GUARDAR
                </Button>
                <Button
                  variant="ghost"
                  icon={<BiTrash />}
                  className="text-red-400 hover:text-red-300"
                  onClick={handleDelete}
                />
              </>
            )}
            {isCreating && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                >
                  CANCELAR
                </Button>
                <Button
                  variant="primary"
                  icon={<BiSave />}
                  onClick={() => setShowConfirmModal(true)}
                >
                  CREAR
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Info básica */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                <BiUser className="text-brand-accent" />
                Nombre del Agente
              </label>
              <Input
                value={formData.ai_name}
                onChange={(e) => setFormData({ ...formData, ai_name: e.target.value })}
                placeholder="Ej: NeuroAsistente"
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                Idiomas Soportados
              </label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={formData.newLanguage}
                  onChange={(e) => setFormData({ ...formData, newLanguage: e.target.value })}
                  placeholder="Agregar idioma..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
                  className="flex-1"
                />
                <Button variant="secondary" onClick={handleAddLanguage}>
                  <BiPlus />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 flex items-center gap-1"
                  >
                    {lang}
                    <button onClick={() => handleRemoveLanguage(index)} className="hover:text-white/70">
                      <BiX className="text-[10px]" />
                    </button>
                  </span>
                ))}
                {formData.languages.length === 0 && (
                  <span className="text-xs text-white/30">Sin idiomas configurados</span>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha - Personalidad */}
          <div className="lg:col-span-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
              Personalidad del Agente
            </label>
            <textarea
              value={formData.personality_prompt}
              onChange={(e) => setFormData({ ...formData, personality_prompt: e.target.value })}
              placeholder="Define cómo debe comportarse el agente, su tono, nivel de detalle, etc...
              
Ej: Eres un asistente técnico especializado en redes de telecomunicaciones. Debes ser detallado pero claro, usar un lenguaje profesional pero accesible. Cuando expliques conceptos técnicos incluye ejemplos prácticos..."
              className="mt-2 w-full h-64 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-brand-primary/50 focus:outline-none resize-none font-body text-sm leading-relaxed"
            />
            <p className="text-[10px] text-white/30 mt-2">
              Escribe las instrucciones que definirán la personalidad y comportamiento de tu agente IA
            </p>
          </div>
        </div>

        {/* Metadata */}
        {hasConfig && (
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between text-xs text-white/30">
            <span>
              Creado: {configs[0]?.created_at ? new Date(configs[0].created_at).toLocaleDateString('es-ES') : '-'}
            </span>
            <span>
              Última actualización: {configs[0]?.updated_at ? new Date(configs[0].updated_at).toLocaleDateString('es-ES') : '-'}
            </span>
          </div>
        )}
      </div>

      {/* Modal de confirmación de seguridad */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar Acción"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
            <BiCheckCircle className="text-3xl text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            ¿Estás seguro de guardar?
          </h3>
          <p className="text-sm text-white/60 mb-6">
            Esta acción modificará la configuración del agente IA. Asegúrate de que los datos sean correctos.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              CANCELAR
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                await handleSave();
                setShowConfirmModal(false);
              }}
            >
              CONFIRMAR
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
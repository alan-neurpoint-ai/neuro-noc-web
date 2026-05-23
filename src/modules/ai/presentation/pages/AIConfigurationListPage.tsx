import { useState, useEffect } from 'react';
import { BiPlus, BiCheckCircle } from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { Modal } from '../../../../core/presentation/components/ui/Modal';
import { AIConfigurationRow } from '../../../../core/types/knowledge/ai-configurations.sql';
import { AIConfigCard } from '../components/AIConfigCard';

export const AIConfigurationListPage = () => {
  const { user, selectedOrganization } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [configs, setConfigs] = useState<AIConfigurationRow[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const targetOrgId = selectedOrganization?.id || user?.organizationId;

  const [formData, setFormData] = useState({
    ai_name: '',
    personality_prompt: '',
    languages: [] as string[],
    newLanguage: '',
    id: '',
  });

  const fetchConfigs = async () => {
    if (!targetOrgId) {
      setConfigs([]);
      setLoading(false);
      return;
    }

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

      if (configsData.length > 0) {
        setFormData({
          ai_name: configsData[0].ai_name || '',
          personality_prompt: configsData[0].personality_prompt || '',
          languages: Array.isArray(configsData[0].languages)
            ? configsData[0].languages
            : [],
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        await supabase
          .from('ai_configurations')
          .update({
            ai_name: formData.ai_name,
            personality_prompt: formData.personality_prompt,
            languages: formData.languages,
            updated_by: user?.id,
          } as never)
          .eq('id', formData.id);
      } else {
        await supabase.from('ai_configurations').insert({
          ai_name: formData.ai_name,
          personality_prompt: formData.personality_prompt,
          languages: formData.languages,
          organization_id: targetOrgId,
          status: 'active',
          created_by: user?.id,
        } as never);
      }

      await fetchConfigs();
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving AI configuration:', error);
    }
  };

  const handleDelete = async () => {
    if (
      !formData.id ||
      !confirm('¿Estás seguro de eliminar esta configuración?')
    )
      return;

    try {
      await supabase.from('ai_configurations').delete().eq('id', formData.id);
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
          <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase">
            Personalidad IA
          </h1>
          <p className="text-sm text-text-muted font-headline">
            Configura el comportamiento de tu agente inteligente
          </p>
        </div>
        {!hasConfig && !isCreating && (
          <Button variant="action" icon={<BiPlus />} onClick={startCreating}>
            CREAR CONFIGURACIÓN
          </Button>
        )}
      </div>

      <AIConfigCard
        formData={formData}
        setFormData={setFormData}
        configs={configs}
        isCreating={isCreating}
        hasConfig={hasConfig}
        onAddLanguage={handleAddLanguage}
        onRemoveLanguage={handleRemoveLanguage}
        onSave={() => setShowConfirmModal(true)}
        onDelete={handleDelete}
      />

      {/* Modal de confirmación */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar Acción"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
            <BiCheckCircle className="text-3xl text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-text-main mb-2">
            ¿Estás seguro de guardar?
          </h3>
          <p className="text-sm text-text-muted mb-6">
            Esta acción modificará la configuración del agente IA. Asegúrate de
            que los datos sean correctos.
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

import { BiBrain, BiSave, BiTrash } from 'react-icons/bi';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { AIConfigurationRow } from '../../../../core/types/knowledge/ai-configurations.sql';
import { AIConfigForm } from './AIConfigForm';

interface AIConfigCardProps {
  formData: {
    ai_name: string;
    personality_prompt: string;
    languages: string[];
    newLanguage: string;
    id: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      ai_name: string;
      personality_prompt: string;
      languages: string[];
      newLanguage: string;
      id: string;
    }>
  >;
  configs: AIConfigurationRow[];
  isCreating: boolean;
  hasConfig: boolean;
  onAddLanguage: () => void;
  onRemoveLanguage: (index: number) => void;
  onSave: () => void;
  onDelete: () => void;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('es-ES');
};

export const AIConfigCard = ({
  formData,
  setFormData,
  configs,
  isCreating,
  hasConfig,
  onAddLanguage,
  onRemoveLanguage,
  onSave,
  onDelete,
}: AIConfigCardProps) => {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border-subtle">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(103,45,169,0.3) 0%, rgba(139,92,246,0.2) 100%)',
          }}
        >
          <BiBrain className="text-4xl text-brand-accent" />
        </div>
        <div>
          <h2 className="text-xl font-black text-text-main">
            {formData.ai_name || 'Nuevo Agente IA'}
          </h2>
          <p className="text-sm text-text-muted">
            {formData.id ? 'Configuración activa' : 'Sin configurar'}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          {hasConfig && (
            <>
              <Button variant="primary" icon={<BiSave />} onClick={onSave}>
                GUARDAR
              </Button>
              <Button
                variant="ghost"
                icon={<BiTrash />}
                className="text-red-400 hover:text-red-300"
                onClick={onDelete}
              />
            </>
          )}
          {isCreating && (
            <>
              <Button
                variant="outline"
                onClick={() =>
                  setFormData({
                    ai_name: '',
                    personality_prompt: '',
                    languages: [],
                    newLanguage: '',
                    id: '',
                  })
                }
              >
                CANCELAR
              </Button>
              <Button variant="primary" icon={<BiSave />} onClick={onSave}>
                CREAR
              </Button>
            </>
          )}
        </div>
      </div>

      <AIConfigForm
        formData={formData}
        setFormData={setFormData}
        onAddLanguage={onAddLanguage}
        onRemoveLanguage={onRemoveLanguage}
      />

      {/* Metadata */}
      {hasConfig && (
        <div className="mt-8 pt-6 border-t border-border-subtle flex justify-between text-xs text-text-muted">
          <span>
            Creado:{' '}
            {configs[0]?.created_at ? formatDate(configs[0].created_at) : '-'}
          </span>
          <span>
            Última actualización:{' '}
            {configs[0]?.updated_at ? formatDate(configs[0].updated_at) : '-'}
          </span>
        </div>
      )}
    </div>
  );
};

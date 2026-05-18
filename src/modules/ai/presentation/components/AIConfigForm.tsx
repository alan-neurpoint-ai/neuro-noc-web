import { BiUser, BiPlus, BiX } from 'react-icons/bi';
import { Input } from '../../../../core/presentation/components/ui/Input';
import { Button } from '../../../../core/presentation/components/ui/Button';

interface AIConfigFormProps {
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
  onAddLanguage: () => void;
  onRemoveLanguage: (index: number) => void;
}

export const AIConfigForm = ({
  formData,
  setFormData,
  onAddLanguage,
  onRemoveLanguage,
}: AIConfigFormProps) => {
  return (
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
            onChange={(e) =>
              setFormData({ ...formData, ai_name: e.target.value })
            }
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
              onChange={(e) =>
                setFormData({ ...formData, newLanguage: e.target.value })
              }
              placeholder="Agregar idioma..."
              onKeyPress={(e) => e.key === 'Enter' && onAddLanguage()}
              className="flex-1"
            />
            <Button variant="secondary" onClick={onAddLanguage}>
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
                <button
                  onClick={() => onRemoveLanguage(index)}
                  className="hover:text-white/70"
                >
                  <BiX className="text-[10px]" />
                </button>
              </span>
            ))}
            {formData.languages.length === 0 && (
              <span className="text-xs text-white/30">
                Sin idiomas configurados
              </span>
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
          onChange={(e) =>
            setFormData({ ...formData, personality_prompt: e.target.value })
          }
          placeholder={`Define cómo debe comportarse el agente, su tono, nivel de detalle, etc...

Ej: Eres un asistente técnico especializado en redes de telecomunicaciones. Debes ser detallado pero claro, usar un lenguaje profesional pero accesible. Cuando expliques conceptos técnicos incluye ejemplos prácticos...`}
          className="mt-2 w-full h-64 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-brand-primary/50 focus:outline-none resize-none font-body text-sm leading-relaxed"
        />
        <p className="text-[10px] text-white/30 mt-2">
          Escribe las instrucciones que definirán la personalidad y
          comportamiento de tu agente IA
        </p>
      </div>
    </div>
  );
};

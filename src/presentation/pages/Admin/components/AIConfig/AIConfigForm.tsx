import type { AIConfiguration } from "../../../../../core/entities/supabase/AIConfiguration";
import { Button } from "../../../../components/ui";

interface AIConfigFormProps {
  formData: Partial<AIConfiguration>;
  setFormData: (data: Partial<AIConfiguration>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
  clientName?: string;
}

export default function AIConfigForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isLoading,
  clientName,
}: AIConfigFormProps) {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <header className="mb-10 flex justify-between items-end border-b border-accent/10 pb-6">
        <div>
          <h2 className="text-4xl font-light italic uppercase tracking-tighter">
            {formData.id ? "Editar" : "Configurar"}{" "}
            <span className="text-accent font-black">IA</span>
          </h2>
          <p className="text-[10px] tracking-[0.3em] text-text-secondary uppercase mt-1">
            {formData.id ? `ID: ${formData.id}` : `Cliente: ${clientName}`}
          </p>
        </div>
        <Button variant="cancel" onClick={onCancel}>
          Cancelar
        </Button>
      </header>

      <form onSubmit={onSubmit} className="glass-card p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-accent uppercase block">
              Nombre del Agente
            </label>
            <input
              className="w-full bg-background/50 border border-white/10 p-4 text-sm focus:border-accent outline-none text-text-primary rounded-sm transition-colors"
              value={formData.ai_name}
              onChange={(e) =>
                setFormData({ ...formData, ai_name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-accent uppercase block">
              Idioma
            </label>
            <select
              className="w-full bg-background/50 border border-white/10 p-4 text-sm focus:border-accent outline-none text-text-primary cursor-pointer rounded-sm"
              value={formData.languages}
              onChange={(e) =>
                setFormData({ ...formData, languages: e.target.value })
              }
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest text-accent uppercase block">
            Personality Prompt
          </label>
          <textarea
            className="w-full bg-background/80 border border-white/10 p-6 text-[11px] font-mono h-64 focus:border-accent outline-none transition-all resize-none text-text-secondary rounded-sm leading-relaxed"
            value={formData.personality_prompt}
            onChange={(e) =>
              setFormData({ ...formData, personality_prompt: e.target.value })
            }
            required
          />
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end">
          <Button
            variant="success"
            type="submit"
            className="w-full md:w-72 h-14"
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}

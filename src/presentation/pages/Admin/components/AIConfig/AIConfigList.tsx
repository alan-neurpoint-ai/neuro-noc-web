import type { AIConfiguration } from "../../../../../core/entities/supabase/AIConfiguration";
import { Button } from "../../../../components/ui";

interface AIConfigListProps {
  configs: AIConfiguration[];
  onEdit: (config: AIConfiguration) => void;
  onCreate: () => void;
}

export default function AIConfigList({
  configs,
  onEdit,
  onCreate,
}: AIConfigListProps) {
  const config = configs[0];

  if (!config) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center border border-white/5 bg-white/2 rounded-lg animate-in fade-in duration-500">
        <div className="text-accent/20 mb-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              d="M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-text-secondary mb-6">
          No se detectó configuración de inteligencia
        </p>
        <Button variant="login" onClick={onCreate} className="h-11 px-10">
          Inicializar Agente
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-300 mx-auto animate-in fade-in slide-in-from-top-2 duration-700">
      {/* SECCIÓN SUPERIOR: IDENTIDAD */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-accent to-transparent opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative h-24 w-24 bg-background border border-white/10 rounded-xl flex items-center justify-center text-3xl overflow-hidden">
              <span className="z-10 opacity-80">01</span>
              <div className="absolute inset-0 bg-accent/5 mix-blend-overlay"></div>
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-[ -0.05em] uppercase italic text-text-primary leading-none">
              {config.ai_name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <p className="text-[10px] tracking-[0.4em] text-accent uppercase font-bold opacity-70">
                Core Engine Online
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="edit"
          onClick={() => onEdit(config)}
          className="h-12 px-12 text-[10px] uppercase tracking-widest font-black"
        >
          Modificar Parámetros
        </Button>
      </section>

      {/* SECCIÓN MEDIA: ESPECIFICACIONES TÉCNICAS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-1 border-b border-white/5">
        {[
          {
            label: "Language Protocol",
            value: config.languages === "es" ? "Spanish_LATAM" : "English_US",
          },
          {
            label: "Deployment Status",
            value: config.status?.toUpperCase() || "ACTIVE",
          },
        ].map((item, i) => (
          <div key={i} className="py-8 px-2">
            <label className="text-[9px] font-black tracking-widest text-text-secondary/40 uppercase block mb-1">
              {item.label}
            </label>
            <span className="text-xs font-mono text-text-primary tracking-wider">
              {item.value}
            </span>
          </div>
        ))}
      </section>

      {/* SECCIÓN INFERIOR: PERSONALIDAD (SYSTEM PROMPT) */}
      <section className="pt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">
            Comportamiento del Sistema
          </h3>
          <span className="text-[9px] font-mono text-white/10">
            ENC_TYPE: UTF-8
          </span>
        </div>

        <div className="relative">
          {/* Decoración técnica lateral */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-accent/50 via-white/5 to-transparent"></div>

          <div className="pl-8">
            <div className="bg-white/1 border border-white/5 p-10 rounded-sm">
              <p className="text-[14px] text-text-secondary leading-[1.8] font-light italic font-mono selection:bg-accent selection:text-background">
                {config.personality_prompt}
              </p>
            </div>

            {/* Footer de la sección */}
            <div className="mt-8 flex items-center gap-6 opacity-20">
              <div className="text-[9px] font-mono tracking-tighter">
                TIMESTAMP: {new Date().toISOString()}
              </div>
              <div className="flex-1 h-px bg-white/10"></div>
              <div className="text-[9px] font-mono">AUTORIZED_ONLY</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

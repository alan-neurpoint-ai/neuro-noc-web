import { RadarVisualization } from './RadarVisualization';

const SECURITY_BADGES = [
  { label: 'E2E', color: 'bg-emerald-500' },
  { label: 'SOC 2', color: 'bg-brand-primary' },
  { label: '99.9% UP', color: 'bg-amber-400' },
] as const;

interface LoginBrandPanelProps {
  mountAnim: boolean;
}

export function LoginBrandPanel({ mountAnim }: LoginBrandPanelProps) {
  return (
    <div
      className={`hidden lg:flex lg:w-[52%] relative flex-col items-center justify-center p-12 transition-all duration-1200 ease-out ${mountAnim ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
    >
      <div className="relative w-full max-w-105">
        <div
          className={`transition-all duration-1400 ease-out ${mountAnim ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        >
          <RadarVisualization />
        </div>

        <div className="absolute -bottom-8 left-0 right-0">
          <div
            className={`transition-all duration-700 delay-500 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-brand-primary/50" />
              <span className="font-label text-[9px] font-bold text-brand-primary/60 uppercase tracking-[0.35em]">
                Network Operations Center
              </span>
            </div>
          </div>

          <h1
            className={`font-headline font-extrabold text-white leading-[1.08] text-[clamp(2.2rem,4.5vw,3.8rem)] transition-all duration-800 delay-700 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            Neuro{' '}
            <span className="text-transparent bg-clip-text gradient-login-hero-text">
              NOC
            </span>
          </h1>

          <p
            className={`mt-3 text-sm text-text-muted/50 font-body leading-relaxed max-w-95 transition-all duration-700 delay-900 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Monitoreo inteligente de infraestructura con capacidades predictivas
            y automatización de operaciones en tiempo real.
          </p>
        </div>

        <div
          className={`absolute -bottom-32 left-0 flex gap-2.5 transition-all duration-700 delay-1100 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {SECURITY_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/3 border border-white/6"
            >
              <div
                className={`w-1.25 h-1.25 rounded-full ${badge.color} animate-login-pulse-badge`}
              />
              <span className="font-label text-[8px] font-bold text-text-muted/50 uppercase tracking-[0.2em]">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-12 font-label text-[8px] text-text-muted/20 uppercase tracking-[0.3em]">
        v3.2.1 · &copy; 2026 Neuropoint.ai
      </div>
    </div>
  );
}

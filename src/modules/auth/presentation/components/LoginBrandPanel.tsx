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
      className={`hidden lg:flex lg:w-[52%] relative flex-col items-center justify-center p-10 lg:p-14 xl:p-16 2xl:p-20 overflow-hidden transition-all duration-1200 ease-out ${mountAnim ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
    >
      <div className="w-full max-w-105 xl:max-w-125 2xl:max-w-140 flex flex-col items-center">
        <div
          className={`w-full max-w-72 xl:max-w-80 2xl:max-w-90 transition-all duration-1400 ease-out ${mountAnim ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        >
          <RadarVisualization />
        </div>

        <div className="w-full mt-6 xl:mt-8">
          <div
            className={`transition-all duration-700 delay-500 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            <div className="flex items-center gap-3 mb-3 xl:mb-4">
              <div className="h-px w-8 xl:w-10 bg-brand-primary/50" />
              <span className="font-label text-[clamp(9px,0.65vw,13px)] font-bold text-brand-primary/60 uppercase tracking-[0.35em]">
                Network Operations Center
              </span>
            </div>
          </div>

          <h1
            className={`font-headline font-extrabold text-white leading-[1.08] text-[clamp(2.2rem,4vw,4rem)] transition-all duration-800 delay-700 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            Neuro{' '}
            <span className="text-transparent bg-clip-text gradient-login-hero-text">
              NOC
            </span>
          </h1>

          <p
            className={`mt-2 xl:mt-3 text-[clamp(0.75rem,0.95vw,1.1rem)] text-text-muted/50 font-body leading-relaxed max-w-85 xl:max-w-100 transition-all duration-700 delay-900 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Monitoreo inteligente de infraestructura con capacidades predictivas
            y automatización de operaciones en tiempo real.
          </p>
        </div>

        <div
          className={`w-full flex gap-2 xl:gap-2.5 mt-6 xl:mt-8 transition-all duration-700 delay-1100 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {SECURITY_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-md bg-bg-surface/50 border border-border-subtle"
            >
              <div
                className={`w-1.5 h-1.5 xl:w-1.5 xl:h-1.5 rounded-full ${badge.color} animate-login-pulse-badge`}
              />
              <span className="font-label text-[clamp(8px,0.5vw,11px)] font-bold text-text-muted/50 uppercase tracking-[0.2em]">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-5 left-10 xl:left-14 font-label text-[clamp(7px,0.45vw,9px)] text-text-muted/20 uppercase tracking-[0.3em]">
        v3.2.1 · &copy; 2026 Neuropoint.ai
      </div>
    </div>
  );
}
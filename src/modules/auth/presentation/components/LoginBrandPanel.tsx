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
      className={`hidden lg:flex lg:w-[52%] relative flex-col items-center justify-center p-10 lg:p-14 xl:p-20 transition-all duration-1200 ease-out ${mountAnim ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
    >
      <div className="relative w-full max-w-105 xl:max-w-130 2xl:max-w-150">
        <div
          className={`transition-all duration-1400 ease-out ${mountAnim ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        >
          <RadarVisualization />
        </div>

        <div className="absolute -bottom-10 xl:-bottom-12 left-0 right-0">
          <div
            className={`transition-all duration-700 delay-500 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            <div className="flex items-center gap-3 mb-4 xl:mb-5">
              <div className="h-px w-8 xl:w-10 bg-brand-primary/50" />
              <span className="font-label text-[clamp(9px,0.65vw,13px)] font-bold text-brand-primary/60 uppercase tracking-[0.35em]">
                Network Operations Center
              </span>
            </div>
          </div>

          <h1
            className={`font-headline font-extrabold text-white leading-[1.08] text-[clamp(2.4rem,5vw,4.5rem)] transition-all duration-800 delay-700 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            Neuro{' '}
            <span className="text-transparent bg-clip-text gradient-login-hero-text">
              NOC
            </span>
          </h1>

          <p
            className={`mt-3 xl:mt-4 text-[clamp(0.8rem,1.1vw,1.2rem)] text-text-muted/50 font-body leading-relaxed max-w-95 xl:max-w-110 transition-all duration-700 delay-900 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Monitoreo inteligente de infraestructura con capacidades predictivas
            y automatización de operaciones en tiempo real.
          </p>
        </div>

        <div
          className={`absolute -bottom-36 xl:-bottom-38 left-0 flex gap-2.5 xl:gap-3 transition-all duration-700 delay-1100 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {SECURITY_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-1.5 xl:gap-2 px-3 xl:px-4 py-1.5 xl:py-2 rounded-md bg-white/3 border border-white/6"
            >
              <div
                className={`w-1.25 h-1.25 xl:w-1.5 xl:h-1.5 rounded-full ${badge.color} animate-login-pulse-badge`}
              />
              <span className="font-label text-[clamp(8px,0.55vw,12px)] font-bold text-text-muted/50 uppercase tracking-[0.2em]">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-10 xl:left-16 font-label text-[clamp(8px,0.5vw,10px)] text-text-muted/20 uppercase tracking-[0.3em]">
        v3.2.1 · &copy; 2026 Neuropoint.ai
      </div>
    </div>
  );
}
interface LoadingProps {
  message?: string;
  variant?: 'fullscreen' | 'overlay';
}

export const Loading = ({
  message = 'Escaneando red...',
  variant = 'fullscreen',
}: LoadingProps) => {
  const containerBase =
    'flex flex-col items-center justify-center backdrop-blur-2xl transition-all duration-500 font-headline';

  const variants = {
    fullscreen: `${containerBase} fixed inset-0 z-[9999] bg-bg-main/95`,
    overlay: `${containerBase} absolute inset-0 z-50 bg-bg-main/80 rounded-[20px] border border-border-subtle`,
  };

  return (
    <div className={variants[variant]}>
      <div className="relative flex flex-col items-center">
        {/* Radar container */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Ambient glow */}
          <div className="absolute inset-0 rounded-full bg-brand-primary/5 blur-[60px]" />

          {/* Radar SVG */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="lc-sweep" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#818cf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
              <filter id="lc-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Concentric rings */}
            {[25, 45, 65, 85].map((r, i) => (
              <circle
                key={r}
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke="#6366f1"
                strokeWidth="0.4"
                strokeOpacity={0.25 - i * 0.04}
              />
            ))}

            {/* Radial lines */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="100"
                y1="100"
                x2={100 + 85 * Math.cos((angle * Math.PI) / 180)}
                y2={100 + 85 * Math.sin((angle * Math.PI) / 180)}
                stroke="#6366f1"
                strokeWidth="0.3"
                strokeOpacity="0.15"
              />
            ))}

            {/* Sweep animation */}
            <g className="animate-radar-sweep">
              <path
                d="M100,100 L100,15 A85,85 0 0,1 160.1,40.9 Z"
                fill="url(#lc-sweep)"
                opacity="0.5"
              />
            </g>

            {/* Second sweep with delay */}
            <g className="animate-radar-sweep [animation-delay:-2s]">
              <path
                d="M100,100 L100,15 A85,85 0 0,1 160.1,40.9 Z"
                fill="url(#lc-sweep)"
                opacity="0.2"
              />
            </g>

            {/* Center point */}
            <circle cx="100" cy="100" r="3" fill="#818cf8" filter="url(#lc-glow)" />
            <line x1="96" y1="100" x2="104" y2="100" stroke="#818cf8" strokeWidth="0.8" />
            <line x1="100" y1="96" x2="100" y2="104" stroke="#818cf8" strokeWidth="0.8" />

            {/* Blips */}
            <circle cx="130" cy="58" r="2" fill="#818cf8" className="animate-login-blip-core" />
            <circle cx="65" cy="135" r="1.5" fill="#6366f1" className="animate-login-blip-core" style={{ animationDelay: '-0.7s' }} />
            <circle cx="155" cy="115" r="1.5" fill="#818cf8" className="animate-login-blip-core" style={{ animationDelay: '-1.2s' }} />
            <circle cx="48" cy="78" r="1.2" fill="#6366f1" className="animate-login-blip-core" style={{ animationDelay: '-1.8s' }} />

            {/* Outer ring — dashed, rotating */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="#6366f1"
              strokeWidth="0.6"
              strokeOpacity="0.4"
              strokeDasharray="4 6"
              className="animate-[radarSweep_10s_infinite_linear_reverse]"
            />
          </svg>
        </div>

        {/* Brand & message */}
        <div className="mt-5 text-center">
          <h2 className="text-xl font-black tracking-[-0.04em] uppercase text-text-main">
            <span className="gradient-logo-icon bg-clip-text text-transparent">NEURO</span>
            <span className="text-text-main ml-1">NOC</span>
          </h2>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.25em] mt-1.5">
            {message}
          </p>
        </div>

        {/* Status indicator */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/[0.07] border border-emerald-500/15">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(52,211,153,0.5)] animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-[0.2em]">
              En línea
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 w-44 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary animate-progress" />
        </div>
      </div>
    </div>
  );
};
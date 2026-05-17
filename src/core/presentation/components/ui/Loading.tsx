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
    overlay: `${containerBase} absolute inset-0 z-50 bg-bg-main/80 rounded-[20px] border border-white/5`,
  };

  return (
    <div className={variants[variant]}>
      <div className="relative flex flex-col items-center">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-primary/5 rounded-full blur-[60px]" />

          {/* Radar SVG */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            <defs>
              {/* Gradiente del sweep */}
              <linearGradient
                id="sweepGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#22c55e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>

              {/* Máscara para el sweep */}
              <mask id="sweepMask">
                <rect width="200" height="200" fill="white" />
                <circle cx="100" cy="100" r="90" fill="black" />
              </mask>

              {/* Filtro de glow */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Círculos concéntricos del radar */}
            {[30, 50, 70, 90].map((radius, i) => (
              <circle
                key={radius}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#22c55e"
                strokeWidth="0.5"
                strokeOpacity={0.3 - i * 0.05}
              />
            ))}

            {/* Líneas radiales */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="100"
                y1="100"
                x2={100 + 90 * Math.cos((angle * Math.PI) / 180)}
                y2={100 + 90 * Math.sin((angle * Math.PI) / 180)}
                stroke="#22c55e"
                strokeWidth="0.5"
                strokeOpacity="0.2"
              />
            ))}

            {/* Sweep animation - área de barrido */}
            <g className="animate-[radarSweep_4s_infinite_linear]">
              <path
                d="M100,100 L100,10 A90,90 0 0,1 163.6,36.4 Z"
                fill="url(#sweepGradient)"
                opacity="0.6"
              />
            </g>

            {/* Segundo sweep con delay */}
            <g
              className="animate-[radarSweep_4s_infinite_linear]"
              style={{ animationDelay: '-2s' }}
            >
              <path
                d="M100,100 L100,10 A90,90 0 0,1 163.6,36.4 Z"
                fill="url(#sweepGradient)"
                opacity="0.3"
              />
            </g>

            {/* Punto central */}
            <circle
              cx="100"
              cy="100"
              r="4"
              fill="#22c55e"
              filter="url(#glow)"
            />

            {/* Cruceta central */}
            <line
              x1="96"
              y1="100"
              x2="104"
              y2="100"
              stroke="#22c55e"
              strokeWidth="1"
            />
            <line
              x1="100"
              y1="96"
              x2="100"
              y2="104"
              stroke="#22c55e"
              strokeWidth="1"
            />

            {/* Puntos de contacto aleatorios (blips) */}
            <circle
              cx="130"
              cy="60"
              r="2"
              fill="#22c55e"
              className="animate-[blip_2s_infinite_ease-in-out]"
            />
            <circle
              cx="70"
              cy="140"
              r="1.5"
              fill="#22c55e"
              className="animate-[blip_2.5s_infinite_ease-in-out]"
              style={{ animationDelay: '-0.5s' }}
            />
            <circle
              cx="160"
              cy="120"
              r="1"
              fill="#22c55e"
              className="animate-[blip_1.8s_infinite_ease-in-out]"
              style={{ animationDelay: '-1s' }}
            />
            <circle
              cx="45"
              cy="80"
              r="1.5"
              fill="#22c55e"
              className="animate-[blip_2.2s_infinite_ease-in-out]"
              style={{ animationDelay: '-1.5s' }}
            />

            {/* Anillo exterior */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#22c55e"
              strokeWidth="1"
              strokeOpacity="0.6"
              strokeDasharray="4 4"
              className="animate-[rotate_10s_infinite_linear_reverse]"
            />
          </svg>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-2xl font-black text-text-main tracking-tighter mb-1">
            NEURO NOC
          </h2>
          <p className="text-[12px] font-bold text-text-muted uppercase tracking-[0.2em]">
            {message}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-[9px] text-brand-accent/60 font-mono animate-pulse">
              Monitoreando
            </span>
            <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping" />
          </div>
        </div>

        <div className="mt-6 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-brand-accent animate-[progress_2s_infinite_ease-in-out]" />
        </div>
      </div>
    </div>
  );
};

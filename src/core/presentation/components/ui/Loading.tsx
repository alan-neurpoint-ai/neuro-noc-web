interface LoadingProps {
  message?: string;
  variant?: 'fullscreen' | 'overlay';
}

export const Loading = ({
  message = 'Espere un momento por favor...',
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
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute w-32 h-32 bg-brand-primary/20 rounded-full blur-[50px] animate-pulse" />

          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(178,154,244,0.5)]"
          >
            <defs>
              <linearGradient
                id="liquidGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="var(--color-brand-accent)"
                  stopOpacity="0.8"
                />
                <stop offset="100%" stopColor="var(--color-brand-primary)" />
              </linearGradient>

              <mask id="flaskMask">
                <path
                  d="M35,15 L35,40 C35,40 20,45 20,65 C20,85 35,95 50,95 C65,95 80,85 80,65 C80,45 65,40 65,40 L65,15 Z"
                  fill="white"
                />
              </mask>
            </defs>

            <path
              d="M35,15 L35,40 C35,40 20,45 20,65 C20,85 35,95 50,95 C65,95 80,85 80,65 C80,45 65,40 65,40 L65,15 Z"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeOpacity="0.8"
              strokeLinecap="round"
            />

            <g mask="url(#flaskMask)">
              <rect
                x="0"
                y="55"
                width="100"
                height="100"
                fill="url(#liquidGradient)"
                className="animate-[wave_3s_infinite_linear]"
              />
            </g>

            <circle
              cx="45"
              cy="80"
              r="1.5"
              fill="white"
              className="animate-[float_2s_infinite_ease-in] opacity-0"
              style={{ animationDelay: '0s' }}
            />
            <circle
              cx="55"
              cy="70"
              r="1"
              fill="white"
              className="animate-[float_2.5s_infinite_ease-in] opacity-0"
              style={{ animationDelay: '0.5s' }}
            />
            <circle
              cx="50"
              cy="85"
              r="2"
              fill="white"
              className="animate-[float_3s_infinite_ease-in] opacity-0"
              style={{ animationDelay: '1s' }}
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
              Procesando...
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

import React, { useMemo, useRef, useState, useCallback } from "react";

export interface DataPoint {
  value: number;
  label?: string;
}

export interface LineChartProps {
  data: DataPoint[];
  height?: number;
  lineColor?: string;
  strokeWidth?: number;
  className?: string;
  title?: string;
  subtitle?: string;
  showDelta?: boolean;
  unit?: string;
}

const THEME = {
  accent: "#b29af4",
  primary: "#672da9",
  up: "#34d399",
  down: "#f87171",
  grid: "rgba(103,45,169,0.15)",
  gridSoft: "rgba(103,45,169,0.05)",
};

const fmt = (n: number, unit = "") =>
  `${unit}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const LineChart: React.FC<LineChartProps> = ({
  data = [],
  height = 200,
  lineColor,
  strokeWidth = 2.5,
  className = "",
  title,
  subtitle,
  showDelta = true,
  unit = "",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hov, setHov] = useState<{ x: number; y: number; idx: number } | null>(null);

  const { points, pathD, areaD, delta, positive, last } = useMemo(() => {
    if (data.length < 2) return { points: [], pathD: "", areaD: "", delta: 0, positive: true, last: 0 };

    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = (max - min) || 1;
    
    // Padding vertical para que la gráfica no toque los bordes
    const pts = data.map((d, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: 90 - ((d.value - min) / range) * 80,
      raw: d.value,
      label: d.label,
    }));

    // Algoritmo de suavizado para curva orgánica
    const path = pts.reduce((acc, p, i, a) => {
      if (i === 0) return `M ${p.x},${p.y}`;
      const prev = a[i - 1];
      const cp1x = prev.x + (p.x - prev.x) / 2.5;
      const cp2x = p.x - (p.x - prev.x) / 2.5;
      return `${acc} C ${cp1x},${prev.y} ${cp2x},${p.y} ${p.x},${p.y}`;
    }, "");

    return {
      points: pts,
      pathD: path,
      areaD: `${path} L 100,110 L 0,110 Z`,
      last: values[values.length - 1],
      delta: values[0] !== 0 ? ((values[values.length - 1] - values[0]) / Math.abs(values[0])) * 100 : 0,
      positive: values[values.length - 1] >= values[0],
    };
  }, [data]);

  const stroke = lineColor ?? (positive ? "#4ade80" : "#f87171");

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current || points.length === 0) return;
      const rect = svgRef.current.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const idx = Math.max(0, Math.min(points.length - 1, Math.round((px / 100) * (points.length - 1))));
      setHov({ x: points[idx].x, y: points[idx].y, idx });
    },
    [points]
  );

  if (data.length === 0) return null;

  return (
    <div className={`w-full flex flex-col rounded-3xl overflow-hidden bg-[#130d2e] border border-white/5 shadow-2xl ${className}`}>
      {/* Header Info */}
      <div className="px-6 py-5 flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          {title && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b29af4]">{title}</span>}
          {subtitle && <span className="text-xs text-gray-400 font-medium opacity-60">{subtitle}</span>}
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {fmt(hov !== null ? data[hov.idx].value : last, unit)}
          </div>
          {showDelta && (
            <div className={`text-[10px] font-bold mt-1 ${positive ? "text-emerald-400" : "text-red-400"}`}>
              {positive ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      {/* Gráfica Container */}
      <div className="relative w-full px-2" style={{ height }}>
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible pointer-events-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHov(null)}
        >
          <defs>
            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.3" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
            <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines horizontales */}
          {[20, 50, 80].map((v) => (
            <line key={v} x1="0" y1={v} x2="100" y2={v} stroke={THEME.grid} strokeWidth="0.2" />
          ))}

          {/* Área y Línea */}
          <path d={areaD} fill="url(#area-grad)" />
          <path
            d={pathD}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            filter="url(#glow-line)"
            strokeLinecap="round"
            style={{ vectorEffect: "non-scaling-stroke" }}
          />

          {/* Indicador Hover */}
          {hov && (
            <g>
              <line x1={hov.x} y1="0" x2={hov.x} y2="100" stroke={stroke} strokeWidth="0.2" strokeDasharray="2,2" opacity="0.5" />
              <circle cx={hov.x} cy={hov.y} r="1.5" fill={stroke} filter="url(#glow-line)" />
              <circle cx={hov.x} cy={hov.y} r="0.8" fill="white" />
            </g>
          )}
        </svg>

        {/* Tooltip HTML para mejor resolución */}
        {hov && data[hov.idx] && (
          <div
            className="absolute z-10 pointer-events-none backdrop-blur-xl bg-black/60 px-3 py-2 rounded-xl border border-white/10 shadow-2xl transition-all duration-200"
            style={{
              left: hov.x > 80 ? "auto" : `${hov.x}%`,
              right: hov.x > 80 ? `${100 - hov.x}%` : "auto",
              top: `${hov.y - 45}%`,
              transform: hov.x > 80 ? "translateX(0)" : "translateX(10px)",
            }}
          >
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">{data[hov.idx].label}</p>
            <p className="text-sm font-black font-mono" style={{ color: stroke }}>{fmt(data[hov.idx].value, unit)}</p>
          </div>
        )}
      </div>

      {/* Etiquetas de Eje X */}
      <div className="px-6 py-4 flex justify-between">
        {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1).map((d, i) => (
          <span key={i} className="text-[9px] font-bold font-mono text-gray-500 uppercase tracking-tighter opacity-40">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};
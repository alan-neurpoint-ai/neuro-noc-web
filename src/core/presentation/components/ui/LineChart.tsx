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
  grid: "rgba(103,45,169,0.38)",
  gridSoft: "rgba(103,45,169,0.14)",
};

const fmt = (n: number, unit = "") =>
  `${unit}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const LineChart: React.FC<LineChartProps> = ({
  data = [],
  height = 220,
  lineColor,
  strokeWidth = 2,
  className = "",
  title,
  subtitle,
  showDelta = true,
  unit = "",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hov, setHov] = useState<{ x: number; y: number; idx: number } | null>(
    null,
  );

  const { points, pathD, areaD, delta, positive, last } = useMemo(() => {
    if (data.length < 2)
      return {
        points: [],
        pathD: "",
        areaD: "",
        delta: 0,
        positive: true,
        last: 0,
      };

    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const lastVal = values[values.length - 1];
    const firstVal = values[0];

    const pts = data.map((d, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: 100 - ((d.value - min) / range) * 100,
      raw: d.value,
      label: d.label,
    }));

    const path = pts.reduce((acc, p, i, a) => {
      if (i === 0) return `M ${p.x},${p.y}`;
      const prev = a[i - 1];
      const cp1x = prev.x + (p.x - prev.x) / 2;
      return `${acc} C ${cp1x},${prev.y} ${cp1x},${p.y} ${p.x},${p.y}`;
    }, "");

    return {
      points: pts,
      pathD: path,
      areaD: `${path} L 100,105 L 0,105 Z`,
      last: lastVal,
      delta:
        firstVal !== 0 ? ((lastVal - firstVal) / Math.abs(firstVal)) * 100 : 0,
      positive: lastVal >= firstVal,
    };
  }, [data]);

  const stroke = lineColor ?? (positive ? THEME.up : THEME.down);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current || points.length === 0) return;
      const rect = svgRef.current.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const idx = Math.max(
        0,
        Math.min(
          points.length - 1,
          Math.round((px / 100) * (points.length - 1)),
        ),
      );
      setHov({ x: points[idx].x, y: points[idx].y, idx });
    },
    [points],
  );

  if (data.length === 0) return null;

  const displayValue = hov !== null ? data[hov.idx]?.value : last;

  return (
    <div
      className={`w-full h-120 flex flex-col rounded-2xl overflow-hidden shadow-2xl ${className}`}
      style={{
        background:
          "linear-gradient(160deg, #2d1b69 0%, #1a0f3e 55%, #0d0820 100%)",
        border: `1px solid ${positive ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)"}`,
      }}
    >
      <div
        className="h-0.75 w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${stroke} 30%, ${THEME.primary} 70%, transparent)`,
        }}
      />

      <div className="px-5 py-4 flex justify-between items-start border-b border-white/5">
        <div className="flex flex-col">
          {title && (
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">
              {title}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-gray-400/60">{subtitle}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xl font-black text-white font-mono"
            style={{ textShadow: `0 0 20px ${stroke}44` }}
          >
            {fmt(displayValue, unit)}
          </span>
          {showDelta && (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${positive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}
            >
              {positive ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}%
            </span>
          )}
        </div>
      </div>

      <div className="relative w-full flex-1" style={{ height }}>
        <svg
          ref={svgRef}
          viewBox="0 -4 100 112"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible pointer-events-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHov(null)}
        >
          <defs>
            <linearGradient id="lc-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
            <filter id="lc-glow">
              <feGaussianBlur stdDeviation="1.5" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[0, 25, 50, 75, 100].map((lvl) => (
            <line
              key={lvl}
              x1="0"
              y1={lvl}
              x2="100"
              y2={lvl}
              stroke={lvl === 100 ? THEME.grid : THEME.gridSoft}
              strokeWidth="0.3"
            />
          ))}

          {points.map((p, i) => (
            <line
              key={i}
              x1={p.x}
              y1="0"
              x2={p.x}
              y2="100"
              stroke={THEME.grid}
              strokeWidth="0.2"
              opacity="0.5"
            />
          ))}

          <path d={areaD} fill="url(#lc-area-grad)" />
          <path
            d={pathD}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            filter="url(#lc-glow)"
            style={{ vectorEffect: "non-scaling-stroke" }}
          />

          {hov && (
            <g>
              <line
                x1={hov.x}
                y1="0"
                x2={hov.x}
                y2="100"
                stroke={THEME.accent}
                strokeWidth="0.4"
                strokeDasharray="2,2"
                opacity="0.6"
              />
              <circle cx={hov.x} cy={hov.y} r="2" fill={stroke} opacity="0.3" />
              <circle
                cx={hov.x}
                cy={hov.y}
                r="1.2"
                fill="white"
                stroke={stroke}
                strokeWidth="0.5"
              />
            </g>
          )}
        </svg>

        {hov && data[hov.idx] && (
          <div
            className="absolute top-2 pointer-events-none backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-xl"
            style={{
              left: hov.x > 75 ? "auto" : `calc(${hov.x}% + 12px)`,
              right: hov.x > 75 ? `calc(${100 - hov.x}% + 12px)` : "auto",
              background: "rgba(13,8,32,0.85)",
            }}
          >
            {data[hov.idx].label && (
              <div className="text-[9px] font-bold text-gray-500 uppercase">
                {data[hov.idx].label}
              </div>
            )}
            <div
              className="text-sm font-black font-mono"
              style={{ color: stroke }}
            >
              {fmt(data[hov.idx].value, unit)}
            </div>
          </div>
        )}
      </div>

      {data.some((d) => d.label) && (
        <div className="px-5 pb-3 pt-2 flex justify-between border-t border-white/5">
          {data.map((d, i) => (
            <span
              key={i}
              className="text-[8px] font-mono font-bold uppercase tracking-tighter"
              style={{
                color: hov?.idx === i ? THEME.accent : "rgba(178,154,244,0.3)",
              }}
            >
              {d.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useMemo, useRef, useState, useCallback } from 'react';

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

const fmt = (n: number, unit = '') => {
  const isWhole = Number.isInteger(n);
  return `${unit}${n.toLocaleString('en-US', {
    minimumFractionDigits: isWhole ? 0 : 1,
    maximumFractionDigits: isWhole ? 0 : 1,
  })}`;
};

export const LineChart: React.FC<LineChartProps> = ({
  data = [],
  height = 200,
  lineColor,
  strokeWidth = 2.5,
  className = '',
  title,
  subtitle,
  showDelta = true,
  unit = '',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hov, setHov] = useState<{ x: number; y: number; idx: number } | null>(null);

  const chartId = useMemo(() => `lc-${Math.random().toString(36).slice(2, 8)}`, []);

  const { points, pathD, areaD, delta, positive, last, minVal, maxVal } = useMemo(() => {
    if (data.length < 2) return { points: [], pathD: '', areaD: '', delta: 0, positive: true, last: 0, minVal: 0, maxVal: 0 };

    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = (max - min) || 1;

    const pts = data.map((d, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: 85 - ((d.value - min) / range) * 70,
      raw: d.value,
      label: d.label,
    }));

    const path = pts.reduce((acc, p, i, a) => {
      if (i === 0) return `M ${p.x},${p.y}`;
      const prev = a[i - 1];
      const cp1x = prev.x + (p.x - prev.x) / 2.5;
      const cp2x = p.x - (p.x - prev.x) / 2.5;
      return `${acc} C ${cp1x},${prev.y} ${cp2x},${p.y} ${p.x},${p.y}`;
    }, '');

    return {
      points: pts,
      pathD: path,
      areaD: `${path} L 100,100 L 0,100 Z`,
      last: values[values.length - 1],
      delta: values[0] !== 0 ? ((values[values.length - 1] - values[0]) / Math.abs(values[0])) * 100 : 0,
      positive: values[values.length - 1] >= values[0],
      minVal: min,
      maxVal: max,
    };
  }, [data]);

  const stroke = lineColor ?? (positive ? '#34d399' : '#f87171');

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current || points.length === 0) return;
      const rect = svgRef.current.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const idx = Math.max(0, Math.min(points.length - 1, Math.round((px / 100) * (points.length - 1))));
      setHov({ x: points[idx].x, y: points[idx].y, idx });
    },
    [points],
  );

  if (data.length === 0) return null;

  const gridYPositions = [20, 45, 70];

  return (
    <div className={`w-full flex flex-col rounded-2xl overflow-hidden bg-bg-card/50 backdrop-blur-xl border border-[var(--border-subtle)] shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] ${className}`}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          {title && (
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">
              {title}
            </p>
          )}
          {subtitle && (
            <p className="text-[11px] text-text-muted font-medium opacity-70">
              {subtitle}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-text-main font-mono tracking-tight">
            {fmt(hov !== null ? data[hov.idx].value : last, unit)}
          </div>
          {showDelta && (
            <div className={`inline-flex items-center gap-1 text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded-md ${
              positive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}>
              <span>{positive ? '↑' : '↓'}</span>
              <span>{Math.abs(delta).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full px-3" style={{ height }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between pointer-events-none z-10">
          {gridYPositions.map((yPct, i) => {
            const val = maxVal - (i / (gridYPositions.length - 1)) * (maxVal - minVal);
            return (
              <span key={i} className="text-[8px] font-mono font-bold text-text-muted/30 text-right pr-1">
                {Math.round(val)}
              </span>
            );
          })}
        </div>

        <div className="ml-8 h-full relative">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible pointer-events-auto"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHov(null)}
          >
            <defs>
              <linearGradient id={`area-grad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity="0.2" />
                <stop offset="100%" stopColor={stroke} stopOpacity="0" />
              </linearGradient>
              <filter id={`glow-${chartId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid lines */}
            {gridYPositions.map((v) => (
              <line key={v} x1="0" y1={v} x2="100" y2={v} stroke="var(--border-subtle)" strokeWidth="0.2" opacity="0.5" />
            ))}

            {/* Area fill */}
            <path d={areaD} fill={`url(#area-grad-${chartId})`} />

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
              filter={`url(#glow-${chartId})`}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Hover indicator */}
            {hov && (
              <g>
                <line x1={hov.x} y1="0" x2={hov.x} y2="100" stroke={stroke} strokeWidth="0.15" strokeDasharray="2,2" opacity="0.4" />
                <circle cx={hov.x} cy={hov.y} r="2" fill={stroke} filter={`url(#glow-${chartId})`} />
                <circle cx={hov.x} cy={hov.y} r="1" fill="var(--bg-card)" />
              </g>
            )}

            {/* Last point dot */}
            {!hov && points.length > 0 && (
              <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="1.5" fill={stroke} />
            )}
          </svg>

          {/* Tooltip */}
          {hov && data[hov.idx] && (
            <div
              className="absolute z-10 pointer-events-none px-3 py-2 rounded-xl border border-border-subtle shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
              style={{
                left: hov.x > 75 ? 'auto' : `${hov.x}%`,
                right: hov.x > 75 ? `${100 - hov.x}%` : 'auto',
                top: `${hov.y - 45}%`,
                transform: hov.x > 75 ? 'translateX(0)' : 'translateX(10px)',
                backgroundColor: 'var(--bg-card)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-0.5">
                {data[hov.idx].label}
              </p>
              <p className="text-sm font-black font-mono" style={{ color: stroke }}>
                {fmt(data[hov.idx].value, unit)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="px-14 py-3 flex justify-between">
        {data.map((d, i) => {
          const show = i === 0 || i === data.length - 1 || data.length <= 5 || i % Math.ceil(data.length / 4) === 0;
          if (!show) return <span key={i} className="flex-1" />;
          return (
            <span key={i} className="text-[8px] font-mono font-bold text-text-muted uppercase tracking-tight" style={{ opacity: hov !== null && hov.idx === i ? 1 : 0.4 }}>
              {d.label}
            </span>
          );
        })}
      </div>
    </div>
  );
};
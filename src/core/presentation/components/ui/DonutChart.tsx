import React, { useMemo, useState } from "react";

export interface PieData {
  strokeDashoffset: string | number | undefined;
  strokeDasharray: string | number | undefined;
  percent?: string;
  label: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: PieData[];
  size?: number;
  thickness?: number;
  title?: string;
  unit?: string;
  className?: string;
}

const DEFAULT_COLORS = [
  "#b29af4",
  "#672da9",
  "#34d399",
  "#f87171",
  "#fbbf24",
  "#3b82f6",
];

export const DonutChart: React.FC<DonutChartProps> = ({
  data = [],
  size = 200,
  thickness = 22,
  title = "Distribution",
  unit = "",
  className = "",
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const { segments, total } = useMemo(() => {
    const sum = data.reduce((acc, d) => acc + d.value, 0);

    const segs = data.reduce<
      typeof data &
        {
          percent: string;
          strokeDasharray: string;
          strokeDashoffset: number;
          color: string;
        }[]
    >((acc, d, i) => {
      const cumulativePercent = acc.reduce(
        (cum, seg) => cum + parseFloat(seg.percent!) / 100,
        0,
      );
      const percent = d.value / (sum || 1);
      const strokeDasharray = `${percent * 100} 100`;
      const strokeDashoffset = -cumulativePercent * 100;

      return [
        ...acc,
        {
          ...d,
          percent: (percent * 100).toFixed(1),
          strokeDasharray,
          strokeDashoffset,
          color: d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        },
      ];
    }, []);

    return { segments: segs, total: sum };
  }, [data]);

  if (data.length === 0) return null;

  return (
    <div
      className={`flex flex-col p-5 rounded-2xl border border-border-subtle shadow-2xl ${className}`}
      style={{
        background: "linear-gradient(160deg, #2d1b69 0%, var(--bg-elevated) 100%)",
      }}
    >
      <div className="mb-4 border-b border-border-subtle pb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent">
          {title}
        </span>
      </div>

      <div className="flex items-center justify-between gap-8">
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            viewBox="0 0 42 42"
            className="w-full h-full -rotate-90 overflow-visible"
          >
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={seg.color}
                strokeWidth={activeIdx === i ? thickness + 2 : thickness}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                style={{
                  filter:
                    activeIdx === i
                      ? `drop-shadow(0 0 8px ${seg.color}88)`
                      : "none",
                }}
              />
            ))}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-tighter">
              {activeIdx !== null ? segments[activeIdx].label : "Total"}
            </span>
            <span className="text-xl font-black font-mono text-text-main">
              {activeIdx !== null
                ? `${segments[activeIdx].percent}%`
                : total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {segments.map((seg, i) => (
            <div
              key={i}
              className={`flex items-center justify-between gap-3 transition-opacity ${activeIdx !== null && activeIdx !== i ? "opacity-30" : "opacity-100"}`}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-[11px] font-bold text-text-muted truncate uppercase tracking-tight">
                  {seg.label}
                </span>
              </div>
              <span className="text-[11px] font-mono text-text-main">
                {seg.value}
                {unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { type ReactNode } from "react";

type CardStatus = "online" | "offline" | "warning";
interface CardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: CardStatus;
  children?: ReactNode;
  className?: string;
}

export const Card = ({
  title,
  subtitle,
  value,
  icon,
  trend,
  status,
  children,
  className = "",
}: CardProps) => {
  const statusColors: Record<CardStatus, string> = {
    online: "bg-emerald-500",
    offline: "bg-red-500",
    warning: "bg-orange-500",
  };

  return (
    <div
      className={`glass-card p-5 flex flex-col gap-4 min-w-70 transition-all duration-300 hover:border-accent/30 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
            {title}
          </h4>
          {subtitle && (
            <span className="text-xs text-text-secondary font-light italic">
              {subtitle}
            </span>
          )}
        </div>

        {icon && (
          <div className="text-blue-glow/60 p-2 bg-blue-primary/30 rounded-sm">
            {icon}
          </div>
        )}
      </div>

      {(value !== undefined || trend || status) && (
        <div className="flex items-end justify-between mt-2">
          <div className="flex items-baseline gap-2">
            {value !== undefined && (
              <span className="text-3xl font-light tracking-tight text-text-primary">
                {value}
              </span>
            )}

            {status && (
              <div
                data-testid="status-indicator"
                className={`w-2 h-2 rounded-full animate-pulse ${statusColors[status]}`}
              />
            )}
          </div>

          {trend && (
            <div
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                trend.isPositive
                  ? "text-emerald-400 border-emerald-900/30 bg-emerald-950/10"
                  : "text-red-400 border-red-900/30 bg-red-950/10"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      )}

      {children && (
        <div className="mt-2 border-t border-muted/10 pt-4">{children}</div>
      )}
    </div>
  );
};

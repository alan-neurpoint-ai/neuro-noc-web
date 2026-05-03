import { type ReactNode } from "react";

type CardStatus = "online" | "offline" | "warning";
type CardVariant = "default" | "compact" | "large";

interface CardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  status?: CardStatus;
  children?: ReactNode;
  className?: string;
  variant?: CardVariant;
  loading?: boolean;
  footer?: ReactNode;
}

const statusConfig = {
  online: {
    color: "emerald",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    dot: "bg-emerald-500",
    label: "Operativo",
  },
  offline: {
    color: "red",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    dot: "bg-red-500",
    label: "Inactivo",
  },
  warning: {
    color: "amber",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-500",
    label: "Advertencia",
  },
};

const variantConfig = {
  default: "p-5 gap-4",
  compact: "p-3 gap-2",
  large: "p-6 gap-5",
};

const valueSizeConfig = {
  default: "text-3xl",
  compact: "text-xl",
  large: "text-4xl",
};

export const Card = ({
  title,
  subtitle,
  value,
  icon,
  trend,
  status,
  children,
  className = "",
  variant = "default",
  loading = false,
  footer,
}: CardProps) => {
  const statusInfo = status ? statusConfig[status] : null;
  const variantStyles = variantConfig[variant];
  const valueSize = valueSizeConfig[variant];

  if (loading) {
    return (
      <div
        className={`
          glass-card ${variantStyles} min-w-70
          transition-all duration-300 hover:border-accent/30
          ${className}
        `}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-3 bg-muted/20 rounded animate-pulse w-24" />
            <div className="h-8 bg-muted/20 rounded animate-pulse w-32 mt-1" />
          </div>
          <div className="w-10 h-10 bg-muted/20 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        group relative overflow-hidden
        bg-linear-to-br from-surface/40 to-surface/20
        backdrop-blur-sm border border-muted/20
        rounded-xl ${variantStyles}
        transition-all duration-500
        hover:border-accent/30 hover:shadow-[0_0_30px_rgba(197,160,89,0.1)]
        hover:-translate-y-0.5
        ${className}
      `}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-linear-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all duration-700" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
              {title}
            </h4>
            {statusInfo && (
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusInfo.dot}`}
                />
                <span
                  className={`text-[8px] uppercase tracking-wider ${statusInfo.text}`}
                >
                  {statusInfo.label}
                </span>
              </div>
            )}
          </div>
          {subtitle && (
            <span className="text-xs text-text-secondary/70 font-light">
              {subtitle}
            </span>
          )}
        </div>

        {icon && (
          <div
            className={`
              text-accent p-2 rounded-lg
              bg-linear-to-br from-accent/10 to-accent/5
              border border-accent/20
              group-hover:scale-110 group-hover:from-accent/20
              transition-all duration-300
            `}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value Section */}
      {(value !== undefined || trend) && (
        <div className="relative z-10 flex items-end justify-between mt-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            {value !== undefined && (
              <span
                className={`${valueSize} font-black tracking-tight text-text-primary`}
              >
                {value}
              </span>
            )}
          </div>

          {trend && (
            <div
              className={`
                flex items-center gap-1.5
                text-[10px] font-bold px-2 py-1 rounded-full
                ${
                  trend.isPositive
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                }
              `}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              {trend.label && (
                <span className="text-[8px] opacity-70">{trend.label}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Children */}
      {children && (
        <div className="relative z-10 mt-3 pt-3 border-t border-muted/20">
          {children}
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="relative z-10 mt-2 pt-2 text-right">{footer}</div>
      )}
    </div>
  );
};

import type { InfoRowProps } from "../../../../core/entities/analytics";

export const InfoRow = ({ label, value, icon }: InfoRowProps) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-surface/20 border border-muted/10 hover:border-accent/20 transition-all">
    <div className="text-accent/60 mt-0.5">{icon}</div>
    <div className="flex-1">
      <p className="text-[9px] uppercase tracking-wider text-accent/70 font-bold">
        {label}
      </p>
      <p className="text-sm text-text-primary font-medium mt-0.5">
        {value || "—"}
      </p>
    </div>
  </div>
);

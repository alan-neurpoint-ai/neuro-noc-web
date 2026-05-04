export const CRITICALITY_COLORS: Record<string, string> = {
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Average: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Information: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export const DEFAULT_CRITICALITY_COLOR = CRITICALITY_COLORS.Information;
export const STATUS_COLORS: Record<string, string> = {
  RESOLVED: "bg-emerald-500/20 text-emerald-400",
  DISCARDED: "bg-gray-500/20 text-gray-400",
  ACKNOWLEDGED: "bg-accent/20 text-accent",
  PROBLEM: "bg-rose-500/20 text-rose-400",
};

export const DEFAULT_STATUS_COLOR = STATUS_COLORS.PROBLEM;

export const STATUS_TEXTS: Record<string, string> = {
  RESOLVED: "Resuelto",
  DISCARDED: "Descartado",
  ACKNOWLEDGED: "En Proceso",
  PROBLEM: "Sin Resolver",
};

export const DEFAULT_STATUS_TEXT = "Desconocido";

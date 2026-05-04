export const getCriticalityColor = (criticality: string): string => {
  const colors: Record<string, string> = {
    Critical: "bg-red-500/20 text-red-400 border-red-500/30",
    High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Average: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Information: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };
  return colors[criticality] || colors.Information;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    RESOLVED: "bg-emerald-500/20 text-emerald-400",
    DISCARDED: "bg-gray-500/20 text-gray-400",
    ACKNOWLEDGED: "bg-accent/20 text-accent",
    PROBLEM: "bg-rose-500/20 text-rose-400",
  };
  return colors[status] || colors.PROBLEM;
};

export const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    RESOLVED: "Resuelto",
    DISCARDED: "Descartado",
    ACKNOWLEDGED: "En Proceso",
    PROBLEM: "Sin Resolver",
  };
  return texts[status] || status;
};

import {
  HiOfficeBuilding,
  HiCheckCircle,
  HiClock,
  HiCreditCard,
} from "react-icons/hi";
import type { AlertStats } from "../../../../core/entities/analytics";
import { Card } from "../../../components/ui";
interface ClientStatsProps {
  stats: AlertStats;
  resolutionRate: string;
  isLoadingStats: boolean;
  selectedClientName: string;
}

export const ClientStats = ({
  stats,
  resolutionRate,
  isLoadingStats,
}: ClientStatsProps) => (
  <div className="mb-10">
    <div className="flex items-center gap-2 mb-5">
      <div className="p-1.5 bg-accent/10 rounded-lg">
        <HiOfficeBuilding className="text-accent text-sm" />
      </div>
      <h2 className="text-[11px] uppercase tracking-[0.25em] text-accent font-black">
        Estadísticas del Sistema
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <Card
        title="Alertas Totales"
        value={isLoadingStats ? "..." : stats.total}
        icon={<HiOfficeBuilding size={20} />}
      />
      <Card
        title="Alertas Críticas"
        value={isLoadingStats ? "..." : stats.critical}
        icon={<HiCheckCircle size={20} />}
      />
      <Card
        title="Tasa de Resolución"
        value={`${resolutionRate}%`}
        icon={<HiClock size={20} />}
        subtitle={`${stats.resolved} de ${stats.total} resueltas`}
      />
      <Card
        title="Facturación"
        value="En desarrollo"
        icon={<HiCreditCard size={20} />}
        subtitle="Próximamente"
      />
    </div>
  </div>
);

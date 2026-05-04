import { HiBell, HiTrendingUp, HiCheckCircle, HiClock } from "react-icons/hi";
import { Card } from "../../../components/ui";

interface AlertStatsCardsProps {
  total: number;
  critical: number;
  resolved: number;
  pending: number;
}

export const AlertStatsCards = ({
  total,
  critical,
  resolved,
  pending,
}: AlertStatsCardsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
    <Card title="Alertas Totales" value={total} icon={<HiBell size={20} />} />
    <Card
      title="Alertas Críticas"
      value={critical}
      icon={<HiTrendingUp size={20} />}
      subtitle="Requieren atención inmediata"
    />
    <Card
      title="Tasa de Resolución"
      value={`${total > 0 ? ((resolved / total) * 100).toFixed(1) : 0}%`}
      icon={<HiCheckCircle size={20} />}
    />
    <Card
      title="Alertas Pendientes"
      value={pending}
      icon={<HiClock size={20} />}
    />
  </div>
);

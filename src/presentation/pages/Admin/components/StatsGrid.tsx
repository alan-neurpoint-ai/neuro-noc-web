import type { AnalyticsData } from "../../../../core/entities/analytics/analytics";
import { Card } from "../../../components/ui";
import {
  HiBell,
  HiTrendingUp,
  HiCheckCircle,
  HiClock,
  HiServer,
  HiMail,
} from "react-icons/hi";

interface StatsGridProps {
  analytics: AnalyticsData;
  isLoading: boolean;
}

export const StatsGrid = ({ analytics, isLoading }: StatsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-surface/30 border border-muted/20 rounded-xl p-6 animate-pulse"
          >
            <div className="h-4 bg-muted/20 rounded w-24 mb-4" />
            <div className="h-8 bg-muted/20 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card
          title="Alertas Totales"
          value={analytics.totalAlerts}
          icon={<HiBell size={20} />}
        />
        <Card
          title="Alertas Críticas"
          value={analytics.criticalAlerts}
          icon={<HiTrendingUp size={20} />}
          subtitle="Requieren atención inmediata"
        />
        <Card
          title="Tasa de Resolución"
          value={`${analytics.resolutionRate.toFixed(1)}%`}
          icon={<HiCheckCircle size={20} />}
        />
        <Card
          title="Tiempo Promedio Respuesta"
          value={`${analytics.avgResponseTime} min`}
          icon={<HiClock size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card
          title="Acciones Enviadas"
          value={analytics.actionsSent}
          icon={<HiBell size={20} />}
          subtitle="n8n + VAPI + Email"
        />
        <Card
          title="Correos Enviados"
          value={analytics.emailsSent}
          icon={<HiMail size={20} />}
        />
        <Card
          title="Nodos Activos"
          value={analytics.activeNodes}
          icon={<HiServer size={20} />}
        />
        <Card
          title="Alertas Resueltas"
          value={analytics.resolvedAlerts}
          icon={<HiCheckCircle size={20} />}
          subtitle={`${analytics.totalAlerts > 0 ? ((analytics.resolvedAlerts / analytics.totalAlerts) * 100).toFixed(1) : 0}% del total`}
        />
      </div>
    </>
  );
};

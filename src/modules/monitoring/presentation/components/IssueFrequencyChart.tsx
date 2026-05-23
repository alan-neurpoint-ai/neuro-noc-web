import { BiBarChart } from 'react-icons/bi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AlertRow } from '../../../../core/types/monitoring/alerts.sql';

interface AlertChartsProps {
  alerts: AlertRow[];
}

const getIssueFrequency = (alerts: AlertRow[]) => {
  const issueCounts: Record<string, number> = {};
  alerts.forEach((alert) => {
    issueCounts[alert.issue] = (issueCounts[alert.issue] || 0) + 1;
  });

  return Object.entries(issueCounts)
    .map(([name, value]) => ({
      name: name.length > 25 ? name.substring(0, 25) + '...' : name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
};

export const IssueFrequencyChart = ({ alerts }: AlertChartsProps) => {
  const data = getIssueFrequency(alerts);

  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
        <BiBarChart className="text-brand-accent" />
        Problemas Más Frecuentes
      </h3>
      {alerts.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle)"
              />
              <XAxis
                dataKey="name"
                stroke="var(--text-muted)"
                fontSize={10}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={10}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-text-muted">
          No hay datos para mostrar
        </div>
      )}
    </div>
  );
};

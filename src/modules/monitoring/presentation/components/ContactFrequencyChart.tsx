import { BiPieChart } from 'react-icons/bi';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ContactFrequencyChartProps {
  data: { name: string; value: number }[];
  loading: boolean;
}

const COLORS = [
  '#6366f1',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#14b8a6',
];

export const ContactFrequencyChart = ({
  data,
  loading,
}: ContactFrequencyChartProps) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
        <BiPieChart className="text-brand-accent" />
        Contactos Más Contactados
      </h3>
      {loading ? (
        <div className="h-64 flex items-center justify-center text-text-muted">
          Cargando...
        </div>
      ) : data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                }}
              />
              <Legend wrapperStyle={{ color: 'var(--text-main)', fontSize: '12px' }} />
            </PieChart>
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

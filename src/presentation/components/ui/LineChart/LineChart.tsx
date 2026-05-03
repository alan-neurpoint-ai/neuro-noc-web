import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  alerts: number;
}

interface CustomLineChartProps {
  data: DataPoint[];
  title?: string;
  subtitle?: string;
  dataKey?: string;
  color?: string;
}

export const CustomLineChart = ({
  data,
  title,
  subtitle,
  dataKey = "value",
  color = "#c5a059",
}: CustomLineChartProps) => {
  return (
    <div className="bg-surface/30 border border-muted/20 rounded-xl p-6">
      {title && (
        <div className="mb-4">
          <h3 className="text-sm uppercase tracking-wider text-accent font-bold">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-text-muted mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} /> 
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={10} />
          <YAxis stroke="#6b7280" fontSize={10} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #c5a059",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#c5a059" }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill="url(#colorValue)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

import { CustomLineChart } from "../../../components/ui/LineChart/LineChart";

interface AlertChartProps {
  data: { name: string; value: number }[];
}

export const AlertChart = ({ data }: AlertChartProps) => (
  <div className="mb-8">
    <CustomLineChart
      data={data.map((item) => ({ ...item, alerts: item.value }))}
      title="Evolución de Alertas"
      subtitle="Últimos 7 días"
      dataKey="value"
      color="#c5a059"
    />
  </div>
);

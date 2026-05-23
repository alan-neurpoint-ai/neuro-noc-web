import { BiCheckbox } from 'react-icons/bi';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { DataTable } from '../../../../core/presentation/components/ui/DataTable';

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

// Mock data
const mockPayments: PaymentRecord[] = [
  {
    id: 'PAY-2026-00147',
    date: '2026-05-09',
    amount: 12500.0,
    method: 'Transferencia Bancaria',
    status: 'completed',
    description: 'Factura mensual - Servicio monitorización',
  },
  {
    id: 'PAY-2026-00146',
    date: '2026-04-15',
    amount: 8400.0,
    method: 'Tarjeta de crédito',
    status: 'completed',
    description: 'Renovación licencia anual - Plataforma NOC',
  },
  {
    id: 'PAY-2026-00145',
    date: '2026-04-01',
    amount: 3200.0,
    method: 'Transferencia Bancaria',
    status: 'pending',
    description: 'Ajuste por servicios adicionales',
  },
  {
    id: 'PAY-2026-00144',
    date: '2026-03-20',
    amount: 15000.0,
    method: 'Pago contra entrega',
    status: 'completed',
    description: 'Implementación módulo IA - Primera fase',
  },
  {
    id: 'PAY-2026-00143',
    date: '2026-03-05',
    amount: 4500.0,
    method: 'Tarjeta de crédito',
    status: 'failed',
    description: 'Cargo por penalización - SLA incumplido',
  },
  {
    id: 'PAY-2026-00142',
    date: '2026-02-28',
    amount: 6700.0,
    method: 'Transferencia Bancaria',
    status: 'completed',
    description: 'Soporte técnico premium - Febrero',
  },
  {
    id: 'PAY-2026-00141',
    date: '2026-02-10',
    amount: 22100.0,
    method: 'Transferencia Bancaria',
    status: 'completed',
    description: 'Paquete integral Q1 - Monitoreo + IA',
  },
  {
    id: 'PAY-2026-00140',
    date: '2026-01-15',
    amount: 9800.0,
    method: 'Tarjeta de débito',
    status: 'completed',
    description: 'Licencia de usuario - 10 nodos',
  },
  {
    id: 'PAY-2026-00139',
    date: '2026-01-03',
    amount: 14200.0,
    method: 'Transferencia Bancaria',
    status: 'completed',
    description: 'Setup inicial + onboarding',
  },
  {
    id: 'PAY-2025-01201',
    date: '2025-12-20',
    amount: 5300.0,
    method: 'Tarjeta de crédito',
    status: 'completed',
    description: 'Mantenimiento preventivo - Diciembre',
  },
  {
    id: 'PAY-2025-01200',
    date: '2025-12-01',
    amount: 18500.0,
    method: 'Transferencia Bancaria',
    status: 'completed',
    description: 'Contrato anual - Ciclo 2025',
  },
  {
    id: 'PAY-2025-01199',
    date: '2025-11-18',
    amount: 7600.0,
    method: 'Pago contra entrega',
    status: 'completed',
    description: 'Consultoría especializada - Red core',
  },
];

export const PaymentHistory = () => {
  const columns = [
    { header: 'ID Pago', accessor: (item: PaymentRecord) => item.id },
    { header: 'Fecha', accessor: (item: PaymentRecord) => item.date },
    {
      header: 'Monto',
      accessor: (item: PaymentRecord) =>
        `$${item.amount.toLocaleString('es-ES')}`,
    },
    { header: 'Método', accessor: (item: PaymentRecord) => item.method },
    {
      header: 'Estado',
      accessor: (item: PaymentRecord) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-medium ${
            item.status === 'completed'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : item.status === 'pending'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {item.status === 'completed'
            ? 'Completado'
            : item.status === 'pending'
              ? 'Pendiente'
              : 'Fallido'}
        </span>
      ),
    },
    {
      header: 'Descripción',
      accessor: (item: PaymentRecord) => item.description,
    },
  ];

  return (
    <Card variant="glass" className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <BiCheckbox className="text-brand-accent text-lg" />
        <h3 className="text-sm font-headline font-bold text-text-main uppercase">
          Historial de Pagos
        </h3>
      </div>
      <DataTable columns={columns} data={mockPayments} />
    </Card>
  );
};

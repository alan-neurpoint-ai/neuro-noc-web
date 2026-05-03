import type { BillingInfo } from "../../core/entities/analytics";
import { formatDate, getStatusBadge } from "./formatters";

export const MOCK_BILLING_INFO: BillingInfo[] = [
  {
    period: "Enero 2026",
    amount: 1500,
    status: "paid",
    dueDate: "2026-01-15",
    invoiceNumber: "INV-001",
  },
  {
    period: "Febrero 2026",
    amount: 1500,
    status: "paid",
    dueDate: "2026-02-15",
    invoiceNumber: "INV-002",
  },
  {
    period: "Marzo 2026",
    amount: 1500,
    status: "pending",
    dueDate: "2026-03-15",
    invoiceNumber: "INV-003",
  },
  {
    period: "Abril 2026",
    amount: 1500,
    status: "pending",
    dueDate: "2026-04-15",
    invoiceNumber: "INV-004",
  },
  {
    period: "Mayo 2026",
    amount: 1500,
    status: "pending",
    dueDate: "2026-05-15",
    invoiceNumber: "INV-005",
  },
  {
    period: "Junio 2026",
    amount: 1500,
    status: "pending",
    dueDate: "2026-06-15",
    invoiceNumber: "INV-006",
  },
];

export const BILLING_COLUMNS = [
  {
    header: "Periodo",
    accessor: (item: any) => (
      <span className="font-medium text-text-primary">{item.period}</span>
    ),
  },
  { header: "Factura", accessor: "invoiceNumber" as keyof any },
  {
    header: "Monto",
    accessor: (item: any) => (
      <span className="font-bold text-text-primary">
        ${item.amount.toLocaleString()}
      </span>
    ),
  },
  { header: "Estado", accessor: (item: any) => getStatusBadge(item.status) },
  {
    header: "Vencimiento",
    accessor: (item: any) => (
      <span className="text-text-secondary text-sm">
        {formatDate(item.dueDate)}
      </span>
    ),
  },
];

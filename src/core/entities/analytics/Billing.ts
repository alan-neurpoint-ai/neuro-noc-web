export interface BillingInfo {
  period: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  invoiceNumber: string;
}

export interface BillingItem {
  id: string;
  period: string;
  invoiceNumber: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
}

export interface InfoRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

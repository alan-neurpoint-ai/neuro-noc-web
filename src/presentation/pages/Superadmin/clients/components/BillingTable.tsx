import { HiCreditCard } from "react-icons/hi";
import type { BillingItem } from "../../../../../core/entities/analytics";
import { Table } from "../../../../components/ui";

interface BillingTableProps {
  data: BillingItem[];
  columns: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const BillingTable = ({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: BillingTableProps) => (
  <div>
    <div className="flex items-center gap-2 mb-5">
      <div className="p-1.5 bg-accent/10 rounded-lg">
        <HiCreditCard className="text-accent text-sm" />
      </div>
      <h2 className="text-[11px] uppercase tracking-[0.25em] text-accent font-black">
        Periodos de Facturación
      </h2>
    </div>

    <Table
      data={data}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  </div>
);

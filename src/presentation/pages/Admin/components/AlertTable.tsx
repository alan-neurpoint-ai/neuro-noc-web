import { useNavigate } from "react-router";
import type { Alert } from "../../../../core/entities/supabase/Alert";
import { Table } from "../../../components/ui";
import { getAlertColumns } from "../../../utils/alertColumns";

interface AlertTableProps {
  alerts: Alert[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const AlertTable = ({
  alerts,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: AlertTableProps) => {
  const navigate = useNavigate();

  return (
    <Table
      data={alerts}
      columns={getAlertColumns(navigate)}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
};

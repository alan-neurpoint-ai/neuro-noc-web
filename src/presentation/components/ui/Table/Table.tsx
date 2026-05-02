import type { ReactNode } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { Button } from "../Button/Button";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Table = <T extends { id: string | number }>({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: TableProps<T>) => {
  const emptyRows = Math.max(0, 10 - data.length);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="glass-card overflow-hidden border border-muted/20 relative">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-muted/20 bg-surface/30">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-accent font-medium ${col.className}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/10">
            {data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-accent/5 transition-colors duration-200 group"
              >
                {columns.map((col, index) => (
                  <td
                    key={index}
                    className={`px-6 py-4 text-sm text-text-secondary group-hover:text-text-primary ${col.className}`}
                  >
                    {typeof col.accessor === "function"
                      ? col.accessor(item)
                      : (item[col.accessor] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}

            {emptyRows > 0 &&
              Array.from({ length: emptyRows }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-13.25">
                  {columns.map((_, index) => (
                    <td key={index} className="px-6 py-4">
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>

        {isLoading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent animate-pulse">
              Sincronizando Sistemas...
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">
          Sistema /{" "}
          <span className="text-text-secondary">
            Pág {currentPage} de {totalPages}
          </span>
        </span>

        <div className="flex gap-3">
          <Button
            variant="exit"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="min-w-0 w-10 h-10 p-0 flex items-center justify-center"
          >
            <HiChevronLeft size={20} />
          </Button>

          <Button
            variant="exit"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className={`min-w-0 w-10 h-10 p-0 flex items-center justify-center rotate-180`}
          >
            <HiChevronLeft size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

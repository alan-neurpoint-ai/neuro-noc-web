import {} from "react-icons";
import { Button } from "./Button";
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
} from "react-icons/bi";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination = ({
  currentPage,
  totalItems,
  onPageChange,
  isLoading = false,
}: PaginationProps) => {
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="flex flex-col items-center space-y-2 py-4">
      <div className="flex items-center justify-center space-x-2 font-headline">
        <Button
          variant="ghost"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          className="p-2 min-w-10 h-10 rounded-[20px]"
          icon={<BiChevronsLeft size={16} />}
        />

        <Button
          variant="view"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="p-2 min-w-10 h-10 rounded-[20px]"
          icon={<BiChevronLeft size={16} />}
        />

        <div className="flex items-center space-x-1 px-2">
          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={`
                w-10 h-10 text-xs font-black transition-all duration-300 rounded-[20px]
                ${
                  currentPage === page
                    ? "bg-brand-primary text-white shadow-[0_0_15px_rgba(103,45,169,0.4)]"
                    : "text-text-muted hover:bg-brand-primary/10 hover:text-brand-primary"
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          variant="view"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="p-2 min-w-10 h-10 rounded-[20px]"
          icon={<BiChevronRight size={16} />}
        />

        <Button
          variant="ghost"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          className="p-2 min-w-10 h-10 rounded-[20px]"
          icon={<BiChevronsRight size={16} />}
        />
      </div>

      <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
        Mostrando <span className="text-brand-accent">{PAGE_SIZE}</span> de{" "}
        <span className="text-brand-accent">{totalItems}</span> registros
      </p>
    </div>
  );
};

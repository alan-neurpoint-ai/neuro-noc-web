import { type ReactNode } from 'react';
import { Loading } from './Loading';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  loadingMessage?: string;
  onRowClick?: (item: T) => void;
  title?: string;
  subtitle?: string;
}

const SKELETON_OPACITIES = [
  'opacity-30',
  '[opacity:0.27]',
  '[opacity:0.24]',
  '[opacity:0.21]',
  '[opacity:0.18]',
  '[opacity:0.15]',
  '[opacity:0.12]',
  '[opacity:0.09]',
];

export function DataTable<T>({
  columns,
  data,
  isLoading,
  loadingMessage,
  onRowClick,
  title,
  subtitle,
}: DataTableProps<T>) {
  return (
    <div className="w-full rounded-2xl h-170 overflow-hidden flex flex-col bg-bg-elevated border border-[var(--border-subtle)] shadow-lg">
      <div className="h-0.75 w-full shrink-0 bg-gradient-to-r from-transparent via-brand-secondary/50 to-transparent" />

      {(title || subtitle) && (
        <div className="px-8 pt-6 pb-4 flex items-end justify-between border-b border-[var(--border-subtle)] shrink-0">
          <div>
            {title && (
              <h2 className="text-lg font-headline font-bold tracking-tight text-text-on-elevated uppercase">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs mt-0.5 text-text-muted">{subtitle}</p>
            )}
          </div>
          {!isLoading && (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20">
              {data.length} registros
            </span>
          )}
        </div>
      )}

      <div className="relative flex-1 h-140 overflow-hidden flex flex-col">
        {isLoading && <Loading variant="overlay" message={loadingMessage} />}

        <div className="overflow-y-auto overflow-x-auto p-4 h-full scrollbar-thin scrollbar-thumb-brand-primary/20">
          <table className="w-full text-left [border-spacing:0_3px]">
            <thead className="sticky top-0 z-20 bg-bg-elevated/80 backdrop-blur-md">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-text-on-elevated-muted border-b border-border-subtle ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className={SKELETON_OPACITIES[i]}>
                    {columns.map((_, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-5 py-4 bg-hover-bg border-y border-brand-secondary/5"
                      />
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="h-100 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-brand-primary/20 border border-brand-secondary/20">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M3 5h14M3 10h14M3 15h8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-muted">
                          Sin datos disponibles
                        </p>
                        <p className="text-xs text-text-muted/60">
                          No hay registros para mostrar
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, rowIdx) => (
                  <tr
                    key={rowIdx}
                    onClick={() => onRowClick?.(item)}
                    className="group transition-all duration-200 cursor-pointer"
                  >
                    {columns.map((col, colIdx) => {
                      const isFirst = colIdx === 0;
                      const isLast = colIdx === columns.length - 1;
                      return (
                        <td
                          key={colIdx}
                          className={`px-5 py-4 text-sm font-medium relative group-hover:bg-brand-primary/20 group-hover:text-text-on-elevated text-text-on-elevated bg-text-on-elevated/3 border-y border-border-subtle ${isFirst ? 'border-l border-border-subtle rounded-l-xl' : ''} ${isLast ? 'border-r border-border-subtle rounded-r-xl' : ''} ${col.className || ''}`}
                        >
                          {isFirst && (
                            <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-b from-brand-secondary to-brand-primary transition-opacity" />
                          )}
                          {typeof col.accessor === 'function'
                            ? col.accessor(item)
                            : (item[col.accessor] as ReactNode)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && (
        <div className="px-8 py-3 flex items-center justify-between border-t border-[var(--border-subtle)] shrink-0 bg-bg-surface">
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
            {data.length > 0
              ? `Mostrando ${data.length} registros`
              : 'Esperando datos'}
          </span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-brand-secondary' : 'bg-brand-secondary/10'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
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
    <div
      className="w-full rounded-2xl overflow-hidden flex flex-col"
      style={{
        background:
          'linear-gradient(160deg, #2d1b69 0%, #1a0f3e 60%, #0d0820 100%)',
        boxShadow:
          '0 0 0 1px rgba(178,154,244,0.08), 0 32px 64px rgba(0,0,0,0.6), 0 0 80px rgba(103,45,169,0.12)',
      }}
    >
      {/* Línea de acento superior */}
      <div
        className="h-0.75 w-full shrink-0"
        style={{
          background:
            'linear-gradient(90deg, transparent, #b29af4 30%, #672da9 70%, transparent)',
        }}
      />

      {/* Header del DataTable */}
      {(title || subtitle) && (
        <div
          className="px-8 pt-6 pb-4 flex items-end justify-between border-b shrink-0"
          style={{ borderColor: 'rgba(178,154,244,0.08)' }}
        >
          <div>
            {title && (
              <h2
                className="text-lg font-bold tracking-tight text-white uppercase"
                style={{ fontFamily: "'Stack Sans Headline', sans-serif" }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs mt-0.5 text-gray-400">{subtitle}</p>
            )}
          </div>
          {!isLoading && (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full text-brand-accent bg-brand-accent/10 border border-brand-accent/20">
              {data.length} registros
            </span>
          )}
        </div>
      )}

      {/* Contenedor con ALTURA FIJA h-140 */}
      <div className="relative flex-1 h-[560px] overflow-hidden flex flex-col">
        {isLoading && <Loading variant="overlay" message={loadingMessage} />}

        {/* Scrollbox con altura fija h-140 */}
        <div className="overflow-y-auto overflow-x-auto p-4 h-full scrollbar-thin scrollbar-thumb-brand-primary/20">
          <table
            className="w-full text-left border-separate"
            style={{ borderSpacing: '0 3px' }}
          >
            <thead className="sticky top-0 z-20 bg-[#1a0f3e]/80 backdrop-blur-md">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] ${col.className || ''}`}
                    style={{
                      color: 'rgba(178,154,244,0.55)',
                      borderBottom: '1px solid rgba(178,154,244,0.12)',
                    }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} style={{ opacity: 0.3 - i * 0.03 }}>
                    {columns.map((_, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-5 py-4 bg-white/5 border-y border-brand-accent/5"
                      />
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-[400px] text-center"
                  >
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-brand-primary/20 border border-brand-accent/20">
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
                        <p className="text-sm font-semibold text-white/50">
                          Sin datos disponibles
                        </p>
                        <p className="text-xs text-white/30">
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
                          className={`px-5 py-4 text-sm font-medium relative group-hover:bg-brand-primary/20 group-hover:text-white ${col.className || ''}`}
                          style={{
                            color: 'rgba(255,255,255,0.75)',
                            background: 'rgba(255,255,255,0.025)',
                            borderTop: '1px solid rgba(178,154,244,0.05)',
                            borderBottom: '1px solid rgba(178,154,244,0.05)',
                            borderLeft: isFirst
                              ? '1px solid rgba(178,154,244,0.05)'
                              : 'none',
                            borderRight: isLast
                              ? '1px solid rgba(178,154,244,0.05)'
                              : 'none',
                            borderRadius: isFirst
                              ? '12px 0 0 12px'
                              : isLast
                                ? '0 12px 12px 0'
                                : '0',
                          }}
                        >
                          {isFirst && (
                            <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full opacity-0 group-hover:opacity-100 bg-linear-to-b from-brand-accent to-brand-primary transition-opacity" />
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

      {/* Footer del DataTable */}
      {!isLoading && (
        <div className="px-8 py-3 flex items-center justify-between border-t border-brand-accent/10 shrink-0 bg-black/10">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">
            {data.length > 0
              ? `Mostrando ${data.length} registros`
              : 'Esperando datos'}
          </span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: i === 0 ? '#b29af4' : 'rgba(178,154,244,0.1)',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

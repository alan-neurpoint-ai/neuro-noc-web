import { type ReactNode } from "react";
import { Loading } from "./Loading";

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
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #2d1b69 0%, #1a0f3e 60%, #0d0820 100%)",
        boxShadow:
          "0 0 0 1px rgba(178,154,244,0.08), 0 32px 64px rgba(0,0,0,0.6), 0 0 80px rgba(103,45,169,0.12)",
      }}
    >
      <div
        className="h-0.75 w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, #b29af4 30%, #672da9 70%, transparent)",
        }}
      />

      {(title || subtitle) && (
        <div
          className="px-8 pt-6 pb-4 flex items-end justify-between border-b"
          style={{ borderColor: "rgba(178,154,244,0.08)" }}
        >
          <div>
            {title && (
              <h2
                className="text-lg font-bold tracking-tight"
                style={{
                  fontFamily: "'Stack Sans Headline', sans-serif",
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                {subtitle}
              </p>
            )}
          </div>

          {!isLoading && (
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
              style={{
                color: "#b29af4",
                background: "rgba(178,154,244,0.08)",
                border: "1px solid rgba(178,154,244,0.15)",
              }}
            >
              {data.length} registros
            </span>
          )}
        </div>
      )}

      <div className="relative">
        {isLoading && <Loading variant="overlay" message={loadingMessage} />}

        <div className="overflow-auto p-4">
          <table
            className="w-full text-left border-separate"
            style={{ borderSpacing: "0 3px" }}
          >
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] ${
                      col.className || ""
                    }`}
                    style={{
                      color: "rgba(178,154,244,0.55)",
                      borderBottom: "1px solid rgba(178,154,244,0.08)",
                    }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ opacity: 0.3 - i * 0.05 }}>
                    {columns.map((_, colIdx) => {
                      const isFirst = colIdx === 0;
                      const isLast = colIdx === columns.length - 1;
                      return (
                        <td
                          key={colIdx}
                          className="px-5 py-4"
                          style={{
                            background: "rgba(255,255,255,0.012)",
                            borderTop: "1px solid rgba(178,154,244,0.03)",
                            borderBottom: "1px solid rgba(178,154,244,0.03)",
                            borderLeft: isFirst
                              ? "1px solid rgba(178,154,244,0.03)"
                              : "none",
                            borderRight: isLast
                              ? "1px solid rgba(178,154,244,0.03)"
                              : "none",
                            borderRadius: isFirst
                              ? "12px 0 0 12px"
                              : isLast
                                ? "0 12px 12px 0"
                                : "0",
                          }}
                        >
                          <div
                            className="h-3 rounded-full"
                            style={{
                              background: "rgba(178,154,244,0.04)",
                              width: isFirst ? "55%" : isLast ? "35%" : "72%",
                            }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{
                          background: "rgba(103,45,169,0.15)",
                          border: "1px solid rgba(178,154,244,0.12)",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M3 5h14M3 10h14M3 15h8"
                            stroke="rgba(178,154,244,0.4)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          Sin datos disponibles
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "rgba(156,163,175,0.5)" }}
                        >
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
                    className="group"
                    style={{
                      cursor: onRowClick ? "pointer" : "default",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {columns.map((col, colIdx) => {
                      const isFirst = colIdx === 0;
                      const isLast = colIdx === columns.length - 1;
                      return (
                        <td
                          key={colIdx}
                          className={`px-5 py-4 text-sm font-medium relative ${
                            col.className || ""
                          }`}
                          style={{
                            color: "rgba(255,255,255,0.75)",
                            background: "rgba(255,255,255,0.025)",
                            borderTop: "1px solid rgba(178,154,244,0.05)",
                            borderBottom: "1px solid rgba(178,154,244,0.05)",
                            borderLeft: isFirst
                              ? "1px solid rgba(178,154,244,0.05)"
                              : "none",
                            borderRight: isLast
                              ? "1px solid rgba(178,154,244,0.05)"
                              : "none",
                            borderRadius: isFirst
                              ? "12px 0 0 12px"
                              : isLast
                                ? "0 12px 12px 0"
                                : "0",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            const row = (e.currentTarget as HTMLElement)
                              .parentElement;
                            if (!row) return;
                            Array.from(row.children).forEach((cell) => {
                              const el = cell as HTMLElement;
                              el.style.background = "rgba(103,45,169,0.18)";
                              el.style.color = "#ffffff";
                              el.style.borderColor = "rgba(178,154,244,0.18)";
                            });
                          }}
                          onMouseLeave={(e) => {
                            const row = (e.currentTarget as HTMLElement)
                              .parentElement;
                            if (!row) return;
                            Array.from(row.children).forEach((cell) => {
                              const el = cell as HTMLElement;
                              el.style.background = "rgba(255,255,255,0.025)";
                              el.style.color = "rgba(255,255,255,0.75)";
                              el.style.borderColor = "rgba(178,154,244,0.05)";
                            });
                          }}
                        >
                          {isFirst && (
                            <div
                              className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full opacity-0 group-hover:opacity-100"
                              style={{
                                background:
                                  "linear-gradient(180deg, #b29af4, #672da9)",
                                transition: "opacity 0.2s ease",
                              }}
                            />
                          )}

                          {typeof col.accessor === "function"
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

      {!isLoading && data.length > 0 && (
        <div
          className="px-8 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(178,154,244,0.06)" }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(156,163,175,0.35)" }}
          >
            Mostrando {data.length} de {data.length}
          </span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full"
                style={{
                  background: i === 0 ? "#b29af4" : "rgba(178,154,244,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

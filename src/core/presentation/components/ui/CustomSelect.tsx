import React, { useState, useRef, useEffect } from "react";

export interface SelectOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  className?: string;

  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Selecciona una opción...",
  label,
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState<string | number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx = options.findIndex((o) => o.value === focused);
        const next =
          e.key === "ArrowDown"
            ? Math.min(idx + 1, options.length - 1)
            : Math.max(idx - 1, 0);
        setFocused(options[next]?.value ?? null);
      }
      if (e.key === "Enter" && focused !== null) {
        onChange(focused);
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, focused, options, onChange]);

  const toggle = () => {
    if (!disabled) {
      const willOpen = !isOpen;
      setIsOpen(willOpen);
      if (willOpen) {
        setFocused(selectedOption?.value ?? options[0]?.value ?? null);
      }
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && (
        <span
          className="text-[10px] font-black uppercase tracking-[0.25em] ml-1 transition-colors duration-200"
          style={{ color: isOpen ? "#b29af4" : "rgba(178,154,244,0.55)" }}
        >
          {label}
        </span>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group"
          style={{
            background: isOpen
              ? "linear-gradient(135deg, rgba(103,45,169,0.22) 0%, rgba(45,27,105,0.35) 100%)"
              : "linear-gradient(135deg, rgba(45,27,105,0.18) 0%, rgba(13,8,32,0.4) 100%)",
            border: isOpen
              ? "1px solid rgba(178,154,244,0.45)"
              : "1px solid rgba(178,154,244,0.12)",
            boxShadow: isOpen
              ? "0 0 0 3px rgba(103,45,169,0.18), 0 0 20px rgba(178,154,244,0.1), inset 0 1px 0 rgba(178,154,244,0.08)"
              : "0 1px 0 rgba(178,154,244,0.04), inset 0 1px 0 rgba(255,255,255,0.02)",
            backdropFilter: "blur(12px)",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.45 : 1,
          }}
        >
          {selectedOption?.icon && (
            <span
              className="shrink-0 flex items-center justify-center w-6 h-6 rounded-lg"
              style={{ background: "rgba(178,154,244,0.1)" }}
            >
              {selectedOption.icon}
            </span>
          )}

          <span className="flex-1 min-w-0">
            {selectedOption ? (
              <span className="flex flex-col gap-0">
                <span
                  className="text-sm font-semibold truncate block"
                  style={{ color: "#ffffff" }}
                >
                  {selectedOption.label}
                </span>
                {selectedOption.description && (
                  <span
                    className="text-[10px] truncate block"
                    style={{ color: "rgba(178,154,244,0.5)" }}
                  >
                    {selectedOption.description}
                  </span>
                )}
              </span>
            ) : (
              <span
                className="text-sm"
                style={{ color: "rgba(156,163,175,0.5)" }}
              >
                {placeholder}
              </span>
            )}
          </span>

          <span
            className="shrink-0 flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-300"
            style={{
              background: isOpen
                ? "rgba(103,45,169,0.35)"
                : "rgba(178,154,244,0.06)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 4L6 8L10 4"
                stroke={isOpen ? "#b29af4" : "rgba(178,154,244,0.5)"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div
            ref={listRef}
            role="listbox"
            className="absolute z-50 w-full mt-2 rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, #2d1b69 0%, #1a0f3e 60%, #0d0820 100%)",
              border: "1px solid rgba(178,154,244,0.18)",
              boxShadow: [
                "0 0 0 1px rgba(103,45,169,0.2)",
                "0 20px 60px rgba(0,0,0,0.7)",
                "0 0 40px rgba(103,45,169,0.15)",
              ].join(", "),
              backdropFilter: "blur(20px)",
              animation: "selectOpen 0.18s cubic-bezier(0.16,1,0.3,1) forwards",
            }}
          >
            <div
              className="h-0.5 w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #b29af4 30%, #672da9 70%, transparent)",
              }}
            />

            <div
              className="max-h-56 overflow-y-auto py-1.5"
              style={{ scrollbarWidth: "none" }}
            >
              {options.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <span
                    className="text-xs"
                    style={{ color: "rgba(178,154,244,0.35)" }}
                  >
                    Sin opciones disponibles
                  </span>
                </div>
              ) : (
                options.map((option) => {
                  const isSelected = option.value === value;
                  const isFocused = option.value === focused;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setFocused(option.value)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-150 relative group"
                      style={{
                        background: isSelected
                          ? "rgba(103,45,169,0.22)"
                          : isFocused
                            ? "rgba(178,154,244,0.07)"
                            : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-all duration-200"
                        style={{
                          background:
                            "linear-gradient(180deg, #b29af4, #672da9)",
                          opacity: isSelected ? 1 : 0,
                        }}
                      />

                      {option.icon && (
                        <span
                          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150"
                          style={{
                            background: isSelected
                              ? "rgba(178,154,244,0.18)"
                              : "rgba(178,154,244,0.06)",
                          }}
                        >
                          {option.icon}
                        </span>
                      )}

                      <span className="flex flex-col gap-0 min-w-0 flex-1">
                        <span
                          className="text-sm font-semibold truncate block transition-colors duration-150"
                          style={{
                            color: isSelected
                              ? "#b29af4"
                              : isFocused
                                ? "#ffffff"
                                : "rgba(255,255,255,0.72)",
                          }}
                        >
                          {option.label}
                        </span>
                        {option.description && (
                          <span
                            className="text-[10px] truncate block"
                            style={{ color: "rgba(178,154,244,0.38)" }}
                          >
                            {option.description}
                          </span>
                        )}
                      </span>

                      {isSelected && (
                        <span className="shrink-0 ml-auto">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M2.5 7L5.5 10L11.5 4"
                              stroke="#b29af4"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

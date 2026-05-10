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
          className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] ml-1 transition-colors duration-200"
          style={{ color: isOpen ? "#b29af4" : "rgba(178,154,244,0.5)" }}
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
          className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 text-left group"
          style={{
            background: isOpen
              ? "linear-gradient(135deg, rgba(103, 45, 169, 0.25) 0%, rgba(45, 27, 105, 0.4) 100%)"
              : "linear-gradient(135deg, rgba(45, 27, 105, 0.2) 0%, rgba(13, 8, 32, 0.45) 100%)",
            border: `1px solid ${isOpen ? "rgba(178,154,244,0.5)" : "rgba(178,154,244,0.12)"}`,
            boxShadow: isOpen
              ? "0 0 0 3px rgba(103,45,169,0.2), 0 0 24px rgba(103,45,169,0.2)"
              : "0 2px 8px rgba(0,0,0,0.3)",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.45 : 1,
          }}
        >
          <span className="flex-1 min-w-0 flex items-center gap-2">
            {selectedOption?.icon && (
              <span
                className="shrink-0 flex items-center justify-center w-5 h-5 rounded-md"
                style={{ background: "rgba(178,154,244,0.12)" }}
              >
                {selectedOption.icon}
              </span>
            )}
            {selectedOption ? (
              <span
                className="text-sm font-headline font-semibold truncate"
                style={{ color: "#ffffff" }}
              >
                {selectedOption.label}
              </span>
            ) : (
              <span
                className="text-sm font-headline"
                style={{ color: "rgba(156,163,175,0.5)" }}
              >
                {placeholder}
              </span>
            )}
          </span>

          <span
            className="shrink-0 flex items-center justify-center w-5 h-5 rounded-md transition-all duration-300"
            style={{
              background: isOpen
                ? "rgba(178,154,244,0.2)"
                : "rgba(178,154,244,0.08)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 4L6 8L10 4"
                stroke={isOpen ? "#b29af4" : "rgba(178,154,244,0.6)"}
                strokeWidth="2"
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
            className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, #2d1b69 0%, #1a0f3e 50%, #0d0820 100%)",
              border: "1px solid rgba(178,154,244,0.2)",
              boxShadow: [
                "0 0 0 1px rgba(103,45,169,0.15)",
                "0 16px 48px rgba(0,0,0,0.6)",
                "0 0 30px rgba(103,45,169,0.1)",
              ].join(", "),
              backdropFilter: "blur(16px)",
              animation: "selectOpen 0.2s cubic-bezier(0.16,1,0.3,1) forwards",
            }}
          >
            <div className="relative">
              <div
                className="absolute inset-x-0 top-0 h-0.5"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #b29af4 20%, #672da9 80%, transparent)",
                }}
              />
            </div>

            <div className="max-h-60 overflow-y-auto py-1.5">
              {options.length === 0 ? (
                <div className="px-4 py-5 text-center">
                  <span
                    className="text-xs font-headline"
                    style={{ color: "rgba(178,154,244,0.4)" }}
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
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-all duration-150 relative group"
                      style={{
                        background: isSelected
                          ? "linear-gradient(90deg, rgba(103,45,169,0.2) 0%, rgba(103,45,169,0.05) 100%)"
                          : isFocused
                            ? "rgba(178,154,244,0.08)"
                            : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full transition-all duration-200"
                        style={{
                          background:
                            "linear-gradient(180deg, #b29af4, #672da9)",
                          opacity: isSelected ? 1 : 0,
                        }}
                      />

                      {option.icon && (
                        <span
                          className="shrink-0 flex items-center justify-center w-6 h-6 rounded-md"
                          style={{
                            background: isSelected
                              ? "rgba(178,154,244,0.2)"
                              : "rgba(178,154,244,0.08)",
                          }}
                        >
                          {option.icon}
                        </span>
                      )}

                      <span className="flex flex-col gap-0 min-w-0 flex-1">
                        <span
                          className="text-sm font-headline font-medium truncate"
                          style={{
                            color: isSelected
                              ? "#b29af4"
                              : isFocused
                                ? "#ffffff"
                                : "rgba(255,255,255,0.7)",
                          }}
                        >
                          {option.label}
                        </span>
                        {option.description && (
                          <span
                            className="text-[10px] font-headline truncate"
                            style={{ color: "rgba(178,154,244,0.4)" }}
                          >
                            {option.description}
                          </span>
                        )}
                      </span>

                      {isSelected && (
                        <span className="shrink-0">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M2.5 7L5.5 10L11.5 4"
                              stroke="#b29af4"
                              strokeWidth="2"
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

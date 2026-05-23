import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function combineClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SelectOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface CustomSelectProperties {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Selecciona...',
  label,
  className = '',
  disabled = false,
}: CustomSelectProperties) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedOptionValue, setFocusedOptionValue] = useState<
    string | number | null
  >(null);
  const containerReference = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const closeDropdown = useCallback(() => setIsDropdownOpen(false), []);

  const handleToggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsDropdownOpen((prev) => {
        const next = !prev;
        if (next)
          setFocusedOptionValue(
            selectedOption?.value ?? options[0]?.value ?? null
          );
        return next;
      });
    }
  }, [disabled, selectedOption, options]);

  useEffect(() => {
    const handleExternalClick = (event: MouseEvent) => {
      if (
        containerReference.current &&
        !containerReference.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleExternalClick);
    return () => document.removeEventListener('mousedown', handleExternalClick);
  }, [closeDropdown]);

  // Manejo de teclado simplificado para el test
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDropdown();
      if (e.key === 'ArrowDown') {
        const currentIndex = options.findIndex(
          (o) => o.value === focusedOptionValue
        );
        const nextIndex = (currentIndex + 1) % options.length;
        setFocusedOptionValue(options[nextIndex].value);
      }
      if (e.key === 'Enter' && focusedOptionValue !== null) {
        onChange(focusedOptionValue);
        closeDropdown();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen, options, focusedOptionValue, onChange, closeDropdown]);

  return (
    <div
      className={combineClasses('flex flex-col gap-2 w-full', className)}
      ref={containerReference}
    >
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted ml-1">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={handleToggleDropdown}
          disabled={disabled}
          className={combineClasses(
            'w-full flex items-center justify-between gap-4 px-5 py-3 rounded-lg border transition-all duration-200 outline-none',
            isDropdownOpen
              ? 'bg-bg-surface border-brand-primary/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
              : 'bg-bg-surface border-border-default hover:border-[var(--border-default)]',
            disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
          )}
        >
          <span className="flex-1 min-w-0 flex items-center gap-3">
            <span
              className={combineClasses(
                'text-[13px] font-medium tracking-wide',
                selectedOption ? 'text-text-main' : 'text-text-muted'
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={combineClasses(
              'transition-transform duration-300',
              isDropdownOpen ? 'rotate-180' : ''
            )}
          >
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke={isDropdownOpen ? '#6366f1' : 'var(--text-on-elevated)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div
            role="listbox"
            className="absolute z-50 w-full mt-2 rounded-lg bg-bg-surface border border-border-default shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="max-h-64 overflow-y-auto py-1">
              {options.map((option) => {
                const isSelected = option.value === value;
                const isFocused = option.value === focusedOptionValue;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      closeDropdown();
                    }}
                    onMouseEnter={() => setFocusedOptionValue(option.value)}
                    className={combineClasses(
                      'w-full flex flex-col items-start px-5 py-3 transition-colors text-left',
                      isSelected
                        ? 'bg-brand-primary/10'
                        : isFocused
                          ? 'bg-hover-bg'
                          : 'bg-transparent'
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={combineClasses(
                          'text-sm font-medium tracking-tight',
                          isSelected ? 'text-brand-primary' : 'text-text-main'
                        )}
                      >
                        {option.label}
                      </span>
                    </div>
                    {option.description && (
                      <span className="text-[10px] text-text-muted mt-0.5">
                        {option.description}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

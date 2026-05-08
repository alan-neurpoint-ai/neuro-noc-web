import type { InputHTMLAttributes, ReactNode, ChangeEvent } from "react";

const INPUT_PATTERNS = {
  text: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/,
  numeric: /^[0-9]*$/,
  decimal: /^\d*\.?\d*$/,
  alphanumeric: /^[a-zA-Z0-9]*$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phonePrefix: /^\+[0-9]*$/, // Para casos como "+52"
};

export type InputValidationType =
  | keyof typeof INPUT_PATTERNS
  | "password"
  | "datetime"
  | "none";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  validationType?: InputValidationType;
  type?: "text" | "password" | "email" | "number" | "datetime-local" | "tel";
}

export const Input = ({
  label,
  icon,
  error,
  validationType = "none",
  onChange,
  className = "",
  type = "text",
  ...props
}: InputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (
      validationType !== "none" &&
      validationType !== "password" &&
      validationType !== "datetime"
    ) {
      const pattern =
        INPUT_PATTERNS[validationType as keyof typeof INPUT_PATTERNS];
      if (pattern && !pattern.test(e.target.value)) {
        return;
      }
    }
    if (onChange) onChange(e);
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-[10px] font-headline font-black uppercase tracking-[0.2em] text-brand-accent ml-1">
          {label}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-accent transition-colors duration-300">
            {icon}
          </div>
        )}

        <input
          type={type}
          onChange={handleChange}
          className={`
            w-full bg-bg-surface font-headline text-sm text-text-main transition-all duration-300
            ${icon ? "pl-12 pr-4" : "px-5"} py-3.5
            ${"rounded-[15px]"}
            border-2 
            ${
              error
                ? "border-status-error shadow-[0_0_15px_rgba(124,8,8,0.3)]"
                : "border-white/5 focus:border-brand-accent focus:shadow-[0_0_20px_rgba(178,154,244,0.2)]"
            }
            placeholder:text-text-muted/30 outline-none
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <span className="text-[10px] font-bold text-status-error uppercase tracking-widest ml-2 italic">
          {error}
        </span>
      )}
    </div>
  );
};

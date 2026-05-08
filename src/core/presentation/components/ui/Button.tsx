import type { ReactNode, ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "login"
  | "edit"
  | "delete"
  | "logout"
  | "view"
  | "action"
  | "filter"
  | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Button = ({
  variant = "action",
  icon,
  isLoading,
  fullWidth,
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const variantStyles: Record<ButtonVariant, string> = {
    login:
      "bg-brand-primary hover:brightness-110 text-white shadow-[0_0_15px_rgba(103,45,169,0.4)]",

    action: "bg-brand-accent hover:bg-white text-bg-surface shadow-md",

    edit: "bg-blue-500 hover:bg-blue-400 text-white",
    delete: "bg-status-error hover:brightness-110 text-white",
    logout:
      "bg-transparent border border-status-error/40 text-status-error hover:bg-status-error/10",

    view: "bg-bg-card border border-brand-accent/20 text-brand-accent hover:border-brand-accent/50",
    filter:
      "bg-bg-surface border border-white/10 text-text-muted hover:text-white",
    ghost: "bg-transparent hover:bg-white/5 text-text-muted",
  };
  const baseStyles = `
    inline-flex items-center justify-center 
    font-headline font-bold tracking-tight 
    transition-all duration-300 
    active:scale-[0.98] 
    disabled:opacity-50 disabled:pointer-events-none 
    px-6 py-2.5 text-sm 
    rounded-[10px]
  `;

  const widthStyle = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="uppercase text-[9px] tracking-widest opacity-80 font-black">
            Procesando
          </span>
        </span>
      ) : (
        <div className="flex items-center space-x-2">
          {icon && <span className="text-lg leading-none">{icon}</span>}
          {children && <span>{children}</span>}
        </div>
      )}
    </button>
  );
};

import { type ReactNode, type ButtonHTMLAttributes } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'outline'
  | 'ghost'
  | 'action'
  | 'view';

interface ButtonProperties extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Button = ({
  variant = 'primary',
  icon,
  isLoading,
  fullWidth,
  children,
  className = '',
  ...props
}: ButtonProperties) => {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-brand-primary text-white hover:brightness-110 shadow-lg shadow-brand-primary/20',

    secondary: 'bg-brand-secondary text-white hover:brightness-110',

    tertiary: 'bg-brand-tertiary text-bg-main hover:bg-white',

    danger: 'bg-status-error text-white hover:brightness-110',

    outline:
      'bg-transparent border border-white/10 text-text-main hover:bg-white/5 hover:border-white/20',

    ghost: 'bg-transparent text-text-muted hover:text-white hover:bg-white/5',

    action:
      'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary hover:text-white',

    view: 'bg-white/5 text-white/70 border border-white/10 hover:bg-brand-primary hover:text-white hover:border-brand-primary/30',
  };

  const baseStyles = `
    inline-flex items-center justify-center 
    font-headline font-bold tracking-tight 
    transition-all duration-300 
    active:scale-[0.97] 
    disabled:opacity-40 disabled:pointer-events-none 
    px-6 py-2.5 text-sm 
    rounded-[12px]
    antialiased
  `;

  const widthStyle = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-3">
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
          <span className="font-label uppercase text-[10px] tracking-[0.15em] font-black">
            Processing
          </span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {icon && (
            <span className="text-lg leading-none flex items-center">
              {icon}
            </span>
          )}
          {children && <span>{children}</span>}
        </div>
      )}
    </button>
  );
};
